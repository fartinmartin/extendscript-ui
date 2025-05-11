import { jsx, createWindow, onWindow, uniqueId } from "extendscript-ui";
import type { ScriptUIElements } from "extendscript-ui";

const Header = ({ text }: { text: string }) => (
	<group orientation={"row"} alignChildren={"fill"}>
		<static-text text={text}></static-text>
	</group>
);

const Button = ({ children, ...props }: ScriptUIElements["button"]) => {
	const uniqueName = uniqueId("button");

	onWindow((window) => {
		const el = window.findElement(uniqueName);
		el.addEventListener("mouseover", () => (el.text = "Hello mouse!"), true);
		el.addEventListener("mouseout", () => (el.text = props.text), true);
	});

	return (
		<button {...props} properties={{ ...props.properties, name: uniqueName }}>
			{children}
		</button>
	);
};

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
				<Button
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
	createWindow(ui).show();
})(this);
