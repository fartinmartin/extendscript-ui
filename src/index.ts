import { forEach, map } from "extendscript-ponyfills";
import { InstanceProps } from "./types/utils";
import { mapProps, capitalize, pascal } from "./lib/utils";

export type ScriptUIElement = {
	tagName: ScriptUIElementTagName;
	attributes: ScriptUIElements[ScriptUIElementTagName];
	children?: ScriptUIElement[];
};

type Attributes<T extends new (...args: any[]) => any, K> = Partial<
	InstanceProps<T> & { properties: K }
>;

export type ScriptUIElements = {
	// windows
	dialog: Attributes<typeof Window, _AddControlPropertiesWindow>;
	palette: Attributes<typeof Window, _AddControlPropertiesWindow>;
	// containers
	panel: Attributes<typeof Panel, _AddControlPropertiesPanel>;
	group: Attributes<typeof Group, _AddControlProperties>;
	"tabbed-panel": Attributes<typeof TabbedPanel, _AddControlProperties>;
	tab: Attributes<typeof Tab, _AddControlProperties>;
	// controls
	button: Attributes<typeof Button, _AddControlProperties> & {
		onClick?: Button["onClick"];
	};
	checkbox: Attributes<typeof Checkbox, _AddControlProperties>;
	image: Attributes<typeof Image, _AddControlProperties>;
	"progress-bar": Attributes<typeof Progressbar, _AddControlProperties>;
	"radio-button": Attributes<typeof RadioButton, _AddControlProperties>;
	scrollbar: Attributes<typeof Scrollbar, _AddControlProperties>;
	slider: Attributes<typeof Slider, _AddControlProperties>;
	//
	"edit-text": Attributes<typeof EditText, _AddControlPropertiesEditText>;
	"icon-button": Attributes<typeof IconButton, _AddControlPropertiesIconButton>;
	"static-text": Attributes<typeof StaticText, _AddControlPropertiesStaticText>;
	"flash-player": Attributes<typeof FlashPlayer, _AddControlProperties> & {
		movieToLoad?: string | File;
	};
	// TODO: figure out how to render TreeView | ListBox | DropDownList
	// "tree-view": Attributes<typeof TreeView, _AddControlPropertiesTreeView>;
	// "list-box": Attributes<typeof ListBox, _AddControlPropertiesListBox>;
	// "dropdown-list": Attributes<
	// 	typeof DropDownList,
	// 	_AddControlPropertiesDropDownList
	// >;
	// "list-item": Attributes<typeof ListItem, _AddControlProperties>;
};

export type ScriptUIElementTagName = keyof ScriptUIElements;

const eventHandlers: Record<string, () => void> = {};
let idCounter = 0;

// export function jsx<T extends ScriptUIElementTagName>(
// 	tagName: T,
// 	attributes: ScriptUIElements[T],
// 	...children: ScriptUIElement[]
// ): JSX.Element;
// export function jsx(
// 	tagName: JSX.Component,
// 	attributes: Parameters<typeof tagName>[0] | null,
// 	...children: ScriptUIElement[]
// ): JSX.Element;
// export function jsx(
// 	tagName: ScriptUIElementTagName | JSX.Component,
// 	attributes: Parameters<typeof tagName>[0] | null,
// 	...children: ScriptUIElement[]
// ): JSX.Element {
// 	// TODO...
// }

export function jsx<T extends ScriptUIElementTagName>(
	tagName: T | JSX.Component,
	attributes: ScriptUIElements[T],
	...children: ScriptUIElement[]
): JSX.Element {
	if (typeof tagName === "function") {
		const el = tagName(attributes ?? {}, children);
		return { ...el, spec: "", id: "" };
	}

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
			spec = `${pascal(tagName)} { ${props} }`;
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
	const window = new Window(scriptUI.spec as any);

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
		name = `${pascal(tagName).toLowerCase()}_${idCounter++}`;
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
