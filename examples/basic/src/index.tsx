import { jsx, renderSpec } from "extendscript-ui";

const Header = ({ text }: { text: string }) => (
	<group orientation={"row"} alignChildren={"fill"}>
		<static-text text={text}></static-text>
	</group>
);

const ui = (
	<dialog text="Neat!" properties={{ resizeable: true }}>
		<Header text="Could it be?!" />
		<group orientation={"column"} alignChildren={"fill"}>
			<panel
				text="Wow, a panel!"
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
			<panel text="No way, another panel?!" orientation={"row"} margins={20}>
				<button text="OK" properties={{ name: "ok" }} />
				<button text="Cancel" properties={{ name: "cancel" }} />
			</panel>
		</group>
	</dialog>
);

(function (thisObj) {
	renderSpec(ui).window.show();
})(this);
