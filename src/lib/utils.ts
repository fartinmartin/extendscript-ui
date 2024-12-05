import { map } from "extendscript-ponyfills";

export function noop() {}

export function mapProps<T extends any>(
	obj: any,
	callback: (key: string, value: any) => T
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
