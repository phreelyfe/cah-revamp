var PORT = process.env.PORT || 5000,
    express = require('express'),
    path = require('path'),
    app = express(),
    compression = require('compression'),
    server = require('http').createServer(app),
    sio = require('socket.io')(server),
    io = sio.listen(server, {
        log: true,
        origins: '*:*'
    }),
    colors = require('colors'),
    logger = require('tracer').colorConsole({
        filters : {
            log : colors.gray,
            trace : colors.magenta,
            debug : colors.blue,
            info : colors.green,
            warn : colors.yellow,
            error : [ colors.red, colors.bold ]
        }
    }),
    mongoose = require('mongoose');
    // Connect To Mongo
    mongoose.connect('mongodb://localhost:3001/cardsAgainstHumanity');

io.set('transports', ['websocket', 
    'flashsocket', 
    'htmlfile', 
    'xhr-polling', 
    'jsonp-polling', 
    'polling'
]);


app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

app.use(compression({
    filter: compressionFilter,
    level: -1
}));

var compressionFilter = function(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}

app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/public'));

app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/scripts', express.static(__dirname + '/bower_components'));

// Import DB's
var Mongo = require('./Models/model.methods');
var Parse = require('./Models/Parse.Functions')();
var CACHE = { 
        games: {},
        gameRooms: { default: "Bigger Blacker Room" },
        // ActiveUsers: [],
        // ActiveGames: [],
        Users: {}
    };
    CACHE.saveGame = function( game ) {
        CACHE.gameRooms[ game.name ] = game.name;
        return CACHE.games[ game.name ] = game;
    };
// Get All Games From Parse
Parse.find('Games', "", function(err, Games){
  // If Error Set Games to Empty Object
  if (err) return CACHE[ 'games' ] = {};
  // Iterate Over Games In Parse
  for (var game in Games.results) {
    // Ref To Game
    var game = Games.results[ game ],
        name = game.name;
    // Save Game Data To Cache
    CACHE[ 'games' ][ name ] = game;
    // Set Game Room
    CACHE.gameRooms[ name ] = name;
  }
});

// Socket Functions
io.on('connection', function(socket) {
/*
    SERVER DATA
*/
    var user = {};
        user.set = function( property, value ) {
            return user[ property ] = value;
        },
        user.get = function( property ) {
            if (!property) return user;
            return user[ property ];
        },
        user.update = function( data ) {
            for (var prop in data) {
                user[ prop ] = data[ prop ];
            }
            return user;
        };
    var game = { data: {} };
        game.set = function( property, value ) {
            return game.data[ property ] = value;
        },
        game.get = function( property ) {
            if (!property) return game.data;
            return game.data[ property ];
        },
        game.update = function( gameData ) {
            if (!gameData) return game.data = {};
            for (var prop in gameData) {
                game.set( prop, gameData[ prop ] );
            }
            return game.get();
        },
        game.clear = function() {
            var types = {
                string: "",
                number: 0,
                object: {},
                Array: []
            }

            for (var prop in game) {
                if (!Array.isArray(game[prop]) && typeof game[prop] === types[ typeof game[prop] ]) return game[prop] = types[ typeof game[prop] ];
                else if (Array.isArray( game[ prop ] )) return game[prop] = types[ typeof game[prop] ];
                else logger.log("Well Not Expected LN: 126 @ game.clear function");
            }
        };

    // User Bind To Cache
    // if (CACHE.Users.hasOwnProperty( user.username )) user.update( CACHE.Users[ user.username ]);
/*
    FIRST FIRE FUNCTIONS
*/
    // Join Default Room
    socket.join( CACHE.gameRooms.default );
    // Get Username
    socket.emit('username');
    // Emit Games To User
    socket.emit('games', CACHE.games );
/*
    GAME FUNCTIONS
*/
    // Create Game
    socket.on('createGame', function(game){
        logger.log("GAME", game);
        // Set Inactive
        game.active = false;
        // Set Creator
        game.creator = user.username;
        // Add Players node
        game.players = [];
        // Save Data
        Parse.insert('Games', game , function (err, response) {
            // Bind Object ID to Game
            game.objectId = response.objectId;
            // Create Game Room Ref
            CACHE.gameRooms[ game.name ] = game.name;
            CACHE.saveGame( game );
            // Update All Users
            io.in( CACHE.gameRooms.default ).emit( 'games', CACHE.games );
            // Server Response
            io.in( CACHE.gameRooms.default ).emit('server', { message: user.username + " Created Game", data: { game: game, response: response } });
            logger.info( user.username + " Created Game", game.name, game.objectId);
        });
    });

    //////////////////
    /// Join Game ///
    ////////////////
    socket.on('joinGame', function( Game ){
        if ( game.get().hasOwnProperty('objectId') ) {
            var g = CACHE.games[ game.get().name ];
        // Check If Player Is Set
            var playerIsSet = g.players.some(function(player){ return player.username === user.username; });
            // console.warn("Player Set?", playerIsSet);
        // Remove Set Player
            // console.warn("Player In Game Before?", g.players);
            g.players.forEach(function(player, i, a){ if ( player.username === user.username ) a.splice(i, 1); });
            // console.warn("Player Removed After?", g.players);
            socket.leave( g.name );
        // Notify All Users In Old GameRoom
            socket.broadcast.to( g.name ).emit('gameData', g);
        }
        // logger.log("Got Game To Join", Game);
        socket.join( Game.name );
        // Set Cached Game Ref
        var gameData = CACHE.games[ Game.name ];

        // Check If Player Already In Game
        var playerIsSet = gameData.players.some(function(player){ return player.username === user.username; });
        // Add this user if not in game
        if (!playerIsSet) gameData.players.push({
            username: user.username,
            cards: [],
            score: 0,
            czarCard: {},
            isPlayer: true,
            isCzar: false
        });
        // Push User Data into Players Node
        // Update Users Active Game
        game.update( gameData );
        CACHE.games[ gameData.name ] = gameData;
        // Update User
        user.update( { game: gameData } );
        // Save To Parse
        // Update Game and Save Data
        socket.emit('setActive', game.get() );
        // Update All Clients Of New User
        logger.warn("Updating Game in Parse", gameData);
        Parse.update( 'Games', gameData.objectId, gameData).then(function(data) {
            // logger.info("Updated Game Successfully", data);
            io.in( CACHE.gameRooms.default ).emit( 'games', CACHE.games );
        }).catch(function(err, res){
            logger.error("Errored Out", err, res);
        });
        // Emit User Data
        // Update Game Data
        socket.emit('user', user );
        // Send Game Data
        io.in( gameData.name ).emit('gameData', gameData );
        // Server Response
        socket.emit('server', { message: "Joined Game", data: {game: game, user: user}})
    });

    ///////////////////
    /// Leave Game ///
    /////////////////
    socket.on('leaveGame', function( Game ){
        if (!Game) return logger.error("No Game To Exit", Game);
        if (Game.hasOwnProperty('name') && CACHE.games[ Game.name ] === 'undefined' ||
            Game.hasOwnProperty('name') && CACHE.games[ Game.name ] === null)
                return logger.error("No Game To Exit", Game);
        logger.warn("Leaving Game", Game);
        // Redundancy Check
        // Verify Users Active Game is Same as
        // Game The User is Trying to Leave
        if (Game.objectId !== user.get().data.activeGame) {
            // Remove User from Active Game
        }
        // Ref to Cache
        var cached = CACHE.games[ Game.name ] || {};
        // Remove Player Node
        var playerIsSet = cached.players.some(function(player){ return player.username === user.username; });
        if (playerIsSet)
            // Remove Player
            cached.players.forEach(function(player, i, a){ if ( player.username === user.get().username ) a.splice(i, 1); }),
            socket.leave( cached.name );
        // Reset Cached Data
        CACHE.games[ cached.name ] = cached;
        // Delete Stored Games
        user.set( 'game', {});
        // Update Local Game Data
        game.update();
        logger.warn("Requesting TO Set Active", game.get());
        socket.emit('setActive', game.get());
        socket.emit('gameData', game.get() );
        // Update Users in Game Lobby
        socket.broadcast.in( cached.name ).emit('gameData', cached);
        // Update All Clients of Game Change
        io.in( CACHE.gameRooms.default ).emit('games', CACHE.games );
        // Send Server Response
        socket.broadcast.in( cached.name ).emit('server', { message: "Removed " + user.get().username + " From Game: " + cached.name, data: game.get() });
        socket.emit('server', { message: "Removed You From Game " + cached.name, data: game.get() });
    });
    






    ////////////////////////////
    /// Return Data To User ///
    //////////////////////////

    // Send Games To Client
    socket.on('games', function(){
        // Send Games To Client
        logger.log("User Requested Games");
        socket.emit('games', CACHE.games);
        socket.emit('server', { message: "Updated Your Games List", data: CACHE.games });
    });


    ///////////////////////////////
    /// Basic Socket Receivers ///
    /////////////////////////////

    // Helper Listener
    socket.on('get', function(property){
        // If No Property, return all data
        socket.emit("server", { 
            message: "Returning All Server Data", 
            data: {
                user: user,
                Cache: CACHE
            }
        });
    });
/*
    SOCKET FUNCTIONS
*/
    // Send User Their Game Data
    
    // Subscribe
    socket.on('subscribe', function(room){
        socket.join(room);
        logger.info(user.username + " Joined Room " + room, user.rooms);
        // Send User Data To Socket
        setTimeout(function(){ socket.emit('user', user); }, 10);
    });
    // Unsubscribe
    socket.on('unsubscribe', function(room){
        socket.leave(room);
        logger.info(user.username + " Left Room " + room, user.rooms);
        // Send User Data To Socket
        setTimeout(function(){ socket.emit('user', user); }, 10);
    });

    // Client Sent User Data
    socket.on('user', function( USER ) {
        logger.log("Server has your USERdata", USER);
        // Bulk Update User Object
        user.update( USER );
        // Store New Socket Info
        user.set('handshake', socket.id);
        user.set('rooms', socket.rooms);
        

        // Check For Previous User Data
        // Do Nothing To Null User
        if (USER.username === "" || USER.username.length === 0) 
            return logger.log("Null User"),
                    // Server Response
                    socket.emit("server", { message: "You're Anonymous", data: user.get() });

        // If User is NOT in CACHE
        if (!CACHE.Users.hasOwnProperty( USER.username )) 
            // Save user to Cache
            CACHE.Users[ USER.username ] = user.get(),
            // Send User Their Game Data
            socket.emit('gameData', CACHE.games[ user.get().data.activeGame ]),
            // Log to console
            logger.log("SENT USER ACTIVE GAME", user.get().data.activeGame);
        // If User In Cache Update Game Object
        else logger.log("User In Cache"),
            logger.warn("USERNAME IN CACHE", USER.username, CACHE.Users),
            user.set('game', CACHE.Users[ USER.username ].game ),
            // Update Local Game Object
            !!user.get().game ? logger.warn("updating local game", CACHE.games[ user.get().game.name ]) : null;
            !!user.get().game ? game.update( CACHE.games[ user.get().game.name ] ) : null;
            !!user.get().game ? socket.join( user.get().game.name ) : null;
        // When Joining Rooms
        // Server needs timeout to
        // Update Socket Data
        setTimeout(function(){
            // Send Client Updated User Data;
            socket.emit('user', user.get());
            socket.emit('gameData', game.get());
            // Server Response
            socket.emit("server", { message: "Your Datas R Belong To Us!", data: {
                user: user.get(), 
                game: game.get()
            } });
        }, 10)
    });
    // Handle User Messaging Service
    socket.on('message', function( details ){
        // Send Client Active Games
        socket.emit('server', { message: "Sending Message To " + details.username, data: details.message });
        if ( details.username !== gameRooms.default ) io.to( details.username ).emit('message', {from: user.username, data: details.message } );
    });
    // Client Requests Game Data
    socket.on('gameData', function( ){
        // Send Client Active Games
        socket.emit('gameData', game.get() );
        socket.emit('server', { message: "Updated Game Data", data: game.get() });
        
    });

    // On Client Disconnect
    socket.on('disconnect', function(error) {
        logger.warn("User Left", error);
    });
});
// Listen To Traffic
server.listen(PORT, function() {
    logger.trace("Socket & Express Server Started on port %d in %s mode", this.address().port, app.settings.env)
});