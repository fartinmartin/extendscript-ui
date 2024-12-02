import { ScriptUIElement, ScriptUIElementTagName, ScriptUIElements } from ".";

declare global {
	namespace JSX {
		type Element = ScriptUIElement & { spec: string; id: string };

		interface IntrinsicElements extends IntrinsicElementMap {}

		type IntrinsicElementMap = {
			[K in ScriptUIElementTagName]: ScriptUIElements[K] & {
				children?: ScriptUIElement[];
			};
		};

		type Tag = keyof JSX.IntrinsicElements;

		interface Component {
			(
				attributes?: { [key: string]: any },
				children?: ScriptUIElement[]
			): ScriptUIElement;
		}
	}
}
