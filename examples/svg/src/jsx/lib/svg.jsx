var svgColors = {
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aqua: "#00ffff",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	black: "#000000",
	blanchedalmond: "#ffebcd",
	blue: "#0000ff",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgreen: "#006400",
	darkgrey: "#a9a9a9",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	fuchsia: "#ff00ff",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	gold: "#ffd700",
	goldenrod: "#daa520",
	gray: "#808080",
	green: "#008000",
	greenyellow: "#adff2f",
	grey: "#808080",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavender: "#e6e6fa",
	lavenderblush: "#fff0f5",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgreen: "#90ee90",
	lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	lime: "#00ff00",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	maroon: "#800000",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	navy: "#000080",
	oldlace: "#fdf5e6",
	olive: "#808000",
	olivedrab: "#6b8e23",
	orange: "#ffa500",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	purple: "#800080",
	rebeccapurple: "#663399",
	red: "#ff0000",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	silver: "#c0c0c0",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	teal: "#008080",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	white: "#ffffff",
	whitesmoke: "#f5f5f5",
	yellow: "#ffff00",
	yellowgreen: "#9acd32",
};

function drawSVG(svg, g) {
	var root = parseSVG(svg);
	traverse(root, g);
}

function parseSVG(svg) {
	if (svg instanceof XML) return svg;
	if (typeof svg === "string") return new XML(svg);
	throw new Error("Invalid SVG input");
}

function traverse(node, g) {
	switch (String(node.name())) {
		case "rect":
			drawRect(node, g);
			break;
		case "circle":
			drawCircle(node, g);
			break;
		case "path":
			drawPath(node, g);
			break;
		case "text":
			drawText(node, g);
			break;
		case "image":
			drawImage(node, g);
			break;
		case "line":
			drawLine(node, g);
			break;
		case "ellipse":
			drawEllipse(node, g);
			break;
		case "polygon":
			drawPolygon(node, g);
			break;
		case "polyline":
			drawPolyline(node, g);
			break;
		case "svg":
		case "g":
			var children = node["*"];
			for (var i = 0; i < children.length(); i++) traverse(children[i], g);
	}
}

function drawRect(node, g) {
	var x = +node["@x"] || 0;
	var y = +node["@y"] || 0;
	var w = +node["@width"] || 0;
	var h = +node["@height"] || 0;
	g.newPath();
	g.rectPath(x, y, w, h);
	var _a = parseStyle(node, g),
		fill = _a.fill,
		stroke = _a.stroke;
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawCircle(node, g) {
	var cx = +node["@cx"] || 0;
	var cy = +node["@cy"] || 0;
	var r = +node["@r"] || 0;
	g.newPath();
	g.ellipsePath(cx - r, cy - r, 2 * r, 2 * r);
	var _a = parseStyle(node, g),
		fill = _a.fill,
		stroke = _a.stroke;
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawLine(node, g) {
	var x1 = +node["@x1"] || 0;
	var y1 = +node["@y1"] || 0;
	var x2 = +node["@x2"] || 0;
	var y2 = +node["@y2"] || 0;
	g.newPath();
	g.moveTo(x1, y1);
	g.lineTo(x2, y2);
	var stroke = parseStyle(node, g).stroke;
	if (stroke) g.strokePath(stroke);
}

function drawEllipse(node, g) {
	var cx = +node["@cx"] || 0;
	var cy = +node["@cy"] || 0;
	var rx = +node["@rx"] || 0;
	var ry = +node["@ry"] || 0;
	g.newPath();
	g.ellipsePath(cx - rx, cy - ry, 2 * rx, 2 * ry);
	var _a = parseStyle(node, g),
		fill = _a.fill,
		stroke = _a.stroke;
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawPolygon(node, g) {
	var points = parsePoints(node["@points"]);
	if (!points.length) return;
	g.newPath();
	g.moveTo(points[0][0], points[0][1]);
	for (var i = 1; i < points.length; i++) {
		g.lineTo(points[i][0], points[i][1]);
	}
	g.closePath();
	var _a = parseStyle(node, g),
		fill = _a.fill,
		stroke = _a.stroke;
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawPolyline(node, g) {
	var points = parsePoints(node["@points"]);
	if (!points.length) return;
	g.newPath();
	g.moveTo(points[0][0], points[0][1]);
	for (var i = 1; i < points.length; i++) {
		g.lineTo(points[i][0], points[i][1]);
	}
	var _a = parseStyle(node, g),
		fill = _a.fill,
		stroke = _a.stroke;
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawPath(node, g) {
	var _a;
	var d = String(node["@d"]);

	var cmds = d.match(/[MLCZHVSCmlczhvsc][^MLCZHVSCmlczhvsc]*/g);
	if (!cmds) return;

	var last = [0, 0];
	var lastCtrl = null;

	var cmdMap = {
		M: function (_a) {
			var x = _a[0],
				y = _a[1];
			return (last = g.moveTo(x, y));
		},
		m: function (_a) {
			var x = _a[0],
				y = _a[1];
			return (last = g.moveTo(last[0] + x, last[1] + y));
		},
		L: function (_a) {
			var x = _a[0],
				y = _a[1];
			return (last = g.lineTo(x, y));
		},
		l: function (_a) {
			var x = _a[0],
				y = _a[1];
			return (last = g.lineTo(last[0] + x, last[1] + y));
		},
		H: function (_a) {
			var x = _a[0];
			return (last = g.lineTo(x, last[1]));
		},
		h: function (_a) {
			var x = _a[0];
			return (last = g.lineTo(last[0] + x, last[1]));
		},
		V: function (_a) {
			var y = _a[0];
			return (last = g.lineTo(last[0], y));
		},
		v: function (_a) {
			var y = _a[0];
			return (last = g.lineTo(last[0], last[1] + y));
		},
		Z: function () {
			return g.closePath();
		},
		z: function () {
			return g.closePath();
		},
	};

	g.newPath();
	for (var _i = 0, cmds_1 = cmds; _i < cmds_1.length; _i++) {
		var seg = cmds_1[_i];
		var cmd = seg[0];
		/* @ts-ignore split works with RegExp */
		var nums = map(trim(seg.slice(1)).split(/[\s,]+/), Number);
		(_a = cmdMap[cmd]) === null || _a === void 0
			? void 0
			: _a.call(cmdMap, nums);
	}

	var _b = parseStyle(node, g),
		fill = _b.fill,
		stroke = _b.stroke;

	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

//

function parseStyle(node, g) {
	var f = String(node["@fill"]);
	var s = String(node["@stroke"]);
	/* @ts-ignore */
	var b = g.BrushType.SOLID_COLOR;
	var fill = f && f !== "none" ? g.newBrush(b, parseColor(f)) : null;
	/* @ts-ignore */
	var p = g.PenType.SOLID_COLOR;
	var w = +node["@stroke-width"] || 1;
	var stroke = s && s !== "none" ? g.newPen(p, parseColor(s), w) : null;
	return { fill: fill, stroke: stroke };
}

function parseColor(string) {
	var expandHex = function (hex) {
		return hex.length === 4
			? "#"
					.concat(hex[1])
					.concat(hex[1])
					.concat(hex[2])
					.concat(hex[2])
					.concat(hex[3])
					.concat(hex[3])
			: hex;
	};
	var hexToRgba = function (hex) {
		var h = expandHex(hex).slice(1);
		var r = parseInt(h.slice(0, 2), 16) / 255;
		var g = parseInt(h.slice(2, 4), 16) / 255;
		var b = parseInt(h.slice(4, 6), 16) / 255;
		return [r, g, b, 1];
	};
	var rgbToRgba = function (rgb) {
		var m = rgb.match(/rgba?\(([^)]+)\)/);
		if (!m) throw new Error("Invalid rgb format");
		var parts = map(m[1].split(","), function (s) {
			return trim(s);
		});
		var _a = map(parts.slice(0, 3), Number),
			r = _a[0],
			g = _a[1],
			b = _a[2];
		var a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
		return [r, g, b, a];
	};
	string = string.toLowerCase();
	if (svgColors[string]) return hexToRgba(svgColors[string]);
	if (startsWith(string, "#")) return hexToRgba(string);
	if (startsWith(string, "rgb")) return rgbToRgba(string);
	throw new Error("Unsupported color format");
}
//
function parsePoints(attr) {
	if (!attr) return [];
	/* @ts-ignore */
	var points = trim(attr).split(/[\s,]+/);
	return reduce(
		points,
		function (acc, val, i, arr) {
			if (i % 2 === 0) acc.push([+val, +arr[i + 1]]);
			return acc;
		},
		[],
	);
}

function bezierPoint(p0, p1, p2, p3, t) {
	var mt = 1 - t;
	var mt2 = mt * mt;
	var t2 = t * t;
	// prettier-ignore
	return [
        mt2 * mt * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t2 * t * p3[0],
        mt2 * mt * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t2 * t * p3[1],
    ];
}

function quadPoint(p0, p1, p2, t) {
	var mt = 1 - t;
	// prettier-ignore
	return [
        mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
        mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
    ];
}
