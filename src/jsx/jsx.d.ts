import {
	ScriptUIElement,
	ScriptUIElementTagName,
	ScriptUIElements,
} from "./elements/scriptui";
import { SVGElements, SVGElementTagName } from "./elements/svg";

declare global {
	namespace JSX {
		type Element = string | (ScriptUIElement & { spec: string; id: string });

		interface IntrinsicElements extends IntrinsicElementMap {}

		type IntrinsicElementMap = {
			[K in ScriptUIElementTagName]: ScriptUIElements[K] & {
				children?: ScriptUIElement[];
			};
		} & {
			[K in SVGElementTagName]: SVGElements[K];
		};

		type Tag = keyof JSX.IntrinsicElements;

		interface Component {
			(
				attributes?: { [key: string]: any },
				children?: ScriptUIElement[],
			): ScriptUIElement;
		}
	}
}
