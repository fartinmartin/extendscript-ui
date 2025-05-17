import { jsx, onWindow, resolveState, resolveStyles } from "extendscript-ui";
import { SVG, drawSVG } from "extendscript-ui";

interface SVGTextProps {
	text: string;
	background: string;
	color: string;
}

const SVGText = SVG(({ text, background, color }: SVGTextProps) => {
	const size = [300, 100];
	return (
		<svg>
			<rect x={0} y={0} width={size[0]} height={size[1]} fill={background} />
			<text
				x={size[0] / 2}
				y={size[1] / 2}
				text-anchor="cc"
				fill={color}
				font-size="18"
				font-style="bold"
			>
				{text}
			</text>
		</svg>
	);
});

export const ButtonUI = () => {
	let button: Button | null = null;
	let enabled = true;

	onWindow((window) => {
		button = (window as any).findElement("my_button");
	});

	return (
		<dialog text="Button" orientation="column">
			<button
				size={[300, 100]}
				properties={{ name: "my_button" }}
				onClick={() => alert("Hello!")}
				/* @ts-ignore onDraw does indeed pass `drawState`: https://github.com/docsforadobe/Types-for-Adobe/pull/147 */
				onDraw={function (this: Button, drawState: DrawState) {
					const state = resolveState(drawState, () =>
						!enabled ? "disabled" : null,
					);

					/*
					 * since resolveStyles is generic, you could return SVG components directly!
					 * here tho, we return a styles object that we then pass to our SVG component
					 */
					const styles = resolveStyles(state, {
						base: { background: "plum", color: "blueviolet" },
						hover: () => {
							if (drawState.altKeyPressed) {
								// will work if altKey is pressed *before* mouse hovers... TBD on workaround?
								return { background: "black", color: "white" };
							} else {
								return { background: "violet", color: "mediumorchid" };
							}
						},
						focus: { background: "thistle", color: "indigo" },
						active: { background: "mediumorchid", color: "indigo" },
						modified: { background: "black", color: "white" },
						disabled: { background: "lightgray", color: "gray" },
					});

					drawSVG(SVGText({ text: state, ...styles }), this.graphics);
				}}
			></button>
			<button
				text="🔒 Disable"
				onClick={function (this: Button) {
					enabled = !enabled;
					this.text = enabled ? "🔒 Disable" : "🔓 Enable";
					if (button) {
						button.enabled = enabled;
						/*
						 * setting `button.enabled` will trigger `button.onDraw`,
						 * but, if you ever need to force `onDraw` you can use:
						 * `button.notify("onDraw")`
						 */
					}
				}}
			></button>
			<button text="Cancel"></button>
		</dialog>
	);
};
