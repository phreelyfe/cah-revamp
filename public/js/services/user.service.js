app.service('User', function($rootScope, Socket, DB){
    // Define User
    var User = {};
    // If Parse User, Set User Object To Current
    if (Parse.User.current()) User = {
        id: Parse.User.current().id,
        data: Parse.User.current().attributes,
        username: Parse.User.current().get('username'),
    }; 
    else User = {
        id: "",
        data: {},
        username: ""
    };
    // First Run Save User To Cache
    DB.saveToStorage('User', User);
    // Server Requesting Username
    Socket.on('username', function(){
        Socket.emit('user', User);
    });
    // Server Sent Update User Object
    Socket.on('user', function( user ){
        User = user;
        DB.saveToStorage('User', user);
    });
    // Return Functions
    return {
        get: function() {
            // Return User Data
            return User;
        },
        updateGame: function( game ) {
            if (!game) User.game = {};
            else User.game = game;
            // Store in Cache
            DB.saveToStorage('User', User);
            // Return Updated Game To Caller
            return User.game;
        },
        update: function( data ) {
            for (var prop in data) {
                User[ prop ] = data[ prop ];
            }
            return User;
        }
    };
});
