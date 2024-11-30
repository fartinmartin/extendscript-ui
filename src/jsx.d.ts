import {
	ScriptUIElement,
	ScriptUIElementTagName,
	ScriptUIElements,
} from "./jsx";

declare global {
	namespace JSX {
		type Element = ScriptUIElement;

		interface IntrinsicElements extends IntrinsicElementMap {}

		type IntrinsicElementMap = {
			[K in ScriptUIElementTagName]: ScriptUIElements[K] & {
				children?: ScriptUIElement[];
			};
		};

		type Tag = keyof JSX.IntrinsicElements;

		interface Component {
			(
				props?: { [key: string]: any },
				children?: ScriptUIElement[]
			): ScriptUIElement;
		}
	}
}
