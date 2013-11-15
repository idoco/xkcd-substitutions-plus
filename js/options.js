

function Rule(data) {
  var rules = document.getElementById('rules');
  this.node = document.getElementById('rule-template').cloneNode(true);
  this.node.id = 'rule' + (Rule.next_id++);
  this.node.rule = this;
  rules.appendChild(this.node);
  this.node.hidden = false;

  if (data) {
    this.getElement('match-word').value = data.match_word;
    this.getElement('substitute-word').value = data.substitute_word;
    this.getElement('case-sensitive').checked = data.case_sensitive;
  }

  this.getElement('match-word').onkeyup = storeRules;
  this.getElement('substitute-word').onkeyup = storeRules;
  this.getElement('case-sensitive').onchange = storeRules;

  var rule = this;

  this.getElement('remove').onclick = function() {
    rule.node.parentNode.removeChild(rule.node);
    storeRules();
  };
  storeRules();
}

Rule.prototype.getElement = function(name) {
  return document.querySelector('#' + this.node.id + ' .' + name);
}

Rule.next_id = 0;


function loadRulesToOptionsPage() {
	chrome.storage.local.get("rules",
		function(result){
			var rules = result.rules			
			try {				
				var length = rules.length
				for (var i = 0; i < length; i++) {
					new Rule(rules[i]);
				}
			} catch (e) {
				console.log("Could not reload initial rule set, please reload the extension");			
			}
		}
	);  
}

function storeRules() {
  chrome.storage.local.set({"rules" :
	Array.prototype.slice.apply(document.getElementById('rules').childNodes)
		.map(
			function(node) {
				return {match_word: node.rule.getElement('match-word').value,
						substitute_word: node.rule.getElement('substitute-word').value,
						case_sensitive: node.rule.getElement('case-sensitive').checked};
			}
		)
	});
}



window.onload = function() {
  loadRulesToOptionsPage();
  document.getElementById('new').onclick = function() {
	new Rule();
  };
}
