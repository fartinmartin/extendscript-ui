import { map } from "extendscript-ponyfills";

export class UIError extends Error {
	type: string;
	constructor(message: string) {
		super(message);
		this.type = "UIError";
	}
}

export function noop() {}

export function stringify(o: any) {
	if (typeof o === "string") return '"' + o + '"';
	if (typeof o !== "object" || o === null) return String(o);

	var s =
		o instanceof String || o instanceof Number || o instanceof Boolean
			? o.valueOf().toSource()
			: o.toSource();

	s = s
		.replace(/^\(+|\)+$/g, "")
		.replace(/'([^']*)'/g, '"$1"')
		.replace(/([{\[,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":');

	return s;
}

export function mapProps<T extends any>(
	obj: any,
	callback: (key: string, value: any) => T,
) {
	var result = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			result.push(callback(key, obj[key]));
		}
	}
	return result;
}

export function uuid(prefix = "id") {
	return prefix + "_" + Math.floor(Math.random() * 9999);
}

export function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function pascal(str: string) {
	const words = str.split("-");
	return map(words, (word) => {
		return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
	}).join("");
}

export function isSnakeCase(str: string): boolean {
	return /^[a-z]+(_[a-z]+)*$/.test(str);
}

export function uniqueId(prefix: string = "ui"): string {
	if (!isSnakeCase(prefix)) {
		throw new UIError(
			"uniqueId: prefix must be snake_case, received: " + prefix,
		);
	}

	const chars = "0123456789abcdefghijklmnopqrstuvwxyz";

	let n = Math.floor(Math.random() * 1e12);
	let id = "";

	while (n > 0) {
		id = chars[n % 36] + id;
		n = Math.floor(n / 36);
	}

	return `${prefix}_${id}`;
}
