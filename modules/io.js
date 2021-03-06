/////////////////////////////////////
/////////////////////////////////////
// Require This Line in Index.js ////
// io = require('./sockets'), //
/////////////////////////////////////
/////////////////////////////////////
module.exports = function(io, app) {
    // configure
    io.configure('development', function() {
        //io.set('transports', ['websocket', 'xhr-polling']);
        //io.enable('log');
    });

    io.configure('production', function() {
        io.enable('browser client minification'); // send minified client
        io.enable('browser client etag'); // apply etag caching logic based on version number
        io.set('log level', 1); // reduce logging
        io.set('transports', [ // enable all transports (optional if you want flashsocket)
            'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
        ]);
    });
    // Socket Functions
    io.on('connection', function(socket) {
        // Join Default Room
        socket.join(CACHE.gameRooms.default);
        // Get Username
        socket.emit('username');
        // Emit Games To User
        socket.emit('games', CACHE.games);
        /*
            GAME FUNCTIONS
        */
        // Create Game
        socket.on('createGame', function(game) {
            logger.log("GAME", game);
            // Set Inactive
            game.active = false;
            // Set Creator
            game.creator = user.username;
            // Add Players node
            game.players = [];
            // Czar Name
            game.czar = "";
            // Set Czar Card
            game.czarCard = {};
            // Save Data
            Parse.insert('Games', game, function(err, response) {
                // Bind Object ID to Game
                game.objectId = response.objectId;
                // Create Game Room Ref
                CACHE.gameRooms[game.name] = game.name;
                CACHE.saveGame(game);
                // Update All Users
                io.in(CACHE.gameRooms.default).emit('games', CACHE.games);
                // Server Response
                io.in(CACHE.gameRooms.default).emit('server', {
                    message: user.username + " Created Game",
                    data: {
                        game: game,
                        response: response
                    }
                });
                logger.info(user.username + " Created Game", game.name, game.objectId);
            });
        });

        //////////////////
        /// Join Game ///
        ////////////////
        socket.on('joinGame', function(Game) {
            if (game.get().hasOwnProperty('objectId')) {
                var g = CACHE.games[game.get().name];
                // Check If Player Is Set
                var playerIsSet = g.players.some(function(player) {
                    return player.username === user.username;
                });
                // console.warn("Player Set?", playerIsSet);
                // Remove Set Player
                // console.warn("Player In Game Before?", g.players);
                g.players.forEach(function(player, i, a) {
                    if (player.username === user.username) a.splice(i, 1);
                });
                // console.warn("Player Removed After?", g.players);
                socket.leave(g.name);
                // Notify All Users In Old GameRoom
                socket.broadcast.to(g.name).emit('gameData', g);
            }
            // logger.log("Got Game To Join", Game);
            socket.join(Game.name);
            // Set Cached Game Ref
            var gameData = CACHE.games[Game.name];

            // Check If Player Already In Game
            var playerIsSet = gameData.players.some(function(player) {
                return player.username === user.username;
            });
            // Add this user if not in game
            if (!playerIsSet) gameData.players.push({
                username: user.username,
                cards: [],
                score: 0,
                czarCard: {},
                isCzar: false
            });
            // Push User Data into Players Node
            // Update Users Active Game
            game.update(gameData);
            CACHE.games[gameData.name] = gameData;
            // Update User
            user.update({
                game: gameData
            });
            // Save To Parse
            // Update Game and Save Data
            socket.emit('setActive', game.get());
            // Update All Clients Of New User
            logger.warn("Updating Game in Parse", gameData);
            Parse.update('Games', gameData.objectId, gameData).then(function(data) {
                // logger.info("Updated Game Successfully", data);
                io.in(CACHE.gameRooms.default).emit('games', CACHE.games);
            }).catch(function(err, res) {
                logger.error("Errored Out", err, res);
            });
            // Emit User Data
            // Update Game Data
            socket.emit('user', user);
            // Send Game Data
            io.in(gameData.name).emit('gameData', gameData);
            // Server Response
            socket.emit('server', {
                message: "Joined Game",
                data: {
                    game: game,
                    user: user
                }
            })
        });

        ///////////////////
        /// Leave Game ///
        /////////////////
        socket.on('leaveGame', function(Game) {
            if (!Game) return logger.error("No Game To Exit", Game);
            if (Game.hasOwnProperty('name') && CACHE.games[Game.name] === 'undefined' ||
                Game.hasOwnProperty('name') && CACHE.games[Game.name] === null)
                return logger.error("No Game To Exit", Game);
            logger.warn("Leaving Game", Game);
            // Redundancy Check
            // Verify Users Active Game is Same as
            // Game The User is Trying to Leave
            if (Game.objectId !== user.get().data.activeGame) {
                // Remove User from Active Game
            }
            // Ref to Cache
            var cached = CACHE.games[Game.name] || {};
            // Remove Player Node
            var playerIsSet = cached.hasOwnProperty('players') ? cached.players.some(function(player) {
                return player.username === user.username;
            }) : false;
            if (playerIsSet)
            // Remove Player
                cached.players.forEach(function(player, i, a) {
                    if (player.username === user.get().username) a.splice(i, 1);
                }),
                socket.leave(cached.name);
            // Reset Cached Data
            CACHE.games[cached.name] = cached;
            // Delete Stored Games
            user.set('game', {});
            // Update Local Game Data
            game.update();
            logger.warn("Requesting TO Set Active", game.get());
            socket.emit('setActive', game.get());
            socket.emit('gameData', game.get());
            // Update Users in Game Lobby
            socket.broadcast.in(cached.name).emit('gameData', cached);
            // Update All Clients of Game Change
            io.in(CACHE.gameRooms.default).emit('games', CACHE.games);
            // Send Server Response
            socket.broadcast.in(cached.name).emit('server', {
                message: "Removed " + user.get().username + " From Game: " + cached.name,
                data: game.get()
            });
            socket.emit('server', {
                message: "Removed You From Game " + cached.name,
                data: game.get()
            });
        });

















        ///////////////////
        /// Start Game ///
        /////////////////
        socket.on('startGame', function(name) {
            if (!CACHE.games[name]) return socket.emit("server", {
                message: "No Game Present In Server",
                data: CACHE.games[name]
            }), logger.log("Starting Game ID: " + name);
            // Start Game
            var Game = CACHE.games[name];
            // logger.debug( "GAME UPDATE FUNCTION",  CACHE.updateGame);
            Game.players.map(function(player) {
                // Only This User Condition
                if (player.cards.length <= 0 && player.username === user.get().username) {
                    // Get Player Cards
                    io.in(name).emit('getCards', {
                        type: 'both',
                        amt: 10,
                        decks: []
                    });
                }
            });
            // Emit Server Response
            socket.emit('server', {
                message: "Waiting For Cards From " + user.username,
                data: user
            });




            // Choose Random Czar
            var randomIdx = (function(g) {
                return Math.floor(Math.random() * g.players.length)
            }(Game));
            // Is there already a Czar?
            var czarIsSet = Game.players.some(function(player) {
                return player.isCzar;
            });
            // If User Index != to randomIdx
            Game.players.forEach(function(player, i) {
                // If This Player Is Same As Random Index
                // And there isn't already a czar
                if (i === randomIdx && !czarIsSet) {
                    player.isCzar = true;
                    Game.czar = player.username;
                }
            });

            // Work on saving data through the layers
            game.update(Game);
            user.update({
                game: Game
            });
            CACHE.updateGame(Game.name, Game);
            setTimeout(function() {
                // Update Client's Game Data
                io.in(Game.name).emit('gameData', Game);
                // State Change To Game
                io.in(Game.name).emit('state', 'game.play');
            }, 200);


            // Server Response
            io.in(Game.name).emit('server', {
                message: "Czar Chosen",
                data: "Random Index Is " + Game.players[randomIdx].username
            });

            // Update Client With Start Message
            socket.emit('server', {
                message: "Starting Game",
                data: {
                    'gane.name': name,
                    cachedData: Game,
                    gameData: game.get()
                }
            });

        });

        socket.on('getCards', function(cards) {
            console.info("Got Cards From " + user.get().username, cards);
            // save cards to local game object
            var Game = CACHE.games[game.get().name],
                cachedIndex,
                Player = game.get().players.filter(function(player, i) {
                    var p = player.username === user.get().username ? player : null;
                    if (p) cachedIndex = i;
                    return p;
                })[0];

            // Add Cards To Users Hand
            cards.playerCards.forEach(function(card) {
                Player.cards.push(card);
            });
            // Update Czar Cards
            Player.czarCard = cards.czarCard;

            // Set Czar Card
            Game.players.forEach(function(player) {
                !!player.isCzar ? Game.czarCard = player.czarCard : null;
            });

            // Update Cache
            var updatedGame = CACHE.updatePlayer(Game, cachedIndex, Player);
            CACHE.updateGame(Game.name, Game);
            game.update(CACHE.games[Game.name]);
            user.update({
                game: CACHE.games[Game.name]
            });
            // Update 
            logger.info("Updated Game", updatedGame);


        });























        ////////////////////////////
        /// Return Data To User ///
        //////////////////////////

        // Send Games To Client
        socket.on('games', function() {
            // Send Games To Client
            logger.log("User Requested Games");
            socket.emit('games', CACHE.games);
            socket.emit('server', {
                message: "Updated Your Games List",
                data: CACHE.games
            });
        });


        ///////////////////////////////
        /// Basic Socket Receivers ///
        /////////////////////////////

        // Helper Listener
        socket.on('get', function(property) {
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
        socket.on('subscribe', function(room) {
            socket.join(room);
            logger.info(user.username + " Joined Room " + room, user.rooms);
            // Send User Data To Socket
            setTimeout(function() {
                socket.emit('user', user);
            }, 10);
        });
        // Unsubscribe
        socket.on('unsubscribe', function(room) {
            socket.leave(room);
            logger.info(user.username + " Left Room " + room, user.rooms);
            // Send User Data To Socket
            setTimeout(function() {
                socket.emit('user', user);
            }, 10);
        });

        // Client Sent User Data
        socket.on('user', function(USER) {
            logger.log("Server has your USERdata", USER);
            // Bulk Update User Object
            user.update(USER);
            // Store New Socket Info
            user.set('handshake', socket.id);
            user.set('rooms', socket.rooms);


            // Check For Previous User Data
            // Do Nothing To Null User
            if (USER.username === "" || USER.username.length === 0)
                return logger.log("Null User"),
                    // Server Response
                    socket.emit("server", {
                        message: "You're Anonymous",
                        data: user.get()
                    });

            // If User is NOT in CACHE
            if (!CACHE.Users.hasOwnProperty(USER.username))
            // Save user to Cache
                CACHE.Users[USER.username] = user.get(),
                // Send User Their Game Data
                socket.emit('gameData', CACHE.games[user.get().data.activeGame]),
                // Log to console
                logger.log("SENT USER ACTIVE GAME", user.get().data.activeGame);
            // If User In Cache Update Game Object
            else logger.log("User In Cache"),
                logger.warn("USERNAME IN CACHE", USER.username, CACHE.Users),
                user.set('game', CACHE.Users[USER.username].game),
                // Update Local Game Object
                !!user.get().game ? logger.warn("updating local game", CACHE.games[user.get().game.name]) : null;
            !!user.get().game ? game.update(CACHE.games[user.get().game.name]) : null;
            !!user.get().game ? socket.join(user.get().game.name) : null;
            // When Joining Rooms
            // Server needs timeout to
            // Update Socket Data
            socket.join(user.get().username);
            setTimeout(function() {
                // Send Client Updated User Data;
                socket.emit('user', user.get());
                socket.emit('gameData', CACHE.Users[user.get().username].game);
                // socket.emit('gameData', game.get());
                // Server Response
                socket.emit("server", {
                    message: "Your Datas R Belong To Us!",
                    data: {
                        user: user.get(),
                        game: game.get()
                    }
                });
            }, 10);
        });
        // Handle User Messaging Service
        socket.on('message', function(details) {
            // Send Client Active Games
            socket.emit('server', {
                message: "Sending Message To " + details.username,
                data: details.message
            });
            if (details.username !== CACHE.gameRooms.default) io.to(details.username).emit('message', {
                from: user.username,
                data: details.message
            });
        });
        // Client Requests Game Data
        socket.on('gameData', function() {
            // Send Client Active Games
            socket.emit('gameData', game.get());
            socket.emit('server', {
                message: "Updated Game Data",
                data: game.get()
            });

        });

        // On Client Disconnect
        socket.on('disconnect', function(error) {
            logger.warn("User Left", error);
        });
    });
};