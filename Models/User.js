// socket = {handshake: "", username: null, rooms: ["default"]}
// db = {Users: {}}
// ken = UserModel(socket, db)
// ken.set('game', {name: "X-Men", players: 1})
// User Object
module.exports = function UserModel( socket, db ) {
	return {
		username: null,
		handshake: socket.id,
		rooms: socket.rooms,
		game: {},
		set: function( property, value ) {
            this[ property ] = value;
            // Set Ref in Cache for the User
            // Validation against Pre-existing object 
            if (!!this.username) 
            	db.Users[ this.username ] = db.Users[ this.username ] || {};
            // Set Value Equal In DB
            if (!!this.username) db.Users[ this.username ] = this
            // Return the updated data 
            return this[ property ];
        },
        get: function( property ) {
        	// If no property argument exists
        	// Send the User the entire object
            if (!property) return this;
            return this[ property ];
        },
        update: function( data ) {
            for (var prop in data) {
                this[ prop ] = data[ prop ];
            }
            // Set Ref in Cache for the User
            // Validation against Pre-existing object 
            if (!!this.username) 
            	db.Users[ this.username ] = db.Users[ this.username ] || {};
            // Set Value Equal In DB
            if (!!this.username) db.Users[ this.username ] = this;
            return this;
        }
	}
}