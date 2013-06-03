// Auth for "Bot Matrix"
var ROOMID		= '505b58e6aaa5cd204a00013e',
	TopBot 		= '',
	TopBotID	= '',
	BotCounter 	= 0,
	BotNames 	= [];
 

var Bot = require('./node_modules/ttapi');

// BotCrew: Assemble!
var botCrew = [];
addBot('EkHnBtnAYIMiJvsTpjyRtbzU', '5137f27aeb35c150ccaab65d', 'Bot Matrix');
//addBot('qrFbTCdYrHRvmcONPCutAqex','5060772daaa5cd204a0007b5','Tackk HQ');


// All bots up-vote; Only TopBot speaks.
var len = botCrew.length;
for (var i = 0; i < len; i++) {
	// All Bots:
	botCrew[i].on('newsong', function(data){ voteUpAutomaticallyButAtRandomTime(this, data); });
	if (i === 0) { 
		// TopBot only:
		botCrew[i].on('speak', function(data){ respondToSpeak(this, data); });
		botCrew[i].on('endsong', function (data){ addPopular(this, data); });
	}
}




//-----------------------------------------------------------------------------------------------------
// UTILITY FUNCTIONS
//-----------------------------------------------------------------------------------------------------

function addBot (auth, userid, username) {
	var newBot = new Bot(auth, userid, ROOMID);
	botCrew.push(newBot);
	BotCounter += 1;
	if (BotCounter === 1) { TopBot = username, TopBotID = userid; }
}

function voteUpAutomaticallyButAtRandomTime (caller, data) {
	var maxWaitSeconds = 80;
	var oneSecond = 1000;
	setTimeout( function() {
		caller.vote('up');
	}, Math.floor(Math.random() * maxWaitSeconds) * oneSecond);
}

function addPopular( caller, endSongData ){
	
	if( endSongData.room.metadata.upvotes >= 3 && endSongData.room.metadata.downvotes == 0 ) {
		caller.playlistAdd( 'idle', endSongData.room.metadata.current_song._id );
		caller.speak( getAGoodSongResponse(endSongData.room.metadata.current_song.djname) );
	}
	
}

function respondToSpeak (caller, speakData) {
	if (speakData.name !== TopBot) {		
		var t = speakData.text;
		switch (true) {
			case /^[\/#!]*commands/.test(t): // Respond to "#commands" or "!commands"
				caller.speak('Commands: dance • boogie • hello • #boo • push it bot • get down bot');
				break;
			case /dance/i.test(t): // Two different words make bot bop
			case /boogie/i.test(t):
				caller.vote('up');
				caller.speak(getADanceResponse());
				break;
			case /hello/i.test(t): // Respond to "hello" no matter where it is in user's comment
				caller.speak(getAHelloResponse(speakData.name));
				break;
			case /^boot everyone/i.test(t): // Respond to "boot everyone"
				bootEveryone(caller);
				caller.speak('EVERYONE GET DOWN THIS IS A STICK UP!!');
				setTimeout( function() {
					caller.speak('HA! Do not call the cops, I was just messin\' around.');
				}, 3000);
				break;
			case /^[\/#!]*boo/i.test(t): // Respond to either "#boo" or "!boo"
				caller.speak(getABooResponse(speakData.name));
				break;
			case /^push it/i.test(t): // Respond to "push it"
				caller.playlistSwitch("pushit");
				caller.addDj();
				bootEveryone(caller);
				caller.speak('Ahhh!! Push It!');
				break;
			case /^get down/i.test(t): // respond to "get down"
				caller.remDj(TopBotID);
				break;
			case /^play idle/i.test(t): // Respond to "play idle"
				caller.playlistSwitch("idle");
				caller.addDj();
				break;
		}
	}
}

function bootEveryone(caller){

	caller.roomInfo(false, function(data){
		for( var i=0; i<data.djids.length; i++){ // data.room.metadata.djs.length
			caller.remDj( data.djids[i] );
		}
	});
	
}

function getADanceResponse() {
	var responses = [
		'Ah yeah, this is the JAM!',
		'My name is Bot Matrix and I like to dance!!',
		'That\s that FUNK!',
		'Dirty JAMZ!!',
		'SCIENCE!',
		'Time to BOOGIE!',
		'YEEEAH!! OOOKAYYY??!',
		'All of these beats!!!!',
		'The beats are BUMPIN!!',
		'LET\S RAGE!!!!',
		'Cannonball!',
		'SHAKE IT!'
	];
	return responses[Math.floor(Math.random() * responses.length)];
}

function getAHelloResponse(name) {
	var responses = [
		'Hey there, '+name+' what\'s good?',
		'And a good day to you too sir!',
		'Back atcha, '+name+'!',
		'Shh shh! Everyone quit talking about '+name
	];
	return responses[Math.floor(Math.random() * responses.length)];
}

function getABooResponse(name) {
	var responses = [
		'Shove it, '+name+'!',
		'Awwww, '+name+' doesn\'t like the song, waaaaaaa',
		'Suck it, '+name+'!',
		'This does not pass the smell test for me either '+name+'.'
	];
	return responses[Math.floor(Math.random() * responses.length)];
}

function getAGoodSongResponse( name ){
	var responses = [	
		'Nice Jam '+name+'! Imma remember that one',
		name+' that was a solid tune bro!'
	];
	return responses[Math.floor(Math.random() * responses.length)];	
}
