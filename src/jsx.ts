import { forEach } from "extendscript-ponyfills";
import { InstanceProps } from "./types/es3-helpers";

export type ScriptUIElement = {
	tagName: ScriptUIElementTagName;
	attributes: ScriptUIElements[ScriptUIElementTagName];
	children?: ScriptUIElement[];
	instance?: Window | Panel | Button;
};

export type ScriptUIElements = {
	dialog: Partial<
		InstanceProps<typeof Window> & { options: _AddControlPropertiesWindow }
	>;
	panel: Partial<
		InstanceProps<typeof Panel> & { options: _AddControlPropertiesPanel }
	>;
	button: Partial<
		InstanceProps<typeof Button> & { options: _AddControlProperties }
	>;
};

export type ScriptUIElementTagName = keyof ScriptUIElements;

// A global or external stack to track the current parent context
const parentStack: ScriptUIElement[] = [];

export function jsx<T extends ScriptUIElementTagName>(
	tagName: T,
	attributes: ScriptUIElements[T],
	children: ScriptUIElement[] = []
): ScriptUIElement {
	alert(`creating: ${tagName}\n${attributes.toSource()}`);
	let element: ScriptUIElement;

	const { text, bounds } = attributes;

	if (tagName === "dialog") {
		const options = attributes.options as _AddControlPropertiesWindow;
		alert(`dialog: ${attributes.text}`);
		const instance = new Window("dialog", text, bounds, options);
		element = { instance, tagName: tagName, attributes: attributes };
		parentStack.push(element);
	} else {
		const parent = parentStack[parentStack.length - 1];
		const parentInstance = parent?.instance;

		if (!parent) {
			throw new Error("Parent element is required for non-dialog elements");
		} else if (!parentInstance) {
			throw new Error("Parent element must be instantiated");
		} else if (!isContainer(parentInstance)) {
			throw new Error("Parent element must be of Container type");
		}

		let instance: ScriptUIElement["instance"];

		switch (tagName) {
			case "panel":
				instance = parentInstance.add(
					"panel",
					bounds,
					text,
					attributes.options
				);
				break;
			case "button":
				instance = parentInstance.add(
					// @ts-expect-error
					"button",
					bounds,
					text,
					attributes.options
				);
				break;
			default:
				throw new Error(`Unsupported element type: ${tagName}`);
		}

		element = { instance, tagName: tagName, attributes: attributes };
	}

	if (children.length > 0) {
		parentStack.push(element);
		forEach(children, (child) =>
			jsx(child.tagName, child.attributes, child.children)
		);
		parentStack.pop();
	}

	return element;
}

type Container = Window | Panel | Group | Tab; // | TabbedPanel (breaks types-for-adobe)
function isContainer(element: any): element is Container {
	return !!element.add;
}
