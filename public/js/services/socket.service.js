app.service('Socket', function(socketFactory, $rootScope, ParseDB, DB) {

    // Define Socket
    // var socket = $rootScope.authenticated ? socketFactory() : { on: function(){}, emit: function(){} };
    var socket = socketFactory();
/*
    SOCKET LISTENERS
*/  
    // On Connect
    socket.on('connect', function() {
        console.log(["User Connected"]);
    });
    // Server Sent Message
    socket.on('server', function(server) {
        console.info(["SERVER MSG:", server.message, server.data]);
    });
    // Got Message From User
    socket.on('message', function(message) {
        console.info(["Got Message From " + message.from, message.data]);
    });
    
    // Server Sent User Data
    socket.on('user', function(user){
       // console.log("Broadcasting Game Data Update", game);
       $rootScope.$broadcast('user', user);
    });
    // Alert Angular Of Game List
    socket.on('games', function(games){
       // console.info("Socket Got Games", games);
       $rootScope.$broadcast('games', games);
       // Save Updated Game To User

    });
    // Alert Angular Of Game List
    socket.on('setActive', function(game){
       // console.log("Broadcasting Set Active", game);
       $rootScope.$broadcast('setActive', game );
       // console.warn("Setting Active In Parse", game);
       ParseDB.setActive( game.objectId, game.name );
    });
    // Alert Angular Of Game List
    socket.on('gameData', function(game){
       // console.log("Broadcasting Game Data Update", game);
       $rootScope.$broadcast('gameData', game);
       // Save To Cache
       DB.saveToStorage('game', game);
    });

/*
    Window Factory Functions
*/

    return window.socket = {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});