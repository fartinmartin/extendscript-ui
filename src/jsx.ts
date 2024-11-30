import { forEach } from "extendscript-ponyfills";
import { InstanceProps } from "./types/es3-helpers";

export type ScriptUIElement = {
	type: ScriptUIElementTagNameMap;
	props: ScriptUIElements[ScriptUIElementTagNameMap];
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

export type ScriptUIElementTagNameMap = keyof ScriptUIElements;

// A global or external stack to track the current parent context
const parentStack: ScriptUIElement[] = [];

export function jsx<T extends ScriptUIElementTagNameMap>(
	type: T,
	props: ScriptUIElements[T],
	children: ScriptUIElement[] = []
): ScriptUIElement {
	let element: ScriptUIElement;

	const { text, bounds } = props;

	if (type === "dialog") {
		const instance = new Window("dialog", text, bounds); // props.options);
		element = { instance, type, props };
	} else {
		const parent = parentStack[parentStack.length - 1];
		const parentInstance = parent.instance;

		if (!parent) {
			throw new Error("Parent element is required for non-dialog elements");
		} else if (!parentInstance) {
			throw new Error("Parent element must be instantiated");
		} else if (!isContainer(parentInstance)) {
			throw new Error("Parent element must be of Container type");
		}

		let instance: ScriptUIElement["instance"];

		switch (type) {
			case "panel":
				instance = parentInstance.add("panel", bounds, text, props.options);
				break;
			case "button":
				// @ts-expect-error
				instance = parentInstance.add("button", bounds, text, props.options);
				break;
			default:
				throw new Error(`Unsupported element type: ${type}`);
		}

		element = { instance, type, props };
	}

	// Handle children if there are any
	if (children.length > 0) {
		parentStack.push(element);
		forEach(children, (child) => jsx(child.type, child.props, child.children));
		parentStack.pop();
	}

	return element;
}

type Container = Window | Panel | Group | Tab; // | TabbedPanel (breaks types-for-adobe)
function isContainer(element: any): element is Container {
	return !!element.add;
}
