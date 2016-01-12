module.exports = function( io ) {
    return {
        sendToAll: function( message, data, room ) {
        	setTimeout(function(){
        		if (!room) return io.emit(message, data || ""), "Success";
        		return io.in( room ).emit( message, data ), "Success";
        	}, 200);
        },
        serverResponse: function( message, data, room ) {
        	setTimeout(function(){
        		if (!room) return io.emit(message, data || ""), "Success";
        		return io.in( room ).emit( message, data ), "Success";
        	}, 200);
        },
        sendToRoom: function( name, message, data ) {
        	return io.in( name ).emit( message, data ), "Success";
        }
    }
}