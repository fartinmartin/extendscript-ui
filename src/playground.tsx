import { jsx } from "./jsx";

// example
const buttonElement: JSX.Element = {
	type: "button",
	instance: new Window("dialog").add("button"),
	props: {
		text: "1",
	},
};

const buttonElementFn: JSX.Element = jsx("button", {
	text: "1",
});

const a = "button" satisfies JSX.Tag;
// ^ this works
const b = {
	props: { active: true },
	children: [],
} satisfies JSX.IntrinsicElements["button"];
// ^ this also works
const t = <button></button>;
// ^ this doesnt: "JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.ts(7026)"
