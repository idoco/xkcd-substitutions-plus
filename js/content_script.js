
var replaceWordIfNeeded = function(node) {
	chrome.storage.local.get("rules",
		function(result){
			var rules = result.rules;
			var length = rules.length;
			for (var i = 0; i < length; i++) {
				var rule = rules[i];
				var caseSensitively = 'ig';
				if (rule.case_sensitive){
					caseSensitively = 'g';
				}
				var matchString;
				if (rule.match_substring){
					matchString = rule.match_word;
				} else {
					matchString = '\\b'+rule.match_word+'\\b';
				}
				node.textContent =  node.textContent.replace(new RegExp(matchString, caseSensitively), rule.substitute_word);
			}
		}
	);
};
	
walker = document.createTreeWalker(
	document.body,
	NodeFilter.SHOW_TEXT,
	null,
	false);	

while(walker.nextNode()) {
	var currentNode = walker.currentNode;
	//console.log(currentNode);
	if (currentNode != null){
		replaceWordIfNeeded(currentNode);
	}
}
