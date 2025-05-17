import { jsx } from "extendscript-ui";
import { SVG, drawSVG } from "extendscript-ui";
import { map } from "extendscript-ponyfills";

const TestM = SVG(() => (
	<svg>
		<path stroke="black" stroke-width="10" d="M10 10 L50 10" />
	</svg>
));

const TestMm = SVG(() => (
	<svg>
		<path stroke="gray" stroke-width="10" d="m10 10 l40 0" />
	</svg>
));

const TestL = SVG(() => (
	<svg>
		<path stroke="blue" stroke-width="10" d="M10 10 L50 50" />
	</svg>
));

const TestLl = SVG(() => (
	<svg>
		<path stroke="lightblue" stroke-width="10" d="M10 10 l40 40" />
	</svg>
));

const TestC = SVG(() => (
	<svg>
		<path stroke="red" stroke-width="10" d="M10 80 C20 10, 80 10, 90 80" />
	</svg>
));

const TestCc = SVG(() => (
	<svg>
		<path stroke="pink" stroke-width="10" d="M10 80 c10 -70, 70 -70, 80 0" />
	</svg>
));

const TestQ = SVG(() => (
	<svg>
		<path stroke="green" stroke-width="10" d="M10 80 Q50 10, 90 80" />
	</svg>
));

const TestQq = SVG(() => (
	<svg>
		<path stroke="lightgreen" stroke-width="10" d="M10 80 q40 -70, 80 0" />
	</svg>
));

const TestA = SVG(() => (
	<svg>
		<path stroke="purple" stroke-width="10" d="M50 50 A30 30 0 1 1 80 80" />
	</svg>
));

const TestAa = SVG(() => (
	<svg>
		<path stroke="violet" stroke-width="10" d="M50 50 a30 30 0 1 1 30 30" />
	</svg>
));

const TestText = SVG(({ text }: { text: string }) => {
	const center = [50, 50];
	return (
		<svg>
			<rect x={0} y={0} width={130} height={100} fill="plum" />
			<text
				x={center[0]}
				y={center[1]}
				text-anchor="cc"
				fill="blueviolet"
				font-size="18"
				font-style="bold"
			>
				{text}
			</text>
		</svg>
	);
});

export const SVGTestUI = () => {
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
		<palette text="SVG!" orientation="column">
			<group orientation="row">
				{map(SVGTestComponents, (svg, i) => (
					<button
						size={[100, 100]}
						onDraw={function (this: Button) {
							drawSVG(svg({}), this.graphics);
						}}
					></button>
				))}
			</group>
			<group orientation="row">
				<button
					size={[100, 100]}
					onDraw={function (this: Button) {
						drawSVG(TestText({ text: "hello" }), this.graphics);
					}}
				></button>
			</group>
		</palette>
	);
};
