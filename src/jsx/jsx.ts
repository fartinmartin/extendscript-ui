/// <reference path="./jsx.d.ts" />

import {
	forEach,
	includes,
	isArray,
	map,
	reduce,
	startsWith,
} from "extendscript-ponyfills";
import { SVGElements, SVGElementTagName, SVG_TAGS } from "./elements/svg";
import {
	ScriptUIElement,
	ScriptUIElements,
	ScriptUIElementTagName,
} from "./elements/scriptui";
import {
	capitalize,
	entries,
	mapProps,
	pascal,
	stringify,
	UIError,
	uniqueId,
} from "../lib/utils";

// TODO: put these on $[`extendscript-ui`]?
const __EVENT_HANDLERS: Record<
	string,
	Partial<Record<string, () => void>>
> = {};
let __CURRENT_EFFECTS: Effect[] | null = null;

export function jsx<K extends SVGElementTagName>(
	tagName: K,
	attributes: SVGElements[K],
	...children: string[]
): string;
export function jsx<T extends ScriptUIElementTagName>(
	tagName: T | JSX.Component,
	attributes: ScriptUIElements[T],
	...children: ScriptUIElement[]
): JSX.Element;
export function jsx(
	tagName: any,
	attributes: any,
	...children: any[]
): string | JSX.Element {
	const flattenChildren = (items: any[]): any[] =>
		reduce(
			items,
			(acc, item) => {
				if (isArray(item)) return acc.concat(flattenChildren(item));
				return acc.concat(item);
			},
			[],
		);

	children = flattenChildren(children);

	if (typeof tagName === "string" && includes(SVG_TAGS, tagName)) {
		const pairs = entries(attributes || {});
		const attrs = map(pairs, ([k, v]) => `${String(k)}="${v}"`).join(" ");
		const body = children.join("");
		return `<${tagName}${attrs ? " " + attrs : ""}>${body}</${tagName}>`;
	}

	if (typeof tagName === "function") {
		const el = tagName(attributes ?? {}, children);
		const id = uniqueId(pascal(tagName.name).toLowerCase());
		return { ...el, spec: "", id };
	}

	const id = getIdentifier(tagName, attributes);

	for (const prop in attributes) {
		if (startsWith(prop, "on")) {
			__EVENT_HANDLERS[id] ??= {};
			__EVENT_HANDLERS[id][prop] = attributes[prop] as () => void;
			delete attributes[prop];
		}
	}

	const props = mapProps(
		attributes,
		(prop, value) => `${prop}: ${stringify(value)}`,
	).join(",");

	const nodes = map(children, (child) => {
		const childNodes = child.children ?? [];
		const name = `${getIdentifier(child.tagName, child.attributes)}: `;
		const el = jsx(child.tagName, child.attributes, ...childNodes);
		/* @ts-ignore we can assume SVG components that return strings are already handled above */
		return name + el.spec;
	}).join(",");

	let spec = "";

	switch (tagName) {
		case "dialog":
		case "palette":
			spec = `${tagName} { ${props}, ${nodes} }`;
			break;
		case "panel":
		case "group":
			// maybe:
			// case "tabbed-panel":
			// case "tab":
			// case "tree-view"
			// case "list-box"
			// case "dropdown-list"
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

export function createWindow(node: JSX.Element | (() => JSX.Element)) {
	try {
		const { root, effects } = collect(node);

		if (
			typeof root === "string" ||
			!includes(["dialog", "palette"], root.tagName)
		) {
			const received =
				typeof root === "string" ? `string: ${root}` : `: <${root.tagName}>`;
			throw new UIError(
				`Can only create window from '<dialog>' or '<palette>' received ${received}`,
			);
		}

		const window = new Window(root.spec as any);
		forEach(effects, (fn) => fn(window));

		for (const elementName in __EVENT_HANDLERS) {
			/* @ts-ignore https://github.com/docsforadobe/Types-for-Adobe/pull/142 */
			const el = window.findElement(elementName);
			if (!el) continue;
			const handlers = __EVENT_HANDLERS[elementName];
			for (const eventType in handlers) {
				el[eventType] = handlers[eventType];
			}
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

export function onWindow(fn: Effect) {
	if (!__CURRENT_EFFECTS) {
		throw new UIError("onWindow must be used inside collect()");
	} else {
		__CURRENT_EFFECTS.push(fn);
	}
}
