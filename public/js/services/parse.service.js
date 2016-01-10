app.service("ParseDB", function(DB){
    var parse = {};

    parse.save = function( Class, data ) {
        var Table = Parse.Object.extend( Class ),
            parseObject = new Table();
        // Save Each Property to parseObject
        for (var prop in data) {
            parseObject.set( prop, data[ prop ]);
        }
        // Return Promise
        return parseObject.save(null, {
            success: function(res) {
                console.log(res);
            },
            error: function(res,err) {
                console.warn(res,err);
            }
        })
    };

    parse.findById = function( Class, id ) {
        var query = new Parse.Query( Class );
        // Return Promise
        return query.get( id, {
            success: function(res) {
                console.log(res);
            },
            error: function(res,err) {
                console.warn(res,err);
            }
        });
    };

    parse.find = function( Class, conditions ) {
        /*
            // SAMPLE CONDITIONS OBJECT
            [{ equalTo: 'username' },
            { exists: 'column to check' }]
        */

        // Query Object
        var query = new Parse.Query( Class );
        // Set Conditions
        conditions.forEach(function( condition ){
            // Iterate Over Conditions Property
            for (var prop in condition) {
                // Set Query Condition
                if (condition[ prop ] !== null) 
                    query[ prop ]( condition[ prop ]);
            }
        });
        // Return Promise
        return query.find({
            success: function(res) {
                console.log(res);
            },
            error: function(res,err) {
                console.warn(res,err);
            }
        });
    };

    parse.update = function( Class, id, data ) {
        var query = new Parse.Query( Class );
        // Return Promise
        return query.get( id, {
            success: function(res) {
                console.log(res);
                // Save Each Property to parseObject
                for (var prop in data) {
                    res.set( prop, data[ prop ]);
                }
                // Return Promise
                return res.save({
                    success: function(res) {
                        console.info(res);
                    },
                    error: function(res,err) {
                        console.warn(res,err);
                    }
                })

            },
            error: function(res,err) {
                console.warn(res,err);
            }
        });
    };

    parse.setActive = function( id, name ) {
        // console.error("Requested to set Active Game", name);
        // If No ID Present Set Settings
        if (!id) id = DB.getFromStorage('game').objectId,
            name = "";

        Parse.User.current().set('activeGame', name);
        Parse.User.current().save({
            success: function(res) {
                // console.warn('Saved Active Game', res);
                // Update Parse.User.current()
                res.fetch();
                // Store Active Game
                var Game = new Parse.Query('Games');
                    if (name !== "") // If ID is present return promise
                        return Game.get(id, {
                            success: function(game) {
                                var formatted = game.attributes;
                                    formatted.objectId = game.id;
                                // console.warn("Game To Store To CACHE-- ", formatted);
                                var user = DB.getFromStorage('User');
                                    user.game = formatted,
                                    DB.saveToStorage('User', user);
                                    // Notify Persistance
                                    console.info("Persisted Through To Cache", [{
                                        userAffected: user,
                                        gameDataAffected: user.game,
                                        argumentsUsed: {
                                            id: id,
                                            name: name,
                                            game: user.game
                                        }
                                    }]);
                            },
                            error: function(res,err) {
                                console.warn(res,err);
                            }
                        });
                    // Set The CACHE to ""
                    else {
                        // Get User From Storage
                        var user = DB.getFromStorage('User');
                            // Empty Game Data for User & Game
                            user.game = DB.saveToStorage('game', {}),
                            // Store User Data
                            // console.warn("Storing Updated User Data", user);
                            DB.saveToStorage('User', user);
                            // Notify Persistence
                            console.info("Persisted Through To Cache", [{
                                userAffected: user,
                                gameDataAffected: user.game,
                                argumentsUsed: {
                                    id: id,
                                    name: name,
                                    game: user.game
                                }
                            }]);

                    };
            },
            error: function(res,err) {
                console.warn(res,err);
            }
        })
    };


    return parse;
});