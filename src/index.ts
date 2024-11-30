import { ui } from "./dialog";

try {
	$.writeln("hello");
	ui.instance?.show();
} catch (error) {
	alert("bork'd");
}
