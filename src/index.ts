import { forEach, includes, map, startsWith } from "extendscript-ponyfills";
import { InstanceProps, InstanceType } from "./types/utils";
import { mapProps, capitalize, pascal } from "./lib/utils";

export type ScriptUIElement = {
	tagName: ScriptUIElementTagName;
	attributes: ScriptUIElements[ScriptUIElementTagName];
	children?: ScriptUIElement[];
};

type Methods<T> = {
	[K in keyof T as K extends `on${string}` ? K : never]: T[K];
};

type Attributes<T extends new (...args: any[]) => any, K> = Partial<
	InstanceProps<T> & { properties: K } & Methods<InstanceType<T>>
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
	button: Attributes<typeof Button, _AddControlProperties>;
	checkbox: Attributes<typeof Checkbox, _AddControlProperties>;
	image: Attributes<typeof Image, _AddControlProperties>;
	"progress-bar": Attributes<typeof Progressbar, _AddControlProperties>;
	"radio-button": Attributes<typeof RadioButton, _AddControlProperties>;
	scrollbar: Attributes<typeof Scrollbar, _AddControlProperties>;
	slider: Attributes<typeof Slider, _AddControlProperties>;
	"edit-text": Attributes<typeof EditText, _AddControlPropertiesEditText>;
	"icon-button": Attributes<typeof IconButton, _AddControlPropertiesIconButton>;
	"static-text": Attributes<typeof StaticText, _AddControlPropertiesStaticText>;
	//
	// TODO: figure out how to render TreeView | ListBox | DropDownList
	// "tree-view": Attributes<typeof TreeView, _AddControlPropertiesTreeView>;
	// "list-box": Attributes<typeof ListBox, _AddControlPropertiesListBox>;
	// "dropdown-list": Attributes<
	// 	typeof DropDownList,
	// 	_AddControlPropertiesDropDownList
	// >;
	// "list-item": Attributes<typeof ListItem, _AddControlProperties>;
	//
	"flash-player": Attributes<typeof FlashPlayer, _AddControlProperties> & {
		movieToLoad?: string | File;
	};
};

export type ScriptUIElementTagName = keyof ScriptUIElements;

const eventHandlers: Record<string, { type: string; fn: () => void }> = {};
let idCounter = 0;

export function jsx<T extends ScriptUIElementTagName>(
	tagName: T | JSX.Component,
	attributes: ScriptUIElements[T],
	...children: ScriptUIElement[]
): JSX.Element {
	if (typeof tagName === "function") {
		const el = tagName(attributes ?? {}, children);
		// TODO: attributes?.id ?? `${tagName.name}_${idCounter++}`
		return { ...el, spec: "", id: `${tagName.name}_${idCounter++}` };
	}

	const id = getIdentifier(tagName, attributes);

	for (const prop in attributes) {
		if (startsWith(prop, "on")) {
			eventHandlers[id] = {
				type: prop,
				/* @ts-ignore */
				fn: attributes[prop] as unknown as () => void,
			};
		}
	}

	const props = mapProps(
		attributes,
		(prop, value) => `${prop}: ${JSON.stringify(value)}`,
	).join(",");

	const nodes = map(children, (child) => {
		const childNodes = child.children ?? [];
		let name = `${getIdentifier(child.tagName, child.attributes)}: `;
		return name + jsx(child.tagName, child.attributes, ...childNodes).spec;
	}).join(",");

	let spec = "";

	switch (tagName) {
		case "dialog":
		case "palette":
			spec = `${tagName} { ${props}, ${nodes} }`;
			break;
		case "panel":
		case "group":
			// case "tabbed-panel":
			// case "tab":
			// (maybe also) case "tree-view"
			// (maybe also) case "list-box"
			// (maybe also) case "dropdown-list"
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

export function createWindow(scriptUI: JSX.Element) {
	if (!includes(["dialog", "palette"], scriptUI.tagName)) {
		throw new Error(
			`Can only create window from '<dialog>' or '<palette>' received: <${scriptUI.tagName}>`,
		);
	}

	const window = new Window(scriptUI.spec as any);

	window.onResize = window.onResizing = function () {
		this.layout.resize();
	};

	for (const elementName in eventHandlers) {
		const cb = eventHandlers[elementName];
		/* @ts-ignore https://extendscript.docsforadobe.dev/user-interface-tools/scriptui-programming-model/#accessing-child-elements */
		const el = window.findElement(elementName);
		el[cb.type] = cb.fn;
		// TODO: pass el to cb? e.g: function () { return cb.fn(el); };
	}

	return window;
}

//

function getIdentifier<T extends ScriptUIElementTagName>(
	tagName: T,
	attributes: ScriptUIElements[T],
) {
	let name = "";
	attributes = attributes ?? {};

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
