// @include "lib/signals.jsx"

function reverse(string) {
	return string.split("").reverse().join("");
}

var details = signal({ first: "fartin", last: "martin" });
var reversed = computed(function () {
	var current = details();
	return reverse(current.first) + " " + reverse(current.last);
});

effect(function () {
	alert("Name is: " + details().first + " " + details().last);
});

alert(reversed());

var prev = details();
details({ first: "jenny", last: prev.last });

alert(reversed());
