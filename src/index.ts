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

type Attributes<
	T extends new (...args: any[]) => any,
	K = _AddControlProperties,
> = Partial<InstanceProps<T> & { properties: K } & Methods<InstanceType<T>>>;

export type ScriptUIElements = {
	// windows
	dialog: Attributes<typeof Window, _AddControlPropertiesWindow>;
	palette: Attributes<typeof Window, _AddControlPropertiesWindow>;
	// containers
	panel: Attributes<typeof Panel, _AddControlPropertiesPanel>;
	group: Attributes<typeof Group>;
	"tabbed-panel": Attributes<typeof TabbedPanel>;
	tab: Attributes<typeof Tab>;
	// controls
	button: Attributes<typeof Button>;
	checkbox: Attributes<typeof Checkbox>;
	image: Attributes<typeof Image>;
	"progress-bar": Attributes<typeof Progressbar>;
	"radio-button": Attributes<typeof RadioButton>;
	scrollbar: Attributes<typeof Scrollbar>;
	slider: Attributes<typeof Slider>;
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
	// "list-item": Attributes<typeof ListItem>;
	//
	"flash-player": Attributes<typeof FlashPlayer> & {
		movieToLoad?: string | File;
	};
};

export type ScriptUIElementTagName = keyof ScriptUIElements;

const __EVENT_HANDLERS: Record<string, { type: string; fn: () => void }> = {};

export function jsx<T extends ScriptUIElementTagName>(
	tagName: T | JSX.Component,
	attributes: ScriptUIElements[T],
	...children: ScriptUIElement[]
): JSX.Element {
	if (typeof tagName === "function") {
		const el = tagName(attributes ?? {}, children);
		const id = uniqueId(pascal(tagName.name).toLowerCase());
		return { ...el, spec: "", id };
	}

	const id = getIdentifier(tagName, attributes);

	for (const prop in attributes) {
		if (startsWith(prop, "on")) {
			__EVENT_HANDLERS[id] = {
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

export function createWindow(scriptUI: JSX.Element | (() => JSX.Element)) {
	const node = typeof scriptUI === "function" ? scriptUI() : scriptUI;

	if (!includes(["dialog", "palette"], node.tagName)) {
		throw new Error(
			`Can only create window from '<dialog>' or '<palette>' received: <${node.tagName}>`,
		);
	}

	const { spec, effects } = collect(() => node);
	const window = new Window(spec as any);
	forEach(effects, (fn) => fn(window));

	for (const elementName in __EVENT_HANDLERS) {
		const cb = __EVENT_HANDLERS[elementName];
		/* @ts-ignore https://extendscript.docsforadobe.dev/user-interface-tools/scriptui-programming-model/#accessing-child-elements */
		const el = window.findElement(elementName);
		el[cb.type] = cb.fn;
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
		name = uniqueId(pascal(tagName).toLowerCase());
	}

	attributes.properties = {
		...(attributes.properties ?? {}),
		name: name,
	};

	return name;
}

export function uniqueId(prefix: string = "ui"): string {
	return `${prefix}_${Math.random().toString(36).slice(2, 12)}`;
}

//

type Effect = (refs: Record<string, any>) => void;
let __CURRENT_EFFECTS: Effect[] | null = null;

function collect(fn: () => JSX.Element): { spec: string; effects: Effect[] } {
	const effects: Effect[] = [];
	__CURRENT_EFFECTS = effects;
	const { spec } = fn();
	__CURRENT_EFFECTS = null;
	return { spec, effects };
}

export function onWindow(fn: Effect) {
	if (!__CURRENT_EFFECTS) {
		throw new Error("onWindow must be used inside collect()");
	} else {
		__CURRENT_EFFECTS.push(fn);
	}
}
