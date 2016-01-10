var Games, User, Players, Cards, Data;
Games = [{
    "active": false,
    "name": "ut",
    "players": [
        "568c11cb3869f11062dcea1b",
        "568c11cb82741d45d52e24f7",
        "568c11cb47e2624f77e81dea",
        "568c11cb75caafcc6e78691a"
    ],
    "rating": "PG-13",
    "maxPlayers": 12,
    "decks": [
        "sint",
        "anim"
    ]
}, {
    "active": true,
    "name": "Lorem",
    "players": [
        "568c11cb0ed26311e7b5a6f1",
        "568c11cb0f168ddbb111417e",
        "568c11cb2fd20e70ad0fa781",
        "568c11cbdca16638607229c1"
    ],
    "rating": "PG-13",
    "maxPlayers": 11,
    "decks": [
        "duis",
        "laborum"
    ]
}, {
    "active": true,
    "name": "cupidatat",
    "players": [
        "568c11cb27fe654e00b50948",
        "568c11cb90da422dbf05b395",
        "568c11cbffd510579956d8c8",
        "568c11cb35b204a1b3aa8cdf"
    ],
    "rating": "PG-13",
    "maxPlayers": 7,
    "decks": [
        "ut",
        "sint"
    ]
}, {
    "active": false,
    "name": "voluptate",
    "players": [
        "568c11cb61c9879ca293105f",
        "568c11cb6afee4e09e918fa9",
        "568c11cb69f7c4ef7f979fee",
        "568c11cb80ca241de2b35ce6"
    ],
    "rating": "PG-13",
    "maxPlayers": 2,
    "decks": [
        "irure",
        "nostrud"
    ]
}];

Players = [
  {
    "name": "cupidatat",
    "cards": [
      "568c217377c53ffbfac95f9f",
      "568c21732d9d729432774409",
      "568c2173c34d63940b470550",
      "568c21734abaa3eadf07b0d5"
    ],
    "score": 2,
    "status": "fugiat ex sit ad nisi",
    "user": {
      "id": "568c2173e5ff75d32ab5d916",
      "ref": "User"
    },
    "game": "568c2173dd90a57e2a72a148"
  },
  {
    "name": "dolor",
    "cards": [
      "568c217314c8bfa7a1e51702",
      "568c2173b85ec406cbdc549c",
      "568c2173b864650c97edd31f",
      "568c2173ff22c591f3348ba5"
    ],
    "score": 6,
    "status": "amet ad elit nostrud officia",
    "user": {
      "id": "568c2173a834333bf435c894",
      "ref": "User"
    },
    "game": "568c2173c77b7ed1694f5576"
  },
  {
    "name": "ex",
    "cards": [
      "568c2173c40dd619f75b8573",
      "568c2173ba57bbba3f98cb20",
      "568c2173e75bcbc5f418f71c",
      "568c2173f2cc74606df54350"
    ],
    "score": 3,
    "status": "ipsum veniam pariatur sint nulla",
    "user": {
      "id": "568c2173a392320ce0ab1908",
      "ref": "User"
    },
    "game": "568c2173eae03bddc2376875"
  },
  {
    "name": "mollit",
    "cards": [
      "568c21738c8d6f32184219ea",
      "568c21739e847ae6b02bdbb1",
      "568c21731f3d73bc3ec75531",
      "568c2173c43ad3cbaf148968"
    ],
    "score": 0,
    "status": "aute et non exercitation reprehenderit",
    "user": {
      "id": "568c21731ed707b9d4b67630",
      "ref": "User"
    },
    "game": "568c2173975e6e18ae391100"
  }
];

Users = [{
    "active": true,
    "age": 21,
    "activeGame": "Some Active Game",
    "name": {
        "first": "Farley",
        "last": "Haney",
        "username": "laborum"
    },
    "gender": "male",
    "status": "cupidatat nostrud irure laboris"
    "game": "568c1c0d678174595975e333",
    "email": "farleyhaney@capscreen.com"
}, {
    "active": true,
    "age": 19,
    "activeGame": "Some Active Game",
    "name": {
        "first": "Jerri",
        "last": "Figueroa",
        "username": "esse"
    },
    "gender": "female",
    "status": "cupidatat nostrud irure laboris"
    "game": "568c1c0da693cf00f72fd993",
    "email": "jerrifigueroa@capscreen.com"
}, {
    "active": true,
    "age": 37,
    "activeGame": "Some Active Game",
    "name": {
        "first": "Cohen",
        "last": "Jenkins",
        "username": "sit"
    },
    "gender": "male",
    "status": "cupidatat nostrud irure laboris"
    "game": "568c1c0db4ea248985ab5fc5",
    "email": "cohenjenkins@capscreen.com"
}, {
    "active": true,
    "age": 17,
    "activeGame": "Some Active Game",
    "name": {
        "first": "Williams",
        "last": "Butler",
        "username": "anim"
    },
    "gender": "male",
    "status": "cupidatat nostrud irure laboris"
    "game": "568c1c0deeeb1a6b3207140f",
    "email": "williamsbutler@capscreen.com"
}];

Cards = [{
    "cardType": "A",
    "text": "Free ice cream, yo.",
    "numAnswers": 0,
    "expansion": "CAHe5"
}, {
    "cardType": "A",
    "text": "A face full of horse cum.",
    "numAnswers": 0,
    "expansion": "CAHe5"
}, {
    "cardType": "Q",
    "text": "Why am I broke?",
    "numAnswers": 1,
    "expansion": "CAHe5"
}]

Data = {
    Users: Users,
    Players: Players,
    Games: Games,
    Cards: Cards
};

module.exports = Data;