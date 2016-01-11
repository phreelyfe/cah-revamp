Parse.initialize("crvtKIS2lxtvpwrSxRGGLeiVEL8rxth2AeuLRkET", "g7jneHdlu6WbQo6NZeuvs8pA139qYKjp0SPsloPn");

var app = angular.module('cah', ['ui.router', 'btford.socket-io', 'ngTouch']);

app.directive('isReady', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // console.log("Is Ready Directive", [scope, element, attrs]);
        }
    }
}]);
// Returns A Bubble For Each Player In Lobby
app.filter('playerMarkers', function() {
    return function( playersInLobby ) {
        var string = "";
        for (var i=0;i<playersInLobby;i++) {
            string += "•";
        }
        return string;
    }
});

app.run(function($rootScope, $timeout, 
    $window, $state, Socket, 
    User, LoginService, Game, DB) {
/*
    RootScope Functions
*/
    $rootScope.user = User.get() || {};
    // Handle Page Reload
    // Send Navigator To State
    $rootScope.$on('navigateTo', function( state ){
        if (!state) return console.log("No State Present: Check Server", state);
        $rootScope.navigateTo(state);
    });
    // Reload Window
    $rootScope.reloadWindow = function() {
        $timeout(function() {
            console.log('Window Reloaded');
            $window.location.reload();
        }, 200);
        console.log('Invoking Timeout Instead');
    };
    // State Refresh
    $rootScope.stateRefresh = window.staterefresh = function() {
        $state.reload();
    };
    // Navigation Functions
    $rootScope.navigateTo = window.navigateTo = function(state){
        // console.log(["Changing State to " + state]);
        $timeout(function() {
            $state.go(state, {notify: false});
        }, 200);
        
    }
    // Back Button Function
    $rootScope.goBack = function(){
        console.log(["Going Back In History"]);
        $window.history.back();
    }
    // RootScope Listeners
    $rootScope.$on("$stateChangeStart", function(evt, to, toP, from, fromP) {
        // console.log("Start:   " + message(to, toP, from, fromP));
    });
    $rootScope.$on("$stateChangeSuccess", function(evt, to, toP, from, fromP) {
        // console.log("Success: " + message(to, toP, from, fromP));
    });
    $rootScope.$on("$stateChangeError", function(evt, to, toP, from, fromP, err) {
        // console.log("Error:   " + message(to, toP, from, fromP), err);
    });
    // Message Client
    function message(to, toP, from, fromP) { 
        return from.name  + angular.toJson(fromP) + " -> " + to.name + angular.toJson(toP);
    }


    // Window Factory
    window.cah = window.cah || {};
    window.cah.scope = window.cah.scope || {};
    window.cah.scope.rootscope = $rootScope
    window.cah.DB = DB;
    window.cah.Game = Game;
    window.cah.User = User;
    window.cah.Login = LoginService;


});

// PLAYER DIRECTIVE
// THIS WILL BE COMBINED WITH
// THE CZAR DIRECTIVE
app.directive('player', ['Socket', function(socket ){
    
    // Angular Stuff
    console.log("From card swipe directive");
    return {
        restrict: 'EA',
        controller: '',
        templateUrl: './templates/pages/game.html',
        transclude: true,
        link: function(scope, elem, attrs) {
            // console.log("PLAYER CONTROLLER VARS ", scope);
            // console.log("Socket ", socket);
            
            // var cards = scope.cards;
            // // console.log(["Card Array", scope.cards], ['is Array', Array.isArray(scope.cards), scope.cards.length]);

            // scope.prev = function(idx) {
            //     // console.log('Showing Prev Card', ['Card #' + idx], 'CARD NODE', scope.cards);
            //     // console.log('PREV/THIS CARD', [scope.cards[idx]]);
            //     // console.log('NEXT CARD', [scope.cards[idx - 1]]);

            //     // console.log(["Scope.Cards.length", scope.cards.whiteCards.length], ["obj", scope.cards.whiteCards])
            //     // Transition Card From Current To Next
            //     transitionCards( scope.cards[idx], scope.cards[idx -1], {direction: 'rotate-left', delay: 400}, scope.cards[scope.cards.whiteCards.length -1]);

            // };

            // scope.next = function(idx) {
            //     // console.log('Showing Next Card', ['Card #' + idx], 'CARD NODE', scope.cards);
            //     // console.log('PREV/THIS CARD', [scope.cards[idx]]);
            //     // console.log('NEXT CARD', [scope.cards[idx + 1]]);
                
            //     transitionCards( scope.cards[idx], scope.cards[idx +1], {direction: 'rotate-right', delay: 400}, scope.cards[0] );
            // };

            // function transitionCards(prev, next, rotation, loopStart) {
            //     // console.log(["Previous Card", prev], ["Next Card", next], ["Loop Start", loopStart]);

            //     if (!next) var next = loopStart;
            //     if (!prev) var next = loopStart;
                
            //     $(prev).addClass(rotation.direction).delay(rotation.delay).fadeOut(1, function(){
            //         $(prev).css("display", "none");
            //     });

            //     $(next).removeClass('rotate-left rotate-right').fadeIn(400, function(){
            //         $(next).css("display", "block");
            //     });

            // }
        }
    }

}]);