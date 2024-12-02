import { jsx } from "./jsx";

export const ui = () => (
	<dialog text="Neat!" properties={{ resizeable: true }}>
		<group orientation={"column"} alignChildren={"fill"}>
			<panel
				text="First Row"
				orientation={"row"}
				alignChildren={"top"}
				margins={20}
			>
				<button
					text="Click Me"
					size={[100, 200]}
					onClick={() => alert("Doink!")}
				/>
				<button text="Or Me!" size={[100, 100]} onClick={() => alert("Ty!")} />
				<button text="Hello :)" size={[100, 50]} onClick={() => alert("Hi!")} />
			</panel>
			<panel text="Second Row" orientation={"row"} margins={20}>
				<button text="OK" properties={{ name: "ok" }} />
				<button text="Cancel" properties={{ name: "cancel" }} />
			</panel>
		</group>
	</dialog>
);
