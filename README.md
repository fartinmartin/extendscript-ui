# `extendscript-ui`

## JSX templating for ScriptUI/ExtendScript

Have you ever wanted to compose ScriptUI with JSX, like so:

<!-- prettier-ignore -->
```jsx
<dialog text="Neat!" properties={{ closeButton: true }}>
  <button text="Click me!" size={[100, 200]} onClick={() => alert("Doink!")} />
</dialog>
```

Well, now you can! Plus, TypeScript will guide you through each prop with auto completions!

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

Use `renderSpec` to render your template. This will create a `Window` and wires up your `onClick` events. It will then return an object with your `Window` as well as a cleanup fn:

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
- [ ] Overload `jsx` factory to allow functions as well (AKA let users compose their own UIs, not just `IntrinsicElement` tagNames, see [TypeScript docs](https://www.typescriptlang.org/docs/handbook/jsx.html), [StackOverflow](https://stackoverflow.com/a/68238924/8703073) and [TypeScript Playground](https://www.typescriptlang.org/play/?target=99#code/PQKgsAUABCUAICsDOAPKyWRsSw9QB4AnAUwDMTSA7AYxKgBsBLAIwF4AiAEQHkBZDlGAA+SJAAmJGgwCGpKFRkBbEkgAOMulABSAZQAaUAN5YoZ-ABUAFvVIAXAK5EqUOwE819APZkoXpzoGUABimnZeRG6mZu6eUACiDCQqVHZQbFAAEhZ8ADKJySSpANxi0GZCwFAAkqlETFRITDQFKXZ8MmpQAOZEMixIUDIMDK42UEh2MlTicuJZObmuMt2DDWP0FrpQvHyMrAB00VANdpRkmvS1dvWNza1FdoMkKGczg9e3TS1JbR1dRigAF8ysdLOMyF4Rl4AO4NbpDeQ0ByTLxKVweVQAGgUXjSGiIaR8UC2AHJBgBrKiwlx6QyKFTqS4ALmOsSudQa3weqX+6WMxwqUAA2gBpE4uCkkNzE7J5Hl2CwrAByyhI-wAusyBeUhXqRRTtZNbt0tUMqFFdXqQVabWzMSSVvypTLfHSDp8ufdfo8kKUIMdTudLlAAMJotReKiPHX6swACjURC8nkJTFUAH5tYDhS6jTd4Wbpm5gTiaFYmAxxNQs1BlV5JMKNQBKbX1yTHG12iBkBy0OxMKPoVAECxQF5vcSDd1KhEZGcrYTxqbdbUWHEyOwFlgOM5IbMG6X5k1Fi3AqAAHwUDhGOIO9-LlerRTbDZITdbgX0BwVkF7-cHFwMGXFZtXdcMlEjaNUg3Ld6h3PdtQABTkNUziIJACHZYkV2ES9r1vKB7wOR8q2oV9GxbCiSD-PsaAHIdgJXMCDAOWd8PAiMo0eWDt13VQD1zI8JgLKhTW1YtzyvKgbwYO8HwrMiXzrN8P1jComF8ZdMRwp02H0qBSX-ejANJZt1P1ewnBcFd403Pi9ygDMM2MIEy0U58qGbf0hRtIV2UdOcMU8XTuh8ioaCjSZxx9VJtTlfJYsVFU1X+YVZw1flxC8ZE2hI0hNxIBUQO6byyiFfAAEEkCaboXHs+D+P3Y4kjSJROn5Oy4NYJqnJcowgTKq1WqgJMU21F0cJ03x2rUcKzEhIgoETZMumJeMeBYBApDsA4XSQeNZvMmRBmLZtzJMAMrQqqp4lePp6KgAA3YYHAEwUKjGroMi+g5wl0UTunjIa4ygSLGjSF6GDe-lZuFL7MpO803HmvVwei4sACVyEoIotAyEgkqGU6LVRoVNOW7DfCxnHqDoeHVsy-SMlJPtJDIBoSHEMyLNByooGqoYoAuEYWE0CleOSNQ0nCCYSDSaYhm6hCSFZa640JwpUgOJB5cq5X+JWlMcSht6QbjIEYt13nQZpig6ffBH+VNkgyYqPz3fKip8E6TwZjBjzqGORblpG0j5mJcPqAuj6zAp7SQt8cP0gM8lAZ5y6+YqTW8oaaMiAsCcoAAagycO3f1cGBxk13Y+BOv48qog+jcA4mCQJuW-jcPzptjWkoOX2inEeNiJ7iu0ajau3onj39Rzx5B7UP3xFDDzu4882zDnqArOcGKtbsf1u2MhiXCQ+F40BFhocJYEDxvpw7GPeFgRjq095cAhxCYJ7hCMR+hIgQEGAD-P+kBuwvSWoTfkBAL5iSgIAuwnA3AyA4MIEB8DujCH9JAKBUAwGwMIUwcQnBIReHQZkQmDAvBfgAITGEJsA0Bv8cFlGyrlReLAGytyHjMNeT54xgObEAA))
- [ ] Likely other things I've not thought of...
