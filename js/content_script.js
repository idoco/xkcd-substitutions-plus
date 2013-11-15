
var replaceWordIfNeeded = function(node) {
	chrome.storage.local.get("rules",
		function(result){
			var rules = result.rules;
			var length = rules.length;
			for (var i = 0; i < length; i++) {
				var rule = rules[i];
				var caseSensativity = 'ig';
				if (rule.case_sensitive){
					caseSensativity = 'g';
				}
				node.textContent =  node.textContent.replace(new RegExp('\\b'+rule.match_word+'\\b', 'ig'), rule.substitute_word);
			}
		}
	);	
}
	
walker = document.createTreeWalker(
	document.body,
	NodeFilter.SHOW_TEXT,
	null,
	false);	

while(walker.nextNode()) {
	var currentNode = walker.currentNode;
	//console.log(currentNode);
	if (currentNode != null){
		console.log(currentNode.textContent);
		console.log(currentNode.textContent);
		replaceWordIfNeeded(currentNode);
	}
}
