import {
	jsx,
	createWindow,
	onWindow,
	uniqueId,
	// drawSVG,
} from "extendscript-ui";
import type { ScriptUIElements } from "extendscript-ui";

interface States {
	default: string | XML;
	mouseover: string | XML;
	mousedown: string | XML;
	mouseup: string | XML;
	disabled: string | XML;
}

const size = [100, 40];
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
	let { states, properties, text, size, onClick } = props;

	const name = properties?.name ?? uniqueId("my_button");
	size = size ?? [100, 100];
	// let svg = states.default;

	// const update = (el: Button, e: any, s: keyof States) => {
	// 	svg = states[s]!;
	// 	el.text = s;
	// 	e.target.notify("onDraw");
	// };

	// onWindow((window) => {
	// 	/**
	// 	 * window.findElement does indeed exist, it's just not in types-for-adobe
	// 	 * once this PR is merged and published to npm we can remove (window as any)! https://github.com/docsforadobe/Types-for-Adobe/pull/142
	// 	 */
	// 	// const el = (window as any).findElement(name);
	// 	// el.addEventListener("mouseover", (e: any) => update(el, e, "mouseover"));
	// 	// el.addEventListener("mousedown", (e: any) => update(el, e, "mousedown"));
	// 	// el.addEventListener("mouseout", (e: any) => update(el, e, "default"));
	// });

	return (
		<button
			text={text}
			size={size}
			properties={{ name }}
			/* @ts-ignore */
			onDraw={function (this: Button, drawState) {
				// this.graphics.drawOSControl();
				// drawSVG(svg, this.graphics);

				/* @ts-ignore */
				const SOLID_BRUSH = this.graphics.BrushType.SOLID_COLOR;
				/* @ts-ignore */
				const SOLID_PEN = this.graphics.PenType.SOLID_COLOR;

				this.graphics.foregroundColor = this.graphics.newPen(
					SOLID_PEN,
					[1, 1, 1],
					1,
				);
				this.graphics.font = ScriptUI.newFont(
					this.graphics.font.name,
					"Bold",
					this.graphics.font.size,
				);

				this.graphics.drawOSControl();
				this.graphics.newPath();
				this.graphics.moveTo(12.5, 0);
				for (var i = 0; i < Math.PI; i += Math.PI / 100) {
					this.graphics.lineTo(
						-12.5 * Math.sin(i) + 12.5,
						-12.5 * Math.cos(i) + 12.5,
					);
				}
				this.graphics.lineTo(157.5, 25);
				for (var i = 0; i < Math.PI; i += Math.PI / 100) {
					this.graphics.lineTo(
						12.5 * Math.sin(i) + 157.5,
						12.5 * Math.cos(i) + 12.5,
					);
				}
				this.graphics.lineTo(12.5, 0);
				this.graphics.closePath();
				this.graphics.fillPath(this.graphics.newBrush(SOLID_BRUSH, [1, 0, 0]));
				if (text) {
					this.graphics.drawString(
						text,
						this.graphics.newPen(SOLID_PEN, [1, 1, 1], 1),
						(size[0] -
							this.graphics.measureString(
								text,
								this.graphics.font,
								size[0],
							)[0]) /
							2,
						(size[1] -
							this.graphics.measureString(
								text,
								this.graphics.font,
								size[1],
							)[1]) /
							2,
						this.graphics.font,
					);
				}
				if (drawState.mouseOver) {
					this.graphics.fillPath(
						this.graphics.newBrush(SOLID_BRUSH, [1, 1, 1]),
					);
					if (text) {
						this.graphics.drawString(
							text,
							this.graphics.newPen(SOLID_PEN, [1, 0, 0], 1),
							(size[0] -
								this.graphics.measureString(
									text,
									this.graphics.font,
									size[0],
								)[0]) /
								2,
							(size[1] -
								this.graphics.measureString(
									text,
									this.graphics.font,
									size[1],
								)[1]) /
								2,
							this.graphics.font,
						);
					}
				} else if (drawState.leftButtonPressed) {
					this.graphics.fillPath(
						this.graphics.newBrush(SOLID_BRUSH, [0.3, 0.2, 0.1]),
					);
				}
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
				text={"Hey!"}
				onClick={() => alert("Hey!")}
			></MyButton>
			<MyButton
				states={states}
				size={size}
				text={"Hello!"}
				onClick={() => alert("Hello!")}
			></MyButton>
			<MyButton
				states={states}
				size={size}
				text={"Nice!"}
				onClick={() => alert("Nice!")}
			></MyButton>
		</palette>
	);
};

(function (thisObj) {
	createWindow(ExampleUI).show();
})(this);
