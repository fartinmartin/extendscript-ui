import { Prettify } from "../../lib/types";
import { Anchor } from "../../svg/text";

// export type SVGElement = string; // maybe?
export type SVGElementTagName = keyof SVGElements;

// https://www.w3.org/TR/SVG11/eltindex.html
// https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute
type SVGAttributes = {
	fill?: string;
	stroke?: string;
	opacity?: number | string;
	strokeWidth?: number | string;
};

export type SVGElements = {
	svg: {
		width?: number | string;
		height?: number | string;
		viewBox?: string;
	};
	g: {};
	circle: Prettify<
		SVGAttributes & {
			cx?: number | string;
			cy?: number | string;
			r?: number | string;
		}
	>;
	ellipse: Prettify<
		SVGAttributes & {
			cx?: number | string;
			cy?: number | string;
			rx?: number | string;
			ry?: number | string;
		}
	>;
	rect: Prettify<
		SVGAttributes & {
			x?: number | string;
			y?: number | string;
			width?: number | string;
			height?: number | string;
			rx?: number | string;
			ry?: number | string;
		}
	>;
	line: Prettify<
		SVGAttributes & {
			x1?: number | string;
			y1?: number | string;
			x2?: number | string;
			y2?: number | string;
		}
	>;
	polygon: Prettify<
		SVGAttributes & {
			points?: string;
		}
	>;
	polyline: Prettify<
		SVGAttributes & {
			points?: string;
		}
	>;
	path: Prettify<
		SVGAttributes & {
			d?: string;
		}
	>;
	text: Prettify<
		SVGAttributes & {
			x?: number | string;
			y?: number | string;
			dx?: number | string;
			dy?: number | string;
			"text-anchor"?: Anchor;
			"font-family"?: string;
			"font-style"?: "normal" | "italic" | "bold" | "oblique";
			"font-size"?: number | string;
			"font-weight"?: string;
			// TODO: support font-weight="100" - "900"?
			// "font-weight"?: number | string;
		}
	>;
};

export const SVG_TAGS = [
	"svg",
	"g",
	"circle",
	"ellipse",
	"rect",
	"line",
	"polygon",
	"polyline",
	"path",
	"text",
	// "image",
] satisfies SVGElementTagName[];
