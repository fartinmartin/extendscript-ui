# `extendscript-ui`

## JSX templating for ScriptUI/ExtendScript

Have you ever wanted to compose [ScriptUI](https://extendscript.docsforadobe.dev/user-interface-tools/scriptui-programming-model.html) with JSX-like syntax, like so:

<!-- prettier-ignore -->
```jsx
<dialog text="Neat!" properties={{ closeButton: true }}>
  <button text="Click me!" size={[100, 200]} onClick={() => alert("Doink!")} />
</dialog>
```

Well, now you can! Plus, TypeScript will guide you through each prop with auto completions!

You can even create functional components:

<!-- prettier-ignore -->
```jsx
const Header = ({ text }: { text: string }) => (
  <group orientation={"row"} alignChildren={"fill"}>
    <static-text text={text}></static-text>
  </group>
);

const ui = (
  <dialog text="Could it be?!" properties={{ resizeable: true }}>
    <Header text="Neat!" />
  </dialog>
);
```

## Try it

> [!TIP]
> For a super basic example, check out [`/examples/basic`](/examples/basic)!

### Prerequisites

You'll need TypeScript and a bundler for your code. Here are some ExtendScript starters with TypeScript support to check out:

- [`@motiondeveloper/adobe-script-starter`](https://github.com/motiondeveloper/adobe-script-starter)
- [`@fartinmartin/adobe-lib-starter`](https://github.com/fartinmartin/adobe-lib-starter)
- [`@Klustre/extender`](https://github.com/Klustre/extender) (see [note on TypeScript](https://github.com/Klustre/extender?tab=readme-ov-file#typescript))

### Installation

```bash
npm i extendscript-ui
```

### Configuration

Update your `tsconfig.json`:

<!-- prettier-ignore -->
```jsonc
{
  "compilerOptions": {
    // ...your other config options, then:
    // tell TypeScript how to find extendscript-ui's jsx.d.ts declarations:
    "typeRoots": ["./node_modules/extendscript-ui/dist"],
    "types": ["types/jsx.d.ts"],
    // tell TypeScript how to transform your JSX code and the name of the jsxFactory fn to use when doing so:
    "jsx": "react",
    "jsxFactory": "jsx" // this is the fn that extendscript-ui exports!
  }
  // ...any other options
}
```

### Usage

Be sure to use `.tsx` files for JSX syntax highlighting. Import `jsx` to satisfy TypeScript and for code completion:

<!-- prettier-ignore -->
```jsx
// index.tsx
import { jsx } from "extendscript-ui";

export const ui = (
  <dialog text="Neat!" properties={{ closeButton: true }}>
    <button text="Click me!" onClick={() => alert("Doink!")} />
  </dialog>
);
```

You can create custom components too:

```jsx
const Header = ({ text }: { text: string }) => (
  <group orientation={"row"} alignChildren={"fill"}>
    <static-text text={text}></static-text>
  </group>
);

// later

const ui = (
  <dialog text="Neat!" properties={{ resizeable: true }}>
    <Header text="Could it be?!" />
    // other stuff...
  </dialog>
);
```

Use `renderSpec` to render your template. This will create a `Window` and wire up your `onClick` events. It will then return an object with your `Window` as well as a cleanup fn:

<!-- prettier-ignore -->
```jsx
import { renderSpec } from "extendscript-ui";

const { window, destroy } = renderSpec(ui);
window.show();
```

> [!WARNING]
> The `renderSpec` API might evolve, but it's functional for now...

## How?

`extendscript-ui` uses a [custom `jsxFactory`](https://www.typescriptlang.org/tsconfig/#jsxFactory) to transform JSX into a [ScriptUI Resource Specifications](https://extendscript.docsforadobe.dev/user-interface-tools/resource-specifications.html)-compliant string. This string is passed to `new Window(specString)` to build the UI. Once the UI is built, `renderSpec` adds any event handlers to the created UI elements.

## TODO

- [ ] Test/add more ScriptUI functionality beyond `onClick`...
- [ ] More type safety:
    - [ ] `renderSpec` should only accept specString with a root of type `Window`
    - [ ] remove `type` attribute since it's defined by tag (generally, make sure all attrs are cleaned up)
- [ ] Figure out `TreeView | ListBox | DropDownList` rendering
- [ ] Default text nodes to `text` attr and/or `<static-text/>`? e.g `<button>hello!</button> === <button text="hello!"/>`
- [ ] ProgressBar helpers, etc?
- [ ] Look up how to auto import `jsx`, though this may just be documentation/guidance rather than a feature as it will probably depend on user's build setup?
- [ ] Likely other things I've not thought of...
