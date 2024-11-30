import { ScriptUIElements, jsx } from "./jsx";

const a = { text: "hello" } satisfies ScriptUIElements["dialog"];
// ✅ <dialog> props object

const b = jsx("dialog", { text: "hello" });
// ✅ jsx(type: T, props: ScriptUIElements[T])

const c = <dialog text="hello"></dialog>;
//             ⚠️ ^ Type '{ text: string; }' is not assignable to type '{ props: Partial<InstanceProps<typeof Window> & { options: _AddControlPropertiesWindow; }>; children?: ScriptUIElement[] | undefined; }'.
//                   Property 'text' does not exist on type '{ props: Partial<InstanceProps<typeof Window> & { options: _AddControlPropertiesWindow; }>; children?: ScriptUIElement[] | undefined; }'.ts(2322)

const d = <dialog props={{ text: "hello" }}></dialog>;
//             😔 ^ it accepts a props object just fine, but we want to apply
//                  the props as attributes on the jsx element!
