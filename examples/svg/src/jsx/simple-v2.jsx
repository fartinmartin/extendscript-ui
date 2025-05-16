// @include "lib/extendscript-ponyfills-v1.1.1.jsx"
// @include "lib/store.jsx"
// @include "lib/svg.jsx"

var appState = new Store({ disabled: false });

var w = new Window("dialog", "test");

w.b1 = w.add("button", undefined, "Hello world!", { name: "test" });
w.b1.preferredSize = [300, 100];

w.b2 = w.add("button", undefined, "Disable");
w.b2.onClick = function () {
	appState.update(function (v) {
		return { disabled: !v.disabled };
	});
};
appState.subscribe(function (v) {
	w.b2.text = v.disabled ? "Enable" : "Disable";
});

w.b3 = w.add("button", undefined, "Cancel");

var b = w.findElement("test");
appState.subscribe(function (v) {
	b.enabled = !v.disabled;
	b.notify("onDraw");
});

b.onDraw = function (drawState) {
	draw({ drawState: drawState, el: this });
};

b.onClick = function () {
	alert("hello");
};

w.show();

//

function draw(context) {
	var drawState = context.drawState;

	var state = getState(drawState, function () {
		if (appState.get().disabled) return "disabled";
	});

	var styles = {
		base: function (context) {
			var drawState = context.drawState;

			if (drawState.altKeyPress) {
				return { background: "yellow", color: "red" };
			}

			return { background: "plum", color: "blueviolet" };
		},
		hover: function () {
			return { background: "violet", color: "mediumorchid" };
		},
		focus: function () {
			return { background: "thistle", color: "indigo" };
		},
		active: function () {
			return { background: "mediumorchid", color: "indigo" };
		},
		disabled: function () {
			return { background: "lightgray", color: "gray" };
		},
	}[state](context);
}

function getState(drawState, fn) {
	var state = "base";

	if (drawState.mouseOver) state = "hover";
	if (drawState.hasFocus) state = "focus";
	if (
		drawState.leftButtonPressed ||
		drawState.middleButtonPressed ||
		drawState.rightButtonPressed
	)
		state = "active";
	if (
		drawState.altKeyPressed ||
		drawState.optKeyPressed ||
		drawState.cmdKeyPressed ||
		drawState.ctrlKeyPressed ||
		drawState.shiftKeyPressed ||
		drawState.capsLockKeyPressed ||
		drawState.numLockKeyPressed
	)
		state = "modified";

	var override = fn ? fn() : null;
	if (override) state = override;

	return state;
}
