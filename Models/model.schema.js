/*
	This Document Is Meant To Initialize
	All Schemas and Export One Schema Object
*/
var mongoose = require('mongoose');
var schema = mongoose.Schema;

/* 
	Define A Mongo App Schem.
	These Are Class Files And Their
	Schemas That Determine What Data
	Gets Saved Where.
*/
var Users, Games, Players, Cards, Settings, 
	Schema = {};

/*
	The User Class Determines Who Is
	Authorized To Access The App. It
	Keeps Track Of The Users Data. 

	The User Will Keep Record Of:
		ID, First, Last Name, Age
		Active Game Data (Relational)
		Socket Reference (Relational)
		( User Methods )
*/
	Users =
		{
			age: Number,
			gender: String,
			name: {
				first: String,
				last: String,
				username: String
			},
			activeGame: {
				type: schema.Types.ObjectId,
				ref: 'Game'
			},
			player: schema.Types.ObjectId,
			status: String,
			active: Boolean
		};
/* ) */

/*
	The Game Class Determines What Games
	Are Available To The Users And It's
	Status. 

	The Game Will Keep Record Of:
		Game ID, Name, Players (Relational), 
		Settings, ( Game Methods )
*/
	Games =
		{
			name: String,
			active: Boolean,
			players: [schema.Types.ObjectId],
			rating: String,
			maxPlayers: Number,
			decks: Array

		};
/* ) */

/*
	The Player Class Determines What Cards
	And Status Each Player Holds In The Game.

	The Player Will Keep Record Of:
		Score, Status, Player Name,
		Cards In Hand (Relational),
		User Ref (Relational),
		Game ID (Relational)
*/
	Players =
		{
			name: String,
			cards: [schema.Types.ObjectId],
			score: Number,
			status: String,
			user: {
				type: schema.Types.ObjectId,
				ref: 'User'
			},
			game: schema.Types.ObjectId,
		};
/* ) */

/*
	The Cards Class Determines What Cards
	Are Available To The App.

	The Cards Class Will Keep Record Of:
		Expansion
		Type (Required), Text (Required), 
		Number of Answers (Required)
*/
	Cards =
		{
		    cardType: String,
		    text: String,
		    numAnswers: Number,
		    expansion: String,
		    custom: "Boolean"
		};
/*
	The Settings Factory Holds Each
	Class's Settings Object
*/
	Settings = 
		{
			Users: Users,
			Games: Games,
			Players: Players,
			Cards: Cards
		};

// For Each Settings Key, Create Schema
for (var Class in Settings) {
	// Factory To Create Schema Object;
	Schema[ Class ] = new schema( Settings[ Class ] );
}

module.exports = Schema;