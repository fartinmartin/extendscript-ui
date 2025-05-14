import {
	jsx,
	createWindow,
	onWindow,
	uniqueId,
	drawSVG,
} from "extendscript-ui";
import type { ScriptUIElements } from "extendscript-ui";

interface States {
	default: string | XML;
	mouseover: string | XML;
	mousedown: string | XML;
	mouseup: string | XML;
	disabled: string | XML;
}

const size = [40, 40];
const states = {
	default: `
		<svg version="1.1" width="40" height="40">
		  <circle cx="20" cy="20" r="15" fill="#00ccff" stroke="#003366" stroke-width="5"/>
		</svg>`,
	mouseover: `
		<svg version="1.1" width="40" height="40">
		  <circle cx="20" cy="20" r="15" fill="#ccff00" stroke="#669900" stroke-width="5"/>
		</svg>`,
	mousedown: `
		<svg version="1.1" width="40" height="40">
		  <ellipse cx="20" cy="22" rx="15" ry="12" fill="#ff33cc" stroke="#660066" stroke-width="5"/>
		</svg>`,
	mouseup: `
		<svg version="1.1" width="40" height="40">
		  <ellipse cx="20" cy="18" rx="10" ry="17" fill="#cc66ff" stroke="#4b0082" stroke-width="5"/>
		</svg>`,
	disabled: `
		<svg version="1.1" width="40" height="40">
		  <circle cx="20" cy="20" r="15" fill="#dddddd" stroke="#888888" stroke-width="5"/>
		  <line x1="12" y1="12" x2="28" y2="28" stroke="#888888" stroke-width="3"/>
		  <line x1="28" y1="12" x2="12" y2="28" stroke="#888888" stroke-width="3"/>
		</svg>`,
} satisfies States;

const MyButton = (props: ScriptUIElements["button"] & { states: States }) => {
	const { states, properties, text, size, onClick } = props;

	const name = properties?.name ?? uniqueId("my_button");
	let svg = states.default;

	// const update = (e: any, s: keyof States) => {
	// 	svg = states[s];
	// 	e.target.notify("onDraw");
	// };

	// onWindow((window) => {
	// 	/**
	// 	 * window.findElement does indeed exist, it's just not in types-for-adobe
	// 	 * once this PR is merged and published to npm we can remove (window as any)! https://github.com/docsforadobe/Types-for-Adobe/pull/142
	// 	 */
	// 	const el = (window as any).findElement(name);
	// 	el.addEventListener("mouseover", (e: any) => update(e, "mouseover"));
	// 	el.addEventListener("mousedown", (e: any) => update(e, "mousedown"));
	// 	el.addEventListener("mouseout", (e: any) => update(e, "default"));
	// });

	return (
		<button
			text={text}
			size={size}
			properties={{ name }}
			onDraw={function (this: Button) {
				drawSVG(svg, this.graphics);
			}}
		></button>
	);
};

const ExampleUI = () => {
	onWindow((window) => {
		window.onResize = window.onResizing = function () {
			window.layout.resize();
		};
	});

	return (
		<palette text="SVG!" orientation={"row"}>
			<MyButton
				states={states}
				size={size}
				// onClick={() => alert("Hey!")}
			></MyButton>
			<MyButton
				states={states}
				size={size}
				// onClick={() => alert("Hello!")}
			></MyButton>
			<MyButton
				states={states}
				size={size}
				// onClick={() => alert("Nice!")}
			></MyButton>
		</palette>
	);
};

(function (thisObj) {
	createWindow(ExampleUI).show();
})(this);
