import { find, forEach, map } from "extendscript-ponyfills";
import { InstanceProps } from "./types/es3-helpers";
import { mapProps, capitalize, noop } from "./utils";

export type ScriptUIElement = {
	tagName: ScriptUIElementTagName;
	attributes: ScriptUIElements[ScriptUIElementTagName];
	children?: ScriptUIElement[];
};

type Attributes<T extends new (...args: any[]) => any, K> = Partial<
	InstanceProps<T> & { properties: K }
>;

export type ScriptUIElements = {
	dialog: Attributes<typeof Window, _AddControlPropertiesWindow>;
	palette: Attributes<typeof Window, _AddControlPropertiesWindow>;
	panel: Attributes<typeof Panel, _AddControlPropertiesPanel>;
	group: Attributes<typeof Group, _AddControlProperties>;
	button: Attributes<typeof Button, _AddControlProperties> & {
		onClick?: Button["onClick"];
	};
};

export type ScriptUIElementTagName = keyof ScriptUIElements;

const eventHandlers: Record<string, () => void> = {};
let idCounter = 0;

export function jsx<T extends ScriptUIElementTagName>(
	tagName: T,
	attributes: ScriptUIElements[T],
	...children: ScriptUIElement[]
): JSX.Element {
	const id = getIdentifier(tagName, attributes);

	if ("onClick" in attributes && attributes.onClick) {
		eventHandlers[id] = attributes.onClick;
	}

	const props = mapProps(
		attributes,
		(prop, value) => `${prop}: ${JSON.stringify(value)}`
	).join(",");

	const nodes = map(children, (child) => {
		const childNodes = child.children ?? [];
		let name = `${getIdentifier(child.tagName, child.attributes)}: `;
		return name + jsx(child.tagName, child.attributes, ...childNodes).spec;
	}).join(",");

	let spec = "";

	switch (tagName) {
		case "dialog":
			spec = `dialog { ${props}, ${nodes} }`;
			break;
		case "palette":
			spec = `palette { ${props}, ${nodes} }`;
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
		id,
	};
}

export function renderSpec(scriptUI: JSX.Element) {
	// alert("spec:\n" + scriptUI.spec);

	// @ts-ignore
	const window = new Window(scriptUI.spec);

	window.onResize = window.onResizing = function () {
		this.layout.resize();
	};

	forEachChild(window, (child) => {
		if (child.properties && child.properties.name) {
			const id = child.properties.name;
			const cb = eventHandlers[id];
			if (cb) (child as unknown as Button).onClick = cb;
		}
	});

	return {
		window,
		destroy: () => {},
	};
}

//

function getIdentifier<T extends ScriptUIElementTagName>(
	tagName: T,
	attributes: ScriptUIElements[T]
) {
	let name = "";

	if (
		attributes.properties &&
		"name" in attributes.properties &&
		attributes.properties.name
	) {
		name = attributes.properties.name;
	} else {
		name = `${tagName}_${idCounter++}`;
	}

	attributes.properties = {
		...(attributes.properties ?? {}),
		name: name,
	};

	return name;
}

type Container = Window | Panel | Group | Tab;
type Control = _Control & { properties: { name: string } };
const isContainer = (element: any): element is Container => !!element.add;

//

function forEachChild(
	container: Container,
	callback: (control: Control) => void
) {
	forEach(container.children, (child) => {
		if (isContainer(child)) {
			forEachChild(child, callback);
		} else {
			callback(child as Control);
		}
	});
}
