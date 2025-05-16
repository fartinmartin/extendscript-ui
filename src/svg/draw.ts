import { map, reduce, trim } from "extendscript-ponyfills";
import { parseColor } from "./colors";
import { createCmds } from "./cmds";

export function drawSVG(svg: string | XML, g: ScriptUIGraphics) {
	const root = parseSVG(svg);
	traverse(root, g);
}

/* Optional helper to suppress TypeScript complaining that your SVG component does not return a string. */
export function SVG<P>(
	SVGComponent: (props: P) => JSX.Element,
): (props: P) => string {
	return (props: P) => SVGComponent(props) as unknown as string;
}

//

// https://extendscript.docsforadobe.dev/integrating-xml/the-xml-object/
// each node will be an XML object representing an SVGElement... for simplicity's sake, we type as `any` for now...
type Node = any;

function parseSVG(svg: string | XML): Node {
	if (svg instanceof XML) return svg;
	if (typeof svg === "string") return new XML(svg);
	throw new Error("Invalid SVG input");
}

function traverse(node: Node, g: ScriptUIGraphics) {
	switch (String(node.name())) {
		case "svg":
		case "g":
			const children = node["*"];
			for (let i = 0; i < children.length(); i++) {
				traverse(children[i], g);
			}
		case "circle":
			drawCircle(node, g);
			break;
		case "ellipse":
			drawEllipse(node, g);
			break;
		case "rect":
			drawRect(node, g);
			break;
		case "path":
			drawPath(node, g);
			break;
		case "line":
			drawLine(node, g);
			break;
		case "polygon":
			drawPolygon(node, g);
			break;
		case "polyline":
			drawPolyline(node, g);
			break;
		case "text":
			drawText(node, g);
			break;
		// case "image":
		// 	drawImage(node, g);
		// 	break;
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

	const cmdString = d.match(/[mlcqzvhsta][^mlcqzvhsta]*/gi);
	if (!cmdString) return;

	const cmds = createCmds(g);
	g.newPath();

	for (const seg of cmdString) {
		const cmd = seg[0];
		/* @ts-ignore split works with RegExp */
		const nums = map(trim(seg.slice(1)).split(/[\s,]+/), Number);
		if (cmd in cmds) cmds[cmd as keyof typeof cmds]?.(nums);
	}

	const { fill, stroke } = parseStyle(node, g);
	if (fill) g.fillPath(fill);
	if (stroke) g.strokePath(stroke);
}

function drawText(node: Node, g: ScriptUIGraphics) {
	const x = +node["@x"] || 0;
	const y = +node["@y"] || 0;
	const text = String(node.text());

	const fontSize = +node["@font-size"] || g.font.size;
	const family = String(node["@font-family"]) || g.font.family;

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

function parsePoints(attr?: string): [number, number][] {
	if (!attr) return [];
	/* @ts-ignore */
	const points = trim(attr).split(/[\s,]+/);
	return reduce(
		points,
		(acc, val, i, arr) => {
			if (i % 2 === 0) acc.push([+val, +arr[i + 1] as number]);
			return acc;
		},
		[] as [number, number][],
	);
}
