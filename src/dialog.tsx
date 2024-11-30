import { jsx } from "./jsx";

export const ui = (
	<dialog
		text="Alert Box Builder"
		bounds={[100, 100, 400, 200]}
		options={{ resizeable: true, closeButton: true }}
	>
		<button text="Test" bounds={[25, 15, 80, 30]} />
		{/* <panel text="Build it" bounds={[25, 15, 355, 130]}>
			<button text="Test" bounds={[25, 15, 80, 30]} />
			<button
				text="Build"
				bounds={[100, 15, 80, 30]}
				options={{ name: "ok" }}
			/>
			<button
				text="Cancel"
				bounds={[185, 15, 80, 30]}
				options={{ name: "cancel" }}
			/>
		</panel> */}
	</dialog>
);
