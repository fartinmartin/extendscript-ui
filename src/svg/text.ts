export type Anchor =
	| "tl"
	| "tc"
	| "tr"
	| "cl"
	| "cc"
	| "cr"
	| "bl"
	| "bc"
	| "br";

export function getTextPosition(
	text: string,
	g: ScriptUIGraphics,
	options: {
		fontFamily?: string;
		fontStyle?: string;
		fontSize?: number;
		anchor?: Anchor;
		origin?: [number, number];
	},
): { x: number; y: number } {
	const fontFamily = options.fontFamily || g.font.family;
	const fontSize = options.fontSize || g.font.size;
	const fontStyle = options.fontStyle || (g.font.style as unknown as string);

	const baselineSize = 12;
	const scale = fontSize / baselineSize;
	const baseFont = ScriptUI.newFont(fontFamily, fontStyle, baselineSize);
	const [textW, textH] = g.measureString(text, baseFont);
	const scaledW = textW * scale;
	const scaledH = textH * scale;

	const [ox, oy] = options.origin || [0, 0];
	const anchor = options.anchor || "cc";

	let x = ox;
	let y = oy;

	switch (anchor[0]) {
		case "t":
			break;
		case "c":
			y -= scaledH / 2;
			break;
		case "b":
			y -= scaledH;
			break;
	}

	switch (anchor[1]) {
		case "l":
			break;
		case "c":
			x -= scaledW / 2;
			break;
		case "r":
			x -= scaledW;
			break;
	}

	return { x, y };
}
