// DB Object
var db = {
	Users: {}, // Tree Of Users
	gameRooms: { default: 'BiggerBlackerRoom' }, // Tree Of Game Names;
	games: {} // Tree Of Games
}

db.gameRooms.add = function( room ) { return gameRooms[ room ] = room; };
db.gameRooms.remove = function( room ) { delete gameRooms[ room ] };
db.activeUsers = function() {
    var active = [];
    // Get List Of Active Users
    for (var user in db.Users) {
        if (db.Users[ user ].active) active.push({username: user, data: db.Users[ user ]});
    }
    // Return Active
    return active
}
db.activeGames = function() {
    var active = [];
    for (var game in db.games) {
        if (db.games[ game ].active) active.push({ game: game, data: db.games[ game ]});
    }
    console.log("Returning Active", active);
    return active
}

module.exports = db;