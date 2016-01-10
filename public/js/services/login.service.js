app
    .service("LoginService", ['$state', '$rootScope', 'Socket', 'User', function($state, $rootScope, socket, User) {
        var Login = {};

        Login.createUser = function(data) {
            // Create New User
            var user = new Parse.User();
            // Set User Details
            user.set("username", data.username);
            user.set("password", data.password);
            user.set("email", data.email);
            // Send New User To Parse
            user.signUp(null, {
                success: function(user) {
                    console.log("Redirecting You To Home State");
                    // Update Parse Current User
                    Parse.User.current().fetch();
                    // Update User Service
                    var USER = { 
                        id: Parse.User.current().id,
                        data: Parse.User.current().attributes,
                        username: Parse.User.current().get('username')
                    };
                    // Update User Service
                    console.warn("User Services", User);
                    User.update( USER );
                    // Send User To State
                    $state.go('home.dashboard');
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });

        };

        Login.login = function(username, password) {
            console.log("Logging In User "+username, [ username, password ]);
            // Login User
            Parse.User.logIn(username || $rootScope.user.username || "Ray", password || "password", {
                success: function(user) {
                    // Send User To Server
                    var USER = { 
                        id: Parse.User.current().id,
                        data: Parse.User.current().attributes,
                        username: Parse.User.current().get('username')
                    };
                    // Emitter
                    socket.emit('user', USER);
                    console.info("User Logged In", USER);
                    // Send User To Route
                    $rootScope.navigateTo('home.join');
                },
                error: function(user, error) {
                    // The login failed. Check error to see why.
                    console.log("User Login Failed", error, user);
                }
            });
        };

        Login.logout = function(sessionUser) {
            if (!sessionUser && !!Parse.User.current()) sessionUser = Parse.User.current();
            console.log(["I heard your request to logout", sessionUser])

            if (sessionUser) {
                // Run Parse User Logout
                Parse.User.logOut();
                // Clear Localstorage
                localStorage.clear();
                // Send User To Server
                var USER = { 
                    id: "",
                    data: {},
                    username: ""
                };
                // Emitter
                socket.emit('user', USER);
                console.info("User Logged Out", USER);
                // Send User to Login Page
                $state.go('home.index');
            }
            else {
                console.log("Please Login");
                $state.go('home.index');
            }
        };

        Login.facebookLogin = function() {
            Parse.FacebookUtils.logIn("public_profile,user_likes,email,read_friendlists,user_location", {
                success: function(user) {
                    if (!user.existed()) {
                        console.log("User signed up and logged in through Facebook!");
                        $rootScope.collectFacebookData(user);
                        console.log(user, "also running FB User Details Save");

                        console.log($rootScope.sessionUser); // Parse User Current Object

                        console.log("User Details Saved");

                        $rootScope.reloadWindow();
                    }
                    else {
                        console.log("User logged in through Facebook!");
                        // Recapture User Data If User Is Already in Parse DB
                        $rootScope.collectFacebookData(user);

                        console.log("THIS IS USER OBJECT", user);

                        $rootScope.reloadWindow();
                    }
                },
                error: function(user, error) {
                    alert("User cancelled the Facebook login or did not fully authorize.");
                }
            });
        };

        Login.makeAdmin = function() {
            if ($rootScope.sessionUser && $rootScope.techNinjaAdmin) {
                console.log("Making: " + $rootScope.techNinjaAdminName + " admin");
                console.log("Tech Ninja Admin variable is: ", $rootScope.techNinjaAdmin);
            }
            else {
                console.log("User: " + $rootScope.techNinjaAdminName + " is not an admin");
                console.log("Tech Ninja Admin variable is: ", $rootScope.techNinjaAdmin);
            }
        };

        return Login;

    }]);