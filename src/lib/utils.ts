import { map } from "extendscript-ponyfills";

export class UIError extends Error {
	type: string;
	constructor(message: string) {
		super(message);
		this.type = "UIError";
	}
}

export function noop() {}

// TODO: add to extendscript-ponyfills
export function stringify(o: any): string | undefined {
	if (o && typeof o.toJSON === "function") {
		o = o.toJSON();
	}

	if (o === null) return "null";
	if (typeof o === "string") return '"' + o + '"';
	if (typeof o === "number" || typeof o === "boolean") return String(o);
	if (typeof o === "function" || typeof o === "undefined") return undefined;

	if (o instanceof Array) {
		var out = [];
		for (var i = 0; i < o.length; i++) {
			var v = stringify(o[i]);
			out.push(v === undefined ? "null" : v);
		}
		return "[" + out.join(",") + "]";
	}

	var out = [];
	for (var k in o) {
		if (Object.prototype.hasOwnProperty.call(o, k)) {
			var val = o[k];
			if (typeof val !== "function" && typeof val !== "undefined") {
				var v = stringify(val);
				if (v !== undefined) out.push('"' + k + '":' + v);
			}
		}
	}

	return "{" + out.join(",") + "}";
}

// TODO: add to extendscript-ponyfills
export function entries<T extends Record<string, any>>(
	o: T,
): [keyof T, T[keyof T]][] {
	const result: [keyof T, T[keyof T]][] = [];
	for (const key in o) {
		if (o.hasOwnProperty(key)) {
			result.push([key as keyof T, o[key]]);
		}
	}
	return result;
}

export function mapProps<T extends any>(
	obj: any,
	callback: (key: string, value: any) => T,
) {
	const result = [];
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			result.push(callback(key, obj[key]));
		}
	}
	return result;
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
