import { map, reduce, startsWith, trim } from "extendscript-ponyfills";
import { svgColors } from "./colors";

type Node = any;

export function drawSVG(svg: string | XML, g: ScriptUIGraphics) {
	const root = parseSVG(svg);
	traverse(root, g);
}

function parseSVG(svg: string | XML): Node {
	if (svg instanceof XML) return svg;
	if (typeof svg === "string") return new XML(svg);
	throw new Error("Invalid SVG input");
}

function traverse(node: Node, g: ScriptUIGraphics) {
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
			const children = node["*"];
			for (let i = 0; i < children.length(); i++) traverse(children[i], g);
	}
}

function drawRect(node: Node, g: ScriptUIGraphics) {
	const x = +node["@x"] || 0;
	const y = +node["@y"] || 0;
	const w = +node["@width"] || 0;
	const h = +node["@height"] || 0;

	g.newPath();
	g.rectPath(x, y, w, h);

	const { fill, stroke } = parseStyle(node, g);
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawCircle(node: Node, g: ScriptUIGraphics) {
	const cx = +node["@cx"] || 0;
	const cy = +node["@cy"] || 0;
	const r = +node["@r"] || 0;

	g.newPath();
	g.ellipsePath(cx - r, cy - r, 2 * r, 2 * r);

	const { fill, stroke } = parseStyle(node, g);
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawLine(node: Node, g: ScriptUIGraphics) {
	const x1 = +node["@x1"] || 0;
	const y1 = +node["@y1"] || 0;
	const x2 = +node["@x2"] || 0;
	const y2 = +node["@y2"] || 0;

	g.newPath();
	g.moveTo(x1, y1);
	g.lineTo(x2, y2);

	const { stroke } = parseStyle(node, g);
	if (stroke) g.strokePath(stroke);
}

function drawEllipse(node: Node, g: ScriptUIGraphics) {
	const cx = +node["@cx"] || 0;
	const cy = +node["@cy"] || 0;
	const rx = +node["@rx"] || 0;
	const ry = +node["@ry"] || 0;

	g.newPath();
	g.ellipsePath(cx - rx, cy - ry, 2 * rx, 2 * ry);

	const { fill, stroke } = parseStyle(node, g);
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawPolygon(node: Node, g: ScriptUIGraphics) {
	const points = parsePoints(node["@points"]);
	if (!points.length) return;

	g.newPath();
	g.moveTo(points[0][0], points[0][1]);
	for (let i = 1; i < points.length; i++) {
		g.lineTo(points[i][0], points[i][1]);
	}
	g.closePath();

	const { fill, stroke } = parseStyle(node, g);
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawPolyline(node: Node, g: ScriptUIGraphics) {
	const points = parsePoints(node["@points"]);
	if (!points.length) return;

	g.newPath();
	g.moveTo(points[0][0], points[0][1]);
	for (let i = 1; i < points.length; i++) {
		g.lineTo(points[i][0], points[i][1]);
	}

	const { fill, stroke } = parseStyle(node, g);
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawPath(node: Node, g: ScriptUIGraphics) {
	const d = String(node["@d"]);
	const cmds = d.match(/[MLCZHVSCmlczhvsc][^MLCZHVSCmlczhvsc]*/g);
	if (!cmds) return;

	let last: Point = [0, 0] as Point;
	let lastCtrl: Point | null = null;

	const cmdMap: Record<string, (nums: number[]) => void> = {
		M: ([x, y]) => (last = g.moveTo(x, y)),
		m: ([x, y]) => (last = g.moveTo(last[0] + x, last[1] + y)),
		L: ([x, y]) => (last = g.lineTo(x, y)),
		l: ([x, y]) => (last = g.lineTo(last[0] + x, last[1] + y)),
		H: ([x]) => (last = g.lineTo(x, last[1])),
		h: ([x]) => (last = g.lineTo(last[0] + x, last[1])),
		V: ([y]) => (last = g.lineTo(last[0], y)),
		v: ([y]) => (last = g.lineTo(last[0], last[1] + y)),
		Z: () => g.closePath(),
		z: () => g.closePath(),

		C: ([x1, y1, x2, y2, x, y]) => {
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = bezierPoint(last, [x1, y1], [x2, y2], [x, y], t);
				g.lineTo(pt[0], pt[1]);
			}
			last = [x, y] as Point;
			lastCtrl = [x2, y2] as Point;
		},
		c: ([x1, y1, x2, y2, x, y]) => {
			const p1 = [last[0] + x1, last[1] + y1];
			const p2 = [last[0] + x2, last[1] + y2];
			const p = [last[0] + x, last[1] + y];
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = bezierPoint(last, p1, p2, p, t);
				g.lineTo(pt[0], pt[1]);
			}
			last = p as Point;
			lastCtrl = p2 as Point;
		},

		S: ([x2, y2, x, y]) => {
			const refl = lastCtrl
				? [2 * last[0] - lastCtrl[0], 2 * last[1] - lastCtrl[1]]
				: last;
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = bezierPoint(last, refl, [x2, y2], [x, y], t);
				g.lineTo(pt[0], pt[1]);
			}
			last = [x, y] as Point;
			lastCtrl = [x2, y2] as Point;
		},
		s: ([x2, y2, x, y]) => {
			const refl = lastCtrl
				? [2 * last[0] - lastCtrl[0], 2 * last[1] - lastCtrl[1]]
				: last;
			const p2 = [last[0] + x2, last[1] + y2];
			const p = [last[0] + x, last[1] + y];
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = bezierPoint(last, refl, p2, p, t);
				g.lineTo(pt[0], pt[1]);
			}
			last = p as Point;
			lastCtrl = p2 as Point;
		},

		Q: ([x1, y1, x, y]) => {
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = quadPoint(last, [x1, y1], [x, y], t);
				g.lineTo(pt[0], pt[1]);
			}
			last = [x, y] as Point;
			lastCtrl = [x1, y1] as Point;
		},
		q: ([x1, y1, x, y]) => {
			const p1 = [last[0] + x1, last[1] + y1];
			const p = [last[0] + x, last[1] + y];
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = quadPoint(last, p1, p, t);
				g.lineTo(pt[0], pt[1]);
			}
			last = p as Point;
			lastCtrl = p1 as Point;
		},

		T: ([x, y]) => {
			const refl = lastCtrl
				? [2 * last[0] - lastCtrl[0], 2 * last[1] - lastCtrl[1]]
				: last;
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = quadPoint(last, refl, [x, y], t);
				g.lineTo(pt[0], pt[1]);
			}
			last = [x, y] as Point;
			lastCtrl = refl as Point;
		},
		t: ([x, y]) => {
			const refl = lastCtrl
				? [2 * last[0] - lastCtrl[0], 2 * last[1] - lastCtrl[1]]
				: last;
			const p = [last[0] + x, last[1] + y];
			for (let t = 0.1; t <= 1; t += 0.1) {
				const pt = quadPoint(last, refl, p, t);
				g.lineTo(pt[0], pt[1]);
			}
			last = p as Point;
			lastCtrl = refl as Point;
		},

		A: ([rx, ry, rot, laf, sf, x, y]) => {
			const pts = arcToSegments(last, rx, ry, rot, laf, sf, [x, y] as Point);
			for (const pt of pts) g.lineTo(pt[0], pt[1]);
			last = [x, y] as Point;
		},
		a: ([rx, ry, rot, laf, sf, dx, dy]) => {
			const to = [last[0] + dx, last[1] + dy] as Point;
			const pts = arcToSegments(last, rx, ry, rot, laf, sf, to);
			for (const pt of pts) g.lineTo(pt[0], pt[1]);
			last = to;
		},
	};

	g.newPath();

	for (const seg of cmds) {
		const cmd = seg[0];
		/* @ts-ignore split works with RegExp */
		const nums = map(trim(seg.slice(1)).split(/[\s,]+/), Number);
		cmdMap[cmd]?.(nums);
	}

	const { fill, stroke } = parseStyle(node, g);
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawText(node: Node, g: ScriptUIGraphics) {
	const x = +node["@x"] || 0;
	const y = +node["@y"] || 0;
	const text = String(node.text());

	const fontSize = +node["@font-size"] || 12;
	const family = String(node["@font-family"]) || "Arial";

	const w = String(node["@font-weight"]);
	const s = String(node["@font-style"]);

	/* @ts-ignore https://extendscript.docsforadobe.dev/user-interface-tools/scriptui-class/#scriptuifontstyle */
	const { REGULAR, BOLD, ITALIC, BOLDITALIC } = ScriptUI.FontStyle;
	let style = REGULAR;
	if (w === "bold") style = BOLD;
	if (s === "italic") style = ITALIC;
	if (s === "italic" && w === "bold") style = BOLDITALIC;

	const font = ScriptUI.newFont(family, style, fontSize);

	const { fill } = parseStyle(node, g);
	const penColor = fill ? fill.color : [0, 0, 0, 1];
	/* @ts-ignore */
	const p = g.PenType.SOLID_COLOR;
	const pen = g.newPen(p, penColor, 1);

	g.drawString(text, pen, x, y, font);
}

function drawImage(node: Node, g: ScriptUIGraphics) {
	const x = +node["@x"] || 0;
	const y = +node["@y"] || 0;
	const w = String(node["@width"]) ? +node["@width"] : undefined;
	const h = String(node["@height"]) ? +node["@height"] : undefined;

	const href = String(node["@href"]) || String(node["@xlink:href"]);
	if (!href) return;

	const img = ScriptUI.newImage(href);

	if (w != null && h != null) {
		g.drawImage(img, x, y, w, h);
	} else {
		g.drawImage(img, x, y);
	}
}

//

function parseStyle(node: Node, g: ScriptUIGraphics) {
	const f = String(node["@fill"]);
	const s = String(node["@stroke"]);

	/* @ts-ignore */
	const b = g.BrushType.SOLID_COLOR;
	const fill = f && f !== "none" ? g.newBrush(b, parseColor(f)) : null;

	/* @ts-ignore */
	const p = g.PenType.SOLID_COLOR;
	const w = +node["@stroke-width"] || 1;
	const stroke = s && s !== "none" ? g.newPen(p, parseColor(s), w) : null;

	return { fill, stroke };
}

function parseColor(string: string): [number, number, number, number] {
	const expandHex = (hex: string) =>
		hex.length === 4
			? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
			: hex;

	const hexToRgba = (hex: string): [number, number, number, number] => {
		const h = expandHex(hex).slice(1);
		const r = parseInt(h.slice(0, 2), 16) / 255;
		const g = parseInt(h.slice(2, 4), 16) / 255;
		const b = parseInt(h.slice(4, 6), 16) / 255;
		return [r, g, b, 1];
	};

	const rgbToRgba = (rgb: string): [number, number, number, number] => {
		const m = rgb.match(/rgba?\(([^)]+)\)/);
		if (!m) throw new Error("Invalid rgb format");
		const parts = map(m[1].split(","), (s) => trim(s));
		const [r, g, b] = map(parts.slice(0, 3), Number);
		const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
		return [r, g, b, a];
	};

	string = string.toLowerCase();

	if (svgColors[string]) return hexToRgba(svgColors[string]);
	if (startsWith(string, "#")) return hexToRgba(string);
	if (startsWith(string, "rgb")) return rgbToRgba(string);

	throw new Error("Unsupported color format");
}

//

function parsePoints(attr?: string): [number, number][] {
	if (!attr) return [];
	/* @ts-ignore */
	const points = trim(attr).split(/[\s,]+/);
	return reduce(
		points,
		(acc, val, i, arr) => {
			if (i % 2 === 0) acc.push([+val, +arr[i + 1]]);
			return acc;
		},
		[] as [number, number][],
	);
}

type P = Point | number[];

function bezierPoint(p0: P, p1: P, p2: P, p3: P, t: number) {
	const mt = 1 - t;
	const mt2 = mt * mt;
	const t2 = t * t;
	// prettier-ignore
	return [
		mt2 * mt * p0[0] + 3 * mt2 * t * p1[0] + 3 * mt * t2 * p2[0] + t2 * t * p3[0],
		mt2 * mt * p0[1] + 3 * mt2 * t * p1[1] + 3 * mt * t2 * p2[1] + t2 * t * p3[1],
	];
}

function quadPoint(p0: P, p1: P, p2: P, t: number) {
	const mt = 1 - t;
	// prettier-ignore
	return [
		mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0],
		mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1],
  ];
}

// untested :)
function arcToSegments(
	from: Point,
	rx: number,
	ry: number,
	xAxisRotation: number,
	largeArcFlag: number,
	sweepFlag: number,
	to: Point,
	steps = 10,
): Point[] {
	// const rad = (a: number) => (a * Math.PI) / 180;
	const dx2 = (from[0] - to[0]) / 2;
	const dy2 = (from[1] - to[1]) / 2;

	let cx = (from[0] + to[0]) / 2;
	let cy = (from[1] + to[1]) / 2;

	const startAngle = 0;
	const deltaAngle = sweepFlag ? Math.PI : -Math.PI;

	const points: Point[] = [];
	for (let i = 1; i <= steps; i++) {
		const t = i / steps;
		const angle = startAngle + t * deltaAngle;
		const x = cx + rx * Math.cos(angle);
		const y = cy + ry * Math.sin(angle);
		points.push([x, y] as Point);
	}

	return points;
}
