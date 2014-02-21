
console.log("Extension loading");
var storage = chrome.storage.local;

var setExtensionBadgeState = function(booleanState){
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

var initExtensionActivityState = function(){
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

var initRules = function(){
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
var runScript = function(){
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
	{"match_word":"could not be reached for comment" , "substitute_word":"is guilty and everyone knows it" , "case_sensitive" : false}	
];

initExtensionActivityState();
initRules();

// refresh the active tab automatically every 60 seconds
setInterval(runScript, 60000);


	