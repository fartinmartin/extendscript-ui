import { ScriptUIElements, jsx } from "./jsx";

const a = { text: "hello" } satisfies ScriptUIElements["dialog"];
// ✅ <dialog> props object

const b = jsx("dialog", { text: "hello" });
// ✅ jsx(type: T, props: ScriptUIElements[T])

const c = <dialog text="hello"></dialog>;
// ✅ props as attributes
