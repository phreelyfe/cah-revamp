window.Parse.initialize("crvtKIS2lxtvpwrSxRGGLeiVEL8rxth2AeuLRkET", "g7jneHdlu6WbQo6NZeuvs8pA139qYKjp0SPsloPn");

var app = angular.module('cah', ['ui.router', 'btford.socket-io', 'ngTouch']);

app.directive('isReady', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // console.log("Is Ready Directive", [scope, element, attrs]);
        }
    };
}]);
// Returns A Bubble For Each Player In Lobby
app.filter('playerMarkers', function() {
    return function( playersInLobby ) {
        var string = "";
        for (var i=0;i<playersInLobby;i++) {
            string += "•";
        }
        return string;
    };
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
        
    };
    // Back Button Function
    $rootScope.goBack = function(){
        console.log(["Going Back In History"]);
        $window.history.back();
    };
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
    // function message(to, toP, from, fromP) { 
    //     return from.name  + angular.toJson(fromP) + " -> " + to.name + angular.toJson(toP);
    // }


    // Window Factory
    window.cah = window.cah || {};
    window.cah.scope = window.cah.scope || {};
    window.cah.scope.rootscope = $rootScope;
    window.cah.DB = DB;
    window.cah.Game = Game;
    window.cah.User = User;
    window.cah.Login = LoginService;


});