import { jsx, createWindow } from "extendscript-ui";
import { SVG, drawSVG, svgColors } from "extendscript-ui";
import { SVGTestUI } from "./examples/svgs";
import { ButtonUI } from "./examples/button";

const Smiley = SVG(({ fill, stroke }: { fill?: string; stroke?: string }) => {
	const strokeWidth = 8;

	return (
		<svg width="150" height="150">
			<circle
				cx="75"
				cy="75"
				r="70"
				fill={fill ?? "lemonchiffon"}
				stroke={stroke ?? "orange"}
				stroke-width={strokeWidth}
			/>

			<circle cx="65" cy="65" r="6" fill={stroke ?? "orange"} />
			<circle cx="85" cy="65" r="6" fill={stroke ?? "orange"} />

			<path
				d="M45 80 Q75 100 105 80"
				stroke={stroke ?? "orange"}
				stroke-width={strokeWidth}
			/>
		</svg>
	);
});

function randomColor() {
	var keys = [];
	for (var c in svgColors) if (svgColors.hasOwnProperty(c)) keys.push(c);
	return keys[Math.floor(Math.random() * keys.length)];
}

const ExampleUI = () => {
	return (
		<palette text="SVG!" orientation="row">
			<button
				size={[150, 150]}
				properties={{ name: "my_button" }}
				onClick={() => alert("Hello!")}
				onDraw={function (this: Button /*, drawState: DrawState */) {
					const svg = Smiley({ fill: randomColor(), stroke: randomColor() });
					drawSVG(svg, this.graphics);
				}}
			></button>
		</palette>
	);
};

const window = createWindow(ExampleUI);
window.show();
