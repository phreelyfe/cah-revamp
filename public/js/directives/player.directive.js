app.directive('playerNode', function(){
    return {
        restrict: 'A',
        // transclude: true,
        controller: function($scope, Socket, $rootScope, Game, User) { 
            // Player Settings
            $scope.user = User.get();
            $scope.players = Game.get().players;
            $scope.player = !!Game.get().hasOwnProperty('players') ? Game.get().players.filter(function(player){
                return player.username === $rootScope.user.username ? player : null;
            })[0] : {};
            // Game Settings
            $scope.game = Game.get();
            $scope.czarCard = Game.get().czarCard || {};

            // User Is Czar?
            $scope.isCzar = function() {
                return $scope.game.czar === $scope.user.username ? true : false;
            }
            // Leave Game
            $scope.leaveGame = function( game ) {
                // Clear Game Data on Server
                Socket.emit('leaveGame', game);
                // console.warn("Emitting Leave Game", game)
                // Navigate To Join Game Screen
                $rootScope.navigateTo('home.join');
            }

            $scope.$on('gameData', function(event, gameData){
                // console.log("Updated Game Data", gameData);
                $scope.game = gameData || Game.get();
                $scope.czarCard = $scope.game.czarCard || {};
            });
            
            $scope.send = function() {
                console.log("Send", arguments);
            }

            // Window Factory
            window.cah = window.cah|| {};
            window.cah.scope.game = $scope;
        },
        link: function(scope, elem, attrs) {
            // console.log("PLAYER CONTROLLER VARS ", scope);
            // console.log("Socket ", socket);
            
            var cards = new Array(attrs.$$element[0].children);
            console.log(["Card Array", cards[0]], ['is Array', Array.isArray(cards[0]), cards[0].length]);

            scope.prev = function(idx) {
                console.log('Showing Prev Card', ['Card #' + idx], 'CARD NODE', cards[0]);
                console.log('PREV/THIS CARD', [cards[0][idx]]);
                console.log('NEXT CARD', [cards[0][idx - 1]]);

                // console.log(["Scope.Cards.length", scope.cards.whiteCards.length], ["obj", scope.cards.whiteCards])
                // Transition Card From Current To Next
                transitionCards( cards[0][idx], cards[0][idx -1], {direction: 'rotate-left', delay: 400}, cards[0][cards.length -1]);

            };

            scope.next = function(idx) {
                console.log('Showing Next Card', ['Card #' + idx], 'CARD NODE', cards[0]);
                console.log('PREV/THIS CARD', [cards[0][idx]]);
                console.log('NEXT CARD', [cards[0][idx + 1]]);
                
                transitionCards( cards[0][idx], cards[0][idx +1], {direction: 'rotate-right', delay: 400}, cards[0][0] );
            };

            function transitionCards(prev, next, rotation, loopStart) {
                // console.log(["Previous Card", prev], ["Next Card", next], ["Loop Start", loopStart]);

                if (!next) var next = loopStart;
                if (!prev) var next = loopStart;
                
                $(prev).addClass(rotation.direction).delay(rotation.delay).fadeOut(1, function(){
                    $(prev).css("display", "none");
                });

                $(next).removeClass('rotate-left rotate-right').fadeIn(400, function(){
                    $(next).css("display", "block");
                });

            }
        }
    }

});