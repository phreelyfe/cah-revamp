/* 
	Define A Mongo App Schem.
	These Are Class Files And Their
	Schemas That Determine What Data
	Gets Saved Where.
*/
var Schema = require("./model.schema"),
	mongoose = require('mongoose');

var Users, Games, Players, Cards, Methods,
	Classes = {};

/*
	The User Method Determines ...
*/
	Users =
	[
		{
			name: "sayFullName",
			function: function () {
				console.log("My Name Is " + this.name.first + " " + this.name.last);
			}
		}
	];
/* ) */

/*
	The Game Method Determines ...
*/
	Games =
	[
		{
			name: "sayId",
			function: function() {
				console.log("My ID " + this.id );
			}
		}
	];
/* ) */

/*
	The Player Method Determines ...
*/
	Players =
	[
		{
			name: "sayUsername",
			function: function() {
				console.log("My User Name Is" + this.username);
			}
		}
	]
/* ) */

/*
	The Cards Method Determines ...
*/
	Cards =
	[
		{
			name: "cardText",
			function: function() {
				console.log("My Text Is" + this.text);
			}
		}
	];
/* ) */

	Methods = 
	{
		Users: Users,
		Games: Games,
		Players: Players,
		Cards: Cards
	};

// Assemble Functions Into Schema
for (var Class in Schema) {
    for (var Method in Methods[Class]) {
        // Each Schema Class Will Attach a Method ;
        Schema[Class]['methods'][ Methods[Class][ Method ]['name'] ] = Methods[Class][Method]['function'];
    }

    Classes[ Class ] = mongoose.model( Class, Schema[ Class ] );
}


module.exports = Classes;