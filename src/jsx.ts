import { map } from "extendscript-ponyfills";
import { InstanceProps } from "./types/es3-helpers";
import { mapProps, uuid, capitalize } from "./utils";

export type ScriptUIElement = {
	tagName: ScriptUIElementTagName;
	attributes: ScriptUIElements[ScriptUIElementTagName];
	children?: ScriptUIElement[];
};

export type ScriptUIElements = {
	dialog: Partial<
		InstanceProps<typeof Window> & {
			properties: _AddControlPropertiesWindow;
		}
	>;
	panel: Partial<
		InstanceProps<typeof Panel> & {
			properties: _AddControlPropertiesPanel;
		}
	>;
	group: Partial<
		InstanceProps<typeof Group> & {
			properties: _AddControlProperties;
		}
	>;
	button: Partial<
		InstanceProps<typeof Button> & {
			properties: _AddControlProperties;
		}
	>;
};

export type ScriptUIElementTagName = keyof ScriptUIElements;

export function jsx<T extends ScriptUIElementTagName>(
	tagName: T,
	attributes: ScriptUIElements[T],
	...children: ScriptUIElement[]
): JSX.Element {
	const props = mapProps(
		attributes,
		(prop, value) => `${prop}: ${JSON.stringify(value)}`
	).join(",");

	const nodes = map(children, (child) => {
		const childNodes = child.children ?? [];
		let name = "";

		if (child.attributes.properties && "name" in child.attributes.properties) {
			name = `${child.attributes.properties.name}: `;
		} else {
			name = `${uuid(child.tagName)}: `;
		}

		return name + jsx(child.tagName, child.attributes, ...childNodes).spec;
	}).join(",");

	let spec = "";

	switch (tagName) {
		case "dialog":
			spec = `dialog { ${props}, ${nodes} }`;
			break;
		case "panel":
		case "group":
			spec = `${capitalize(tagName)} { ${props}, ${nodes} }`;
			break;
		default:
			spec = `${capitalize(tagName)} { ${props} }`;
			break;
	}

	return {
		tagName,
		attributes,
		children,
		spec,
	};
}

export function renderSpec(scriptUI: JSX.Element) {
	// alert("spec:\n" + scriptUI.spec);
	// @ts-ignore
	const window = new Window(scriptUI.spec);
	window.onResize = window.onResizing = function () {
		this.layout.resize();
	};
	return window;
}
