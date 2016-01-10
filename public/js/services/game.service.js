app.service("Game", function($rootScope, Socket, DB){
    var Game = DB.getFromStorage('game') || {};
        Functions = {};

    Functions.update = function( data ) {
        // Will Probably Never Use This
        for (var prop in data) {
            // Remove Hashkey
            if (typeof data[ prop ] === 'object' && data[ prop ].hasOwnProperty('$$hashKey')) delete data[ prop ].$$hashKey;
            Game[ prop ] = data[ prop ];
        }
        // Save Data To Local Storage
        DB.saveToStorage('game', data);
        // Return Game with new data
        return Game;
    }

    // Key Listeners
    $rootScope.$on('gameData', function(event, data) {
        // console.log("Game Service: Got Game Data", data);
        // Update Game Data
        Functions.update( data );
    });

    return {
        get: function() {
            // Send Whole Game
            return Game;
        },
        set: function( property, value ){
            // Remove Hashkey
            if (typeof value === 'object' && value.hasOwnProperty('$$hashKey')) delete value.$$hashKey;
            // Set Game Property
            return Game[ property ] = value;
        },
        getOne: function( property ) {
            // Get Property of Game
            return Game[ property ];
        },
        update: Functions.update
    }
});