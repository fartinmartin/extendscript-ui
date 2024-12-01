import { jsx } from "./jsx";

export function renderSpec(scriptUI: JSX.Element) {
	// alert("spec:\n" + scriptUI.spec);
	// @ts-ignore
	const window = new Window(scriptUI.spec);
	window.onResize = window.onResizing = function () {
		this.layout.resize();
	};
	return window;
}

export const ui = () => (
	<dialog text="Alert Box Builder" properties={{ resizeable: true }}>
		<group orientation={"row"}>
			<panel orientation={"row"}>
				<button text="Test" size={[100, 200]} />
				<button text="Build" properties={{ name: "ok" }} />
				<button text="Cancel" properties={{ name: "cancel" }} />
			</panel>
			<panel orientation={"column"}>
				<button text="Test" />
				<button text="Build" properties={{ name: "ok" }} />
				<button text="Cancel" properties={{ name: "cancel" }} />
			</panel>
		</group>
	</dialog>
);
