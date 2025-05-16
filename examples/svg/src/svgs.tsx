import { jsx, createWindow, onWindow } from "extendscript-ui";
import { SVG, drawSVG, svgColors } from "extendscript-ui";
import { map } from "extendscript-ponyfills";

// prettier-ignore
const TestM = SVG(() => (
	<svg>
		<path stroke="black" stroke-width="10" fill="none" d="M10 10 L50 10" />
	</svg>
));

// prettier-ignore
const TestMm = SVG(() => (
	<svg>
		<path stroke="gray" stroke-width="10" fill="none" d="m10 10 l40 0" />
	</svg>
));

// prettier-ignore
const TestL = SVG(() => (
	<svg>
		<path stroke="blue" stroke-width="10" fill="none" d="M10 10 L50 50" />
	</svg>
));

// prettier-ignore
const TestLl = SVG(() => (
	<svg>
		<path stroke="lightblue" stroke-width="10" fill="none" d="M10 10 l40 40" />
	</svg>
));

// prettier-ignore
const TestC = SVG(() => (
	<svg>
		<path stroke="red" stroke-width="10" fill="none" d="M10 80 C20 10, 80 10, 90 80" />
	</svg>
));

// prettier-ignore
const TestCc = SVG(() => (
	<svg>
		<path stroke="pink" stroke-width="10" fill="none" d="M10 80 c10 -70, 70 -70, 80 0" />
	</svg>
));

// prettier-ignore
const TestQ = SVG(() => (
	<svg>
		<path stroke="green" stroke-width="10" fill="none" d="M10 80 Q50 10, 90 80" />
	</svg>
));

// prettier-ignore
const TestQq = SVG(() => (
	<svg>
		<path stroke="lightgreen" stroke-width="10" fill="none" d="M10 80 q40 -70, 80 0" />
	</svg>
));

// prettier-ignore
const TestA = SVG(() => (
	<svg>
		<path stroke="purple" stroke-width="10" fill="none" d="M50 50 A30 30 0 1 1 80 80" />
	</svg>
));

// prettier-ignore
const TestAa = SVG(() => (
	<svg>
		<path stroke="violet" stroke-width="10" fill="none" d="M50 50 a30 30 0 1 1 30 30" />
	</svg>
));

export const SVGTestUI = () => {
	onWindow((window) => {
		window.onResize = window.onResizing = function () {
			window.layout.resize();
		};
	});

	const SVGTestComponents = [
		TestM,
		TestMm,
		TestL,
		TestLl,
		TestC,
		TestCc,
		TestQ,
		TestQq,
		TestA,
		TestAa,
	];

	return (
		<palette text="SVG!" orientation={"row"}>
			{map(SVGTestComponents, (svg, i) => (
				<button
					size={[100, 100]}
					onDraw={function (this: Button) {
						drawSVG(svg({}), this.graphics);
					}}
				></button>
			))}
		</palette>
	);
};
