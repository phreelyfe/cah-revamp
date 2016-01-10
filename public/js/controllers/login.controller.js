app
    .controller('LoginController', ['$scope', '$state', '$window', '$rootScope', 'LoginService', function($scope, $state, $window, $rootScope, Login) {
        // User Object
        $scope.user = {};

        $scope.alias = 'Login Controller';
        if ($rootScope.sessionUser) $scope.sessionUser = true; //console.log(["Session User", "Changing State To Lobby"]);

        // Login Function Using /login Screen Data
        $scope.login = window.login = function(username, password) {
            
            return Login.login(username, password);
        };

        $scope.logout = function() {
            return Login.logout(Parse.User.current());
        };

        $scope.createUser = function( user ) {
            console.log("Running Create With Data", user);
            return Login.createUser(user);
        };

        $scope.saveProfile = function(firstname,lastname, password, email) {
            console.log(['firstname', firstname,'lastname', lastname, 'password', password, 'email', email]);
        };

        $scope.facebookLogin = function() {
            return Login.facebookLogin();
        };

      
        // Test Alert button
        $scope.alert = function() {
            console.log("You've hit the Parse Current User alert button");
            console.log(Parse.User.current());
        };


    }]);