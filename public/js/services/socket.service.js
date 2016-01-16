app.service('Socket', function(socketFactory, $rootScope, ParseDB, DB, Cards) {

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
        window.toastr.info( message.from + ": " + message.data );
    });

    // Extend RootScope Broadcasting to Socket
    $rootScope.$on('emit', function(event, emitter) {
      console.warn("Emitting Event: " + emitter.emit, [emitter.data]);
      socket.emit( emitter.emit, emitter.data );
    })
    // Server Sent User Data
    socket.on('user', function(user){
       // console.log("Broadcasting Game Data Update", game);
       $rootScope.$broadcast('user', user);
    });
    // Server Sent User Data
    socket.on('user', function(user){
       // console.log("Broadcasting Game Data Update", game);
       $rootScope.$broadcast('user', user);
    });
    // Alert Angular Of Game List
    socket.on('users', function(users){
       // console.info("Socket Got Games", games);
       $rootScope.$broadcast('users', users);
       // Save Updated Game To User
    });
    // Update Games List
    socket.on('games', function(games){
       // console.log("Broadcasting Game Data Update", game);
       $rootScope.$broadcast('games', games);
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
    // Responsd To State Change Events
    socket.on('state', function( state ) {
      $rootScope.navigateTo( state );
    });
    
    socket.on('notify', function( message ) {
    window.toastr.success( 'success' );
    });


    //////////////////////////////////
    //////////////////////////////////
    //////// GAME FUNCTIONS //////////
    //////////////////////////////////
    //////////////////////////////////

    socket.on('getCards', function( settings ){
      console.log("Getting Cards", settings);
      // Get Cards From Card Service
      $rootScope.$broadcast('getCards', settings);
    });
    
    // Submit an Answer Card
    $rootScope.$on('submit', function(event, submission) {
        console.warn("Sending Submission to Socket", submission);
        socket.emit('submission', submission.card, submission.index);
    });
    // Choose Winner
    $rootScope.$on('bestCard', function(event, data) {
        console.warn("Sending Winner to Socket", data);
        socket.emit('bestCard', data);
    });
    // Game Over
    socket.on('finished', function() {
        $rootScope.navigateTo('game.lobby');
        console.log("Game Over");


    });
    
    socket.on('submission', function(submission) {
        // console.log("Broadcasting Game Data Update", game);
        $rootScope.$broadcast('submission', submission);
        window.toastr.success('Got Submission');
    });
    
    socket.on('winner', function( User ){
        window.toastr.info(User.username + ' Is The Winner!');
        $rootScope.$broadcast('winner', User);
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
            });
        }
    };
});