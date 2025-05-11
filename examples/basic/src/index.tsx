import { jsx, createWindow, onWindow, uniqueId } from "extendscript-ui";
import type { ScriptUIElements } from "extendscript-ui";

const Header = ({ text }: { text: string }) => (
	<group orientation={"row"} alignChildren={"fill"}>
		<static-text text={text}></static-text>
	</group>
);

const MyButton = ({
	properties,
	text,
	size,
	onClick,
}: ScriptUIElements["button"]) => {
	const uniqueName = properties?.name ?? uniqueId("my_button");

	onWindow((window) => {
		const el = window.findElement(uniqueName);
		el.addEventListener("mouseover", () => (el.text = "Hello mouse!"));
		el.addEventListener("mouseout", () => (el.text = text));
	});

	return (
		<button
			text={text}
			size={size}
			onClick={onClick}
			properties={{ name: uniqueName }}
		></button>
	);
};

const ui = () => {
	onWindow((window) => {
		window.onResize = window.onResizing = function () {
			window.layout.resize();
		};
	});

	return (
		<dialog
			text="Neat!"
			properties={{ resizeable: true }}
			onClose={() => {
				alert("See ya!");
				/**
				 * once this PR is published to npm we can remove `return true`! https://github.com/docsforadobe/Types-for-Adobe/pull/141
				 * e.g: we are waiting for version > 7.2.3 on npmjs: https://www.npmjs.com/package/types-for-adobe
				 */
				return true;
			}}
		>
			<Header text="Could it be?!" />
			<group orientation={"column"} alignChildren={"fill"}>
				<panel
					text="Wow, a panel!"
					orientation={"row"}
					alignChildren={"top"}
					margins={20}
				>
					<MyButton
						text="Click Me"
						size={[100, 200]}
						onClick={() => alert("Doink!")}
					/>
					<MyButton
						text="Or Me!"
						size={[100, 100]}
						onClick={() => alert("Ty!")}
					/>
					<MyButton
						properties={{ name: "special_name" }}
						text="Hello :)"
						size={[100, 50]}
						onClick={() => alert("Hi!")}
					/>
				</panel>
				<panel text="No way, another panel?!" orientation={"row"} margins={20}>
					<button text="OK" properties={{ name: "ok" }} />
					<button text="Cancel" properties={{ name: "cancel" }} />
				</panel>
			</group>
		</dialog>
	);
};

(function (thisObj) {
	createWindow(ui).show();
})(this);
