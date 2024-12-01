import { jsx } from "./jsx";

export const ui = () => (
	<dialog text="Alert Box Builder" properties={{ resizeable: true }}>
		<group orientation={"row"}>
			<panel orientation={"row"}>
				<button text="Test" size={[100, 200]} onClick={() => alert("Test!")} />
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
