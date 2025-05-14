import { forEach, includes, map, startsWith } from "extendscript-ponyfills";
import { InstanceProps, InstanceType } from "./types/utils";
import {
	mapProps,
	capitalize,
	pascal,
	uniqueId,
	UIError,
	stringify,
} from "./lib/utils";

type ScriptUIElement = {
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

type ScriptUIElementTagName = keyof ScriptUIElements;
type ScriptUIElements = {
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

const __EVENT_HANDLERS: Record<string, { type: string; fn: () => void }> = {};
let __CURRENT_EFFECTS: Effect[] | null = null;

function jsx<T extends ScriptUIElementTagName>(
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
				type: prop /* @ts-ignore */,
				fn: attributes[prop],
			}; /* @ts-ignore */
			delete attributes[prop];
		}
	}

	const props = mapProps(
		attributes,
		(prop, value) => `${prop}: ${stringify(value)}`,
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

function createWindow(node: JSX.Element | (() => JSX.Element)) {
	try {
		const { root, effects } = collect(node);

		if (!includes(["dialog", "palette"], root.tagName)) {
			throw new UIError(
				`Can only create window from '<dialog>' or '<palette>' received: <${root.tagName}>`,
			);
		}

		const window = new Window(root.spec as any);
		forEach(effects, (fn) => fn(window));

		for (const elementName in __EVENT_HANDLERS) {
			const cb = __EVENT_HANDLERS[elementName];
			/* @ts-ignore https://github.com/docsforadobe/Types-for-Adobe/pull/142 */
			const el = window.findElement(elementName);
			el[cb.type] = cb.fn;
		}

		return window;
	} catch (e) {
		if ((e as UIError).type === "UIError") {
			throw new Error("\n⚠️ [extendscript-ui]\n" + (e as UIError).description);
		} else {
			throw e;
		}
	}
}

//

function getIdentifier<T extends ScriptUIElementTagName>(
	tagName: T,
	attributes: ScriptUIElements[T],
) {
	let name = "";
	attributes = attributes ?? {};
	// let name = attributes?.properties?.name ?? uniqueId(pascal(tagName).toLowerCase()); // T extends Omit<ScriptUIElementTagName, "dialog" | "palette">

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

//

type Effect = (window: Window) => void;

function collect(input: JSX.Element | (() => JSX.Element)): {
	root: JSX.Element;
	effects: Effect[];
} {
	const effects: Effect[] = [];
	__CURRENT_EFFECTS = effects;
	const root = typeof input === "function" ? input() : input;
	__CURRENT_EFFECTS = null;
	return { root, effects };
}

function onWindow(fn: Effect) {
	if (!__CURRENT_EFFECTS) {
		throw new UIError("onWindow must be used inside collect()");
	} else {
		__CURRENT_EFFECTS.push(fn);
	}
}

export { drawSVG } from "./lib/svg";
export type { ScriptUIElement, ScriptUIElements, ScriptUIElementTagName };
export { jsx, createWindow, onWindow, uniqueId };
