// fullKey -> array of aliases
var keyMap = {
	altKeyPressed: ["alt", "option"],
	capsLockKeyPressed: ["caps"],
	cmdKeyPressed: ["cmd", "meta"],
	ctrlKeyPressed: ["ctrl"],
	hasFocus: ["focus"],
	leftButtonPressed: ["mouseLeft", "leftClick", "click"],
	middleButtonPressed: ["mouseMiddle", "middleClick"],
	rightButtonPressed: ["mouseRight", "rightClick"],
	mouseOver: ["hover"],
	numLockKeyPressed: ["num"],
	optKeyPressed: ["opt"],
	shiftKeyPressed: ["shift"],
};

var aliasToFullKeys = (function () {
	var rev = {};
	for (var fullKey in keyMap) {
		if (keyMap.hasOwnProperty(fullKey)) {
			var aliases = keyMap[fullKey];
			for (var i = 0; i < aliases.length; i++) {
				var alias = aliases[i];
				if (!rev[alias]) rev[alias] = [];
				rev[alias].push(fullKey);
			}
		}
	}
	return rev;
})();

function compressKey(fullKey) {
	var aliases = keyMap[fullKey];
	if (aliases && aliases.length) return aliases[0];
	return fullKey;
}

function normalizeKeyCombo(comboKey) {
	var parts = comboKey.split("+");
	var compressed = [];
	for (var i = 0; i < parts.length; i++) {
		var part = parts[i];
		var found = false;
		for (var full in keyMap) {
			if (keyMap.hasOwnProperty(full)) {
				var aliases = keyMap[full];
				for (var j = 0; j < aliases.length; j++) {
					if (aliases[j] === part) {
						compressed.push(aliases[0]);
						found = true;
						break;
					}
				}
				if (found) break;
			}
		}
		if (!found) {
			// fallback: treat part as alias or full key as-is
			compressed.push(part);
		}
	}
	return compressed.sort().join("+");
}

function validateStyleMap(styleMap) {
	var validAliases = {};
	for (var fullKey in keyMap) {
		if (keyMap.hasOwnProperty(fullKey)) {
			var aliases = keyMap[fullKey];
			for (var i = 0; i < aliases.length; i++) {
				validAliases[aliases[i]] = true;
			}
		}
	}
	for (var key in styleMap) {
		if (key === "base") continue;
		var normKey = normalizeKeyCombo(key);
		var parts = normKey.split("+");
		for (var i = 0; i < parts.length; i++) {
			if (!validAliases[parts[i]]) {
				throw new Error("Invalid styleMap key: " + key);
			}
		}
	}
}

function getCombinations(arr, size) {
	var result = [];

	function helper(start, combo) {
		if (combo.length === size) {
			result.push(combo.slice());
			return;
		}
		for (var i = start; i < arr.length; i++) {
			combo.push(arr[i]);
			helper(i + 1, combo);
			combo.pop();
		}
	}

	helper(0, []);
	return result;
}

function isComboActive(comboKey, activeAliases) {
	var parts = comboKey.split("+");
	for (var i = 0; i < parts.length; i++) {
		if (indexOf(activeAliases, parts[i]) === -1) return false;
	}
	return true;
}

function getStyles(state, styleMap) {
	validateStyleMap(styleMap);

	var activeAliases = [];
	for (var key in state) {
		if (state[key]) {
			var aliases = keyMap[key];
			if (aliases && aliases.length) {
				activeAliases.push(aliases[0]);
			} else {
				activeAliases.push(key);
			}
		}
	}

	for (var key in styleMap) {
		if (key === "base") continue;
		var normKey = normalizeKeyCombo(key);
		if (isComboActive(normKey, activeAliases)) return styleMap[key];
	}

	return styleMap.base;
}
