// @include "lib/extendscript-ponyfills-v1.1.1.jsx"
// @include "lib/signals.jsx"
// @include "lib/store.jsx"
// @include "lib/svg.jsx"

var appState = new Store({ disabled: false });

var w = new Window("dialog", "simple-v1", undefined, { resizeable: true });

w.grp = w.add("group");
w.grp.orientation = "column";
w.grp.margins = 4;
w.grp.alignChildren = "fill";

var b1 = w.grp.add("button", undefined, "Hello world!", { name: "test" });
b1.preferredSize = [300, 100];
var b2 = w.grp.add("button", undefined, "🔒 Disable");
var b3 = w.grp.add("button", undefined, "Cancel");

w.onResize = w.onResizing = function () {
	w.layout.resize();
	var g = w.grp;
	g.location = [
		(w.size.width - g.size.width) / 2,
		(w.size.height - g.size.height) / 2,
	];
};

b2.onClick = function () {
	appState.update(function (v) {
		return { disabled: !v.disabled };
	});
};
appState.subscribe(function (v) {
	b2.text = v.disabled ? "🔓 Enable" : "🔒 Disable";
});

var b = w.findElement("test");
appState.subscribe(function (v) {
	b.enabled = !v.disabled;
	b.notify("onDraw");
});
w.addEventListener("mousemove", function () {
	b.notify("onDraw");
});

b.onDraw = function (drawState) {
	draw({ drawState: drawState, el: this });
};

b.onClick = function () {
	alert("Hi!");
};

w.show();

//

function draw(context) {
	var drawState = context.drawState;
	var el = context.el;

	var g = el.graphics;
	var size = el.size;
	var text = el.text;

	var state = "base";
	if (drawState.mouseOver) state = "hover";
	if (drawState.hasFocus) state = "focus";
	if (drawState.leftButtonPressed) state = "active";
	if (appState.get().disabled) state = "disabled";

	var styles = {
		base: function () {
			if (drawState.altKeyPressed) {
				return { background: "yellow", color: "blueviolet" };
			} else {
				return { background: "plum", color: "blueviolet" };
			}
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
	}[state]();

	var SOLID_BRUSH = g.BrushType.SOLID_COLOR;
	var SOLID_PEN = g.PenType.SOLID_COLOR;

	var fillColor = g.newBrush(SOLID_BRUSH, parseColor(styles.background));
	var textColor = g.newPen(SOLID_PEN, parseColor(styles.color), 1);

	g.newPath();
	g.rectPath(0, 0, size[0], size[1]);
	g.closePath();
	g.fillPath(fillColor);

	if (text) {
		var desiredSize = 24;
		var baselineSize = 12;
		var scale = desiredSize / baselineSize;

		var fontName = g.font.name;
		var fontStyle = "Bold";

		var testFont = ScriptUI.newFont(fontName, fontStyle, baselineSize);
		if (drawState.altKeyPressed) text = "Alt!";
		var textSize = g.measureString(text, testFont);
		var scaledWidth = textSize[0] * scale;
		var scaledHeight = textSize[1] * scale;

		var x = (size[0] - scaledWidth) / 2;
		var y = (size[1] - scaledHeight) / 2;

		g.font = ScriptUI.newFont(fontName, fontStyle, desiredSize);
		g.drawString(text, textColor, x, y, g.font);
	}
}
