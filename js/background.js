
console.log("Extension loading");
var storage = chrome.storage.local;

function setExtensionBadgeState(booleanState){
	if (booleanState){
		storage.set({"extensionActivityState" : {"state" : true}});
		chrome.browserAction.setBadgeText({text: "on"});
		
		console.log("Running substitution script " + '[' + new Date().toUTCString() + ']');
		chrome.tabs.executeScript(null, {file: "js/content_script.js"});
	} else {
		storage.set({"extensionActivityState" : {"state" : false}});
		chrome.browserAction.setBadgeText({text: "off"});
	}
}

function initExtensionActivityState(){
	chrome.storage.local.get("extensionActivityState",
		function(result){
			if (result.extensionActivityState){
				console.log("Extension activity state is already initialized");
				setExtensionBadgeState(result.extensionActivityState.state);
			} else {
				console.log("Initializing the extension state to 'true' for the first time");
				setExtensionBadgeState(true);
				
			}
		}
	); 
}

function initRules(){
	storage.get("rules",
		function(result){
			if (result.rules){
				console.log("Substitution rules is already initialized");
			} else {
				console.log("Initializing the substitution rules for the first time");
				storage.set({"rules" : initialRuleSet});
			}
		}
	);  
}

// execute the content_script on the current tab (null tabId means the script will run at the current tab)
function runScript(){
	storage.get("extensionActivityState",
		function(result){
			if (result.extensionActivityState){
				var isExtensionOn = result.extensionActivityState.state;
				if (isExtensionOn) {
					console.log("Running substitution script " + '[' + new Date().toUTCString() + ']');
					chrome.tabs.executeScript(null, {file: "js/content_script.js"});
				}
			} else{
				console.error("extensionActivityState is not initialized");
			}
		}
	);
}

chrome.browserAction.onClicked.addListener(function(tab) {
	storage.get("extensionActivityState",
		function(result){
			if (result.extensionActivityState){
				var isExtensionOn = result.extensionActivityState.state;
				setExtensionBadgeState(!isExtensionOn);
			} else {
				console.error("extensionActivityState is not initialized");
			}
		}
	);  
});

// addListener to tabs update and refresh 1 sec after update 
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {  	
	if (changeInfo.status == "loading" && tab.active){
		setTimeout(runScript, 1200);
	}
});



var initialRuleSet = 
[
	// Substitutions: https://xkcd.com/1288/
	{"match_word":"Witnesses" , "substitute_word":"These dudes I know" , "case_sensitive" : true },
	{"match_word":"Witness" , "substitute_word":"this dude I know" , "case_sensitive" : true },
	{"match_word":"Allegedly" , "substitute_word":"Kinda probably" , "case_sensitive" : true },
	{"match_word":"New study" , "substitute_word":"Tumblr post" , "case_sensitive" : true },
	{"match_word":"New Study" , "substitute_word":"Tumblr Post" , "case_sensitive" : true },
	{"match_word":"Rebuild" , "substitute_word":"Avenge" , "case_sensitive" : true },
	{"match_word":"Space" , "substitute_word":"Spaaace" , "case_sensitive" : true },
	{"match_word":"Google glass" , "substitute_word":"Virtual boy" , "case_sensitive" : true },
	{"match_word":"Google Glass" , "substitute_word":"Virtual Boy" , "case_sensitive" : true },
	{"match_word":"Smartphone" , "substitute_word":"Pokedex" , "case_sensitive" : true },
	{"match_word":"Electric" , "substitute_word":"Atomic" , "case_sensitive" : true },
	{"match_word":"Senator" , "substitute_word":"Elf-lord" , "case_sensitive" : true },
	{"match_word":"Senators" , "substitute_word":"Elf-lords" , "case_sensitive" : true },
	{"match_word":"Car" , "substitute_word":"Cat" , "case_sensitive" : true },
	{"match_word":"Cars" , "substitute_word":"Cats" , "case_sensitive" : true },
	{"match_word":"Election" , "substitute_word":"Eating contest" , "case_sensitive" : true },
	{"match_word":"Congressional leaders" , "substitute_word":"River spirits" , "case_sensitive" : true },
	{"match_word":"Congressional Leaders" , "substitute_word":"River Spirits" , "case_sensitive" : true },
	{"match_word":"Homeland security" , "substitute_word":"Homestar runner" , "case_sensitive" : true },
	{"match_word":"Homeland Security" , "substitute_word":"Homestar Runner" , "case_sensitive" : true },
	{"match_word":"Could not be reached for comment" , "substitute_word":"Is guilty and everyone knows it" , "case_sensitive" : true },
	//
	{"match_word":"witnesses" , "substitute_word":"these dudes I know" , "case_sensitive" : false},
	{"match_word":"witness" , "substitute_word":"this dude I know" , "case_sensitive" : false},
	{"match_word":"allegedly" , "substitute_word":"kinda probably" , "case_sensitive" : false},
	{"match_word":"new study" , "substitute_word":"tumblr post" , "case_sensitive" : false},
	{"match_word":"rebuild" , "substitute_word":"avenge" , "case_sensitive" : false},
	{"match_word":"space" , "substitute_word":"spaaace" , "case_sensitive" : false},
	{"match_word":"google glass" , "substitute_word":"Virtual boy" , "case_sensitive" : false},
	{"match_word":"smartphone" , "substitute_word":"Pokedex" , "case_sensitive" : false},
	{"match_word":"electric" , "substitute_word":"atomic" , "case_sensitive" : false},
	{"match_word":"senator" , "substitute_word":"elf-lord" , "case_sensitive" : false},
	{"match_word":"senators" , "substitute_word":"elf-lords" , "case_sensitive" : false},
	{"match_word":"car" , "substitute_word":"cat" , "case_sensitive" : false},
	{"match_word":"cars" , "substitute_word":"cats" , "case_sensitive" : false},
	{"match_word":"election" , "substitute_word":"eating contest" , "case_sensitive" : false},
	{"match_word":"congressional leaders" , "substitute_word":"river spirits" , "case_sensitive" : false},
	{"match_word":"homeland security" , "substitute_word":"homestar runner" , "case_sensitive" : false},
	{"match_word":"could not be reached for comment" , "substitute_word":"is guilty and everyone knows it" , "case_sensitive" : false},

	// Substitutions 2: https://xkcd.com/1625/
	{"match_word": "Debate", "substitute_word": "Dance-Off", "case_sensitive": true },
	{"match_word": "Debates", "substitute_word": "Dance-Offs", "case_sensitive": true },
	{"match_word": "Self Driving", "substitute_word": "Uncontrollably Swerving", "case_sensitive": true },
	{"match_word": "Self-Driving", "substitute_word": "Uncontrollably Swerving", "case_sensitive": true },
	{"match_word": "Vows To", "substitute_word": "Probably Won't", "case_sensitive": true },
	{"match_word": "At Large", "substitute_word": "Very Large", "case_sensitive": true },
	{"match_word": "Poll", "substitute_word": "Psychic Reading", "case_sensitive": true },
	{"match_word": "Polls", "substitute_word": "Psychic Readings", "case_sensitive": true },
	{"match_word": "Candidate", "substitute_word": "Airbender", "case_sensitive": true },
	{"match_word": "Candidates", "substitute_word": "Airbenders", "case_sensitive": true },
	{"match_word": "Drone", "substitute_word": "Dog", "case_sensitive": true },
	{"match_word": "Drones", "substitute_word": "Dogs", "case_sensitive": true },
	{"match_word": "Successfully", "substitute_word": "Suddenly", "case_sensitive": true },
	{"match_word": "Expands", "substitute_word": "Physically Expands", "case_sensitive": true },
	{"match_word": "First-Degree", "substitute_word": "Friggin' Awful", "case_sensitive": true },
	{"match_word": "Second-Degree", "substitute_word": "Friggin' Awful", "case_sensitive": true },
	{"match_word": "Third-Degree", "substitute_word": "Friggin' Awful", "case_sensitive": true },
	{"match_word": "An Unknown Number", "substitute_word": "Like Hundreds", "case_sensitive": true },
	{"match_word": "Front Runner", "substitute_word": "Bladerunner", "case_sensitive": true },
	{"match_word": "Front Runner", "substitute_word": "Bladerunner", "case_sensitive": true },
	{"match_word": "Frontrunner", "substitute_word": "Bladerunner", "case_sensitive": true },
	{"match_word": "Frontrunners", "substitute_word": "Bladerunners", "case_sensitive": true },
	{"match_word": "Global", "substitute_word": "Spherical", "case_sensitive": true },
	{"match_word": "Years", "substitute_word": "Minutes", "case_sensitive": true },
	{"match_word": "Minutes", "substitute_word": "Years", "case_sensitive": true },
	{"match_word": "No Indication", "substitute_word": "Lots of Signs", "case_sensitive": true },
	{"match_word": "Urged Restraint By", "substitute_word": "Drunkenly Egged On", "case_sensitive": true },
	{"match_word": "Horsepower", "substitute_word": "Tons Of Horsemeat", "case_sensitive": true },
	//
	{"match_word": "debate", "substitute_word": "dance-off", "case_sensitive": false },
	{"match_word": "debates", "substitute_word": "dance-offs", "case_sensitive": false },
	{"match_word": "self driving", "substitute_word": "uncontrollably swerving", "case_sensitive": false },
	{"match_word": "self-driving", "substitute_word": "uncontrollably swerving", "case_sensitive": false },
	{"match_word": "vows to", "substitute_word": "probably won't", "case_sensitive": false },
	{"match_word": "at large", "substitute_word": "very large", "case_sensitive": false },
	{"match_word": "poll", "substitute_word": "psychic reading", "case_sensitive": false },
	{"match_word": "polls", "substitute_word": "psychic readings", "case_sensitive": false },
	{"match_word": "candidate", "substitute_word": "airbender", "case_sensitive": false },
	{"match_word": "candidates", "substitute_word": "airbenders", "case_sensitive": false },
	{"match_word": "drone", "substitute_word": "dog", "case_sensitive": false },
	{"match_word": "drones", "substitute_word": "dogs", "case_sensitive": false },
	{"match_word": "successfully", "substitute_word": "suddenly", "case_sensitive": false },
	{"match_word": "expands", "substitute_word": "physically expands", "case_sensitive": false },
	{"match_word": "first-degree", "substitute_word": "friggin' awful", "case_sensitive": false },
	{"match_word": "second-degree", "substitute_word": "friggin' awful", "case_sensitive": false },
	{"match_word": "third-degree", "substitute_word": "friggin' awful", "case_sensitive": false },
	{"match_word": "an unknown number", "substitute_word": "like hundreds", "case_sensitive": false },
	{"match_word": "front runner", "substitute_word": "bladerunner", "case_sensitive": false },
	{"match_word": "front runners", "substitute_word": "bladerunners", "case_sensitive": false },
	{"match_word": "frontrunner", "substitute_word": "bladerunner", "case_sensitive": false },
	{"match_word": "frontrunners", "substitute_word": "bladerunners", "case_sensitive": false },
	{"match_word": "global", "substitute_word": "spherical", "case_sensitive": false },
	{"match_word": "years", "substitute_word": "minutes", "case_sensitive": false },
	{"match_word": "minutes", "substitute_word": "years", "case_sensitive": false },
	{"match_word": "no indication", "substitute_word": "lots of signs", "case_sensitive": false },
	{"match_word": "urged restraint by", "substitute_word": "drunkenly egged on", "case_sensitive": false },
	{"match_word": "horsepower", "substitute_word": "tons of horsemeat", "case_sensitive": false }
];

initExtensionActivityState();
initRules();

// refresh the active tab automatically every 60 seconds
setInterval(runScript, 60000);


	