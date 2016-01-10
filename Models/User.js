// User Object
module.exports = function( socket, db ) {
	return {
		id: {
			username: db.name.username,
			handshake: socket.id
		},
		rooms: socket.rooms,
		game: {}
	}
}