import { ui } from "./dialog";

try {
	$.write("hello");
	ui().instance?.show();
} catch (error) {
	alert(`bork'd\n${(error as Error).toSource()}`);
}
