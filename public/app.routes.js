// app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '',
            abstract: true,
            data: {
                game: {},
                activeGames: [],
                activeUsers: []
            },
            controller: function($scope, Socket, $rootScope, Game, User) {
                $scope.user = User.get();
                $scope.games = [];

                $scope.navigateTo = $rootScope.navigateTo;
                // Window Factory
                window.cah = window.cah|| {};
                window.cah.scope.home = $scope
            }
        })
        .state('home.index', {
            url: '/',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/home.html",
                    controller: "LoginController"
                }
            }
        })
        .state('home.createAccount', {
            url: '/create-account',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/create-account.html",
                    controller: "LoginController"
                }
            }
        })
        .state('home.create', {
            url: '/create',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/create-a-game.html",
                    controller: function($scope, Socket, $rootScope) {
                        $scope.game = {};
                        // Save Game
                        $scope.saveGame = function( data ) {
                            // Socket.emit('createGame', data);
                            return new Promise(function(resolve, reject){
                                !data ? reject({
                                    message: "No Game Present", 
                                    data: data 
                                }) : resolve( Socket.emit( 'createGame', data ));
                            }).then(function(res){
                                $rootScope.navigateTo('home.join');
                            });
                        }
                        // Window Factory
                        window.cah = window.cah|| {};
                        window.cah.scope.createGame = $scope
                    }
                }
            }
        })
        .state('home.join', {
            url: '/join',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/find-a-game.html",
                    controller: function JoinController($scope, Socket, $rootScope, Game) {
                        // console.log("Home Scope", [$rootScope, $scope]);
                        var args = [this, $scope, arguments];
                        $scope.games = [];
                        // Get Active Games
                        if ($scope.games.length <= 0) Socket.emit('games');
                        // Update Games
                        
                        // Join Game
                        $scope.joinGame = function( game, index ) {
                            Socket.emit('joinGame', game);
                            $rootScope.navigateTo( 'game.lobby' );
                        }
                        // Update Active Games
                        $scope.$on('activeGames', function(event, games){
                            // console.log("Got activeGames", games );
                            
                        });
                        // Update Active Users
                        $scope.$on('activeUsers', function(event,  users ){
                            // console.log("Got activeUsers", users );
                            
                        });
                        $scope.$on('games', function(event, games){
                            // console.log("Got Games", games);
                            // Reset Games Array
                            $scope.games.length = 0;
                            // Update Games
                            for (var game in games) {
                                $scope.games.push( games[ game ] );
                            }
                        });
                        // Update Game Data
                        $scope.$on('gameData', function( event, game ){
                            // console.log("Got gameData", game );
                            $scope.game = game;
                            
                        });
                        // Window Factory
                        window.cah = window.cah|| {};
                        window.cah.scope.joinGame = $scope
                    }
                },
                'bottom-nav@': {
                    templateUrl: "./templates/menus/bottom-nav.html",
                    controller: ""
                }
            }
        })
        .state('home.dashboard', {
            url: '/dashboard',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/dashboard.html",
                    controller: function($scope, $rootScope, DB, Socket) {
                        // console.log("Dash Scope", [$rootScope, $scope]);
                        $scope.users = [];
                        if ($scope.users.length <= 0 ) $rootScope.$broadcast('emit', {emit: 'users', data: null });
                        $scope.resumeGame = function() {
                            var game = DB.getFromStorage('game') || {};
                            if (game.hasOwnProperty('name')) $rootScope.navigateTo('game.play');
                        }
                        // Get Users Online
                        $scope.$on('users', function( event, users) {
                            if (users.length === 0) return;
                            // console.log("USERS", users);
                            $scope.users.length = 0;
                            for (var user in users) {
                                $scope.users.push( users[ user ] );
                            }
                        })
                    }
                },
                'bottom-nav@': {
                    templateUrl: "./templates/menus/bottom-nav.html",
                    controller: ""
                }
            }
        })
        .state('home.dashboard.edit', {
            url: '/edit',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/edit-dashboard.html",
                    controller: ""
                },
                'bottom-nav@': {
                    template: "",
                    controller: ""
                }
            }
        })
        .state('home.dashboard.settings', {
            url: '/settings',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/dashboard-settings.html"
                    // controller: "PortfolioCtrl"
                },
                'bottom-nav@': {
                    templateUrl: "./templates/menus/bottom-nav.html"
                    // controller: "HomeCtrl"
                }
            }
        })
        .state('game', {
            url: '/game',
            abstract: true,
            controller: function($scope, Socket, Cards) {
            }
        })
        .state('game.lobby', {
            url: '/lobby',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/lobby.html",
                    controller: function($scope, Socket, $rootScope, Game) {
                        // console.log("Lobby Scope", [$rootScope, $scope]);
                        // Create Game Ref
                        $scope.game = Game.get() || {};
                        // Players Ref
                        $scope.players = $scope.game.hasOwnProperty('players') ? $scope.game.players : [];
                        // Refresh Game Data If Empty
                        if ($scope.players.length <= 0) Socket.emit('gameData');
                        // Game Ready Function
                        $scope.isReady = function() {
                            return  $scope.players.length >= $scope.game.maxPlayers;
                        }
                        $scope.creatorIsReady = function() {
                            return $scope.isReady() && $scope.game.creator === $rootScope.user.username;
                        }

                        $scope.updateGame = function( data ) {
                            $scope.game = Game.get();
                        }

                        $scope.startGame = function( game ) {
                            console.log("Starting Game: " + game.name, game);
                            Socket.emit('startGame', game.name);
                        }
                        // Leave Game
                        $scope.leaveGame = function( game ) {
                            // Clear Game Data on Server
                            Socket.emit('leaveGame', game);
                            // console.warn("Emitting Leave Game", game)
                            // Navigate To Join Game Screen
                            $rootScope.navigateTo('home.join');
                        }
                        // Scope Listeners
                        $scope.$on('gameData', function( event, data ) {
                            // console.log("Updating Data", data );
                            // $scope.game = data;
                            if (!!data) updatePlayerList( data.players );

                        });
                        // Add Player Function
                        function updatePlayerList ( players ) {
                            $scope.players.length = 0;
                            if (!!players) players.forEach(function(player){
                                if (player.hasOwnProperty('$$hashKey')) delete player.$$hashKey;
                                $scope.players.push( player );
                            });
                        }
                        // Window Factory
                        window.cah = window.cah|| {};
                        window.cah.scope.lobby = $scope;
                    }
                }
            }
        })
        .state('game.play', {
            url: '/play',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/game.html"
                    
                },
                'bottom-nav@': {
                    templateUrl: "./templates/menus/player-nav.html"
                    // controller: "HomeCtrl"
                }
            }
        })
        .state('game.play.submissions', {
            url: '/submissions',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/game.submissions.html",
                    controller: function( $scope, Game, $rootScope ) {
                        $scope.submissions = {};

                        if (Object.keys($scope.submissions).length <= 0) {
                            var submissions = Game.get().submissions || [];
                            // Create Submissions List
                            submissions.forEach(function( submission) {
                                $scope.submissions[ submission.username ] = $scope.submissions[ submission.username ] || [];
                                $scope.submissions[ submission.username ].push( {username: submission.username, card: submission.card } );
                            });
                        }

                        $scope.chooseWinner = function( card ) {
                            var winner = card[0];
                            $rootScope.$broadcast('bestCard', {username: winner.username, cards: $scope.submissions[ winner.username ]});
                            console.info("Winner Chosen: " + winner.username, winner);
                        };

                        $scope.$on('submission', function(event, submission) {
                            console.log("Completing Submissions Update", submission);
                            $scope.submissions[ submission.username ] = $scope.submissions[ submission.username ] || [];
                            $scope.submissions[ submission.username ].push( {username: submission.username, card: submission.card } );
                            console.warn("Submissions", $scope.submissions);
                        });
                        
                         $scope.$on('winner', function(event, winner) {
                            // Reset Submissions
                            $scope.submissions = {};
                        });
                        // Window Factory
                        window.cah = window.cah || {};
                        window.cah.scope.submissions = $scope;
                    }
                    
                },
                'bottom-nav@': {
                    templateUrl: "./templates/menus/player-nav.html"
                    // controller: "HomeCtrl"
                }
            }
        })
        .state('game.over', {
            url: '/over',
            parent: 'home',
            views: {
                'body@': {
                    templateUrl: "./templates/pages/game.over.html",
                    controller: function($scope, Socket, $rootScope) {
                        $scope.message = "Game Over -- Would You Like to Play Again?";
                    }
                }
            }
        })
        .state('home.messages', {
            url: '/messages',
            views: {
                'body@': {
                    templateUrl: "./templates/menus/messages.html",
                    controller: function($scope, Socket, $rootScope, Game) {
                        $scope.users = [];
                        $scope.game = Game.get();
                        
                        if ($scope.users.length <= 0) Socket.emit('users');
                        
                        $scope.$on('users', function( event, users) {
                            if (users.length === 0) return;
                            console.log("USERS", users);
                            $scope.users.length = 0;
                            for (var user in users) {
                                $scope.users.push( users[ user ] );
                            }
                        });
                        
                        $scope.send = function( user, message ) {
                            if (!!message ) return Socket.emit('message', { username: user.username, message: message });
                            message = user;
                            Socket.emit('message', { username: $scope.game.name, message: message });
                        }
                        
                        // Window Factory
                        window.cah = window.cah || {};
                        window.cah.scope = window.cah.scope || {};
                        window.cah.scope.messages = $scope;
                        
                    }
                },
                'bottom-nav@': {
                    templateUrl: "./templates/menus/bottom-nav.html",
                    controller: ""
                    // controller: "HomeCtrl"
                }
            }
        });
    $urlRouterProvider.otherwise('/');
});