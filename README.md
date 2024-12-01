# JSX templating for ScriptUI/ExtendScript

Have you ever wanted to compose ScriptUI like so:

<!-- prettier-ignore -->
```jsx
<dialog text="Neat!" properties={{ resizeable: true }}>
  <group orientation={"column"} alignChildren={"fill"}>
    <panel text="First Row" orientation={"row"} alignChildren={"top"} margins={20}>
      <button text="Click Me" size={[100, 200]} onClick={() => alert("Doink!")} />
      <button text="Or Me!" size={[100, 100]} onClick={() => alert("Ty!")} />
      <button text="Hello :)" size={[100, 50]} onClick={() => alert("Hi!")} />
    </panel>
    <panel text="Second Row" orientation={"row"} margins={20}>
      <button text="OK" properties={{ name: "ok" }} />
      <button text="Cancel" properties={{ name: "cancel" }} />
    </panel>
  </group>
</dialog>
```

Well, now you can! Plus TypeScript will guide you with auto completions! Although—keep in mind, just the basics work right now :)

## How?

Using [a custom `jsxFactory`](https://www.typescriptlang.org/tsconfig/#jsxFactory) with TypeScript ([more docs](https://www.typescriptlang.org/docs/handbook/jsx.html)) to wrap the [ScriptUI Resource Specifications](https://extendscript.docsforadobe.dev/user-interface-tools/resource-specifications.html) API/syntax.

This allows us to use JSX to generate a ScriptUI compliant string. Passing this string to `new Window(specString)` will build the UI, after that, we just need to wire it up!

I'm not sure I'm doing that wiring the best way right now, but we've got `onClick` events :)

## TODO

- [ ] Test/add more ScriptUI functionality beyond `onClick`...
- [ ] Figure out how to distribute this so users can just `import { jsx } from "extendscript-ui"`
- [ ] Overload `jsx` factory to allow functions as well as `tagName: ScriptUIElementTagName` (AKA let users compose their own UIs, see [StackOverflow](https://stackoverflow.com/a/68238924/8703073) and [TypeScript Playground](https://www.typescriptlang.org/play/?target=99#code/PQKgsAUABCUAICsDOAPKyWRsSw9QB4AnAUwDMTSA7AYxKgBsBLAIwF4AiAEQHkBZDlGAA+SJAAmJGgwCGpKFRkBbEkgAOMulABSAZQAaUAN5YoZ-ABUAFvVIAXAK5EqUOwE819APZkoXpzoGUABimnZeRG6mZu6eUACiDCQqVHZQbFAAEhZ8ADKJySSpANxi0GZCwFAAkqlETFRITDQFKXZ8MmpQAOZEMixIUDIMDK42UEh2MlTicuJZObmuMt2DDWP0FrpQvHyMrAB00VANdpRkmvS1dvWNza1FdoMkKGczg9e3TS1JbR1dRigAF8ysdLOMyF4Rl4AO4NbpDeQ0ByTLxKVweVQAGgUXjSGiIaR8UC2AHJBgBrKiwlx6QyKFTqS4ALmOsSudQa3weqX+6WMxwqUAA2gBpE4uCkkNzE7J5Hl2CwrAByyhI-wAusyBeUhXqRRTtZNbt0tUMqFFdXqQVabWzMSSVvypTLfHSDp8ufdfo8kKUIMdTudLlAAMJotReKiPHX6swACjURC8nkJTFUAH5tYDhS6jTd4Wbpm5gTiaFYmAxxNQs1BlV5JMKNQBKbX1yTHG12iBkBy0OxMKPoVAECxQF5vcSDd1KhEZGcrYTxqbdbUWHEyOwFlgOM5IbMG6X5k1Fi3AqAAHwUDhGOIO9-LlerRTbDZITdbgX0BwVkF7-cHFwMGXFZtXdcMlEjaNUg3Ld6h3PdtQABTkNUziIJACHZYkV2ES9r1vKB7wOR8q2oV9GxbCiSD-PsaAHIdgJXMCDAOWd8PAiMo0eWDt13VQD1zI8JgLKhTW1YtzyvKgbwYO8HwrMiXzrN8P1jComF8ZdMRwp02H0qBSX-ejANJZt1P1ewnBcFd403Pi9ygDMM2MIEy0U58qGbf0hRtIV2UdOcMU8XTuh8ioaCjSZxx9VJtTlfJYsVFU1X+YVZw1flxC8ZE2hI0hNxIBUQO6byyiFfAAEEkCaboXHs+D+P3Y4kjSJROn5Oy4NYJqnJcowgTKq1WqgJMU21F0cJ03x2rUcKzEhIgoETZMumJeMeBYBApDsA4XSQeNZvMmRBmLZtzJMAMrQqqp4lePp6KgAA3YYHAEwUKjGroMi+g5wl0UTunjIa4ygSLGjSF6GDe-lZuFL7MpO803HmvVwei4sACVyEoIotAyEgkqGU6LVRoVNOW7DfCxnHqDoeHVsy-SMlJPtJDIBoSHEMyLNByooGqoYoAuEYWE0CleOSNQ0nCCYSDSaYhm6hCSFZa640JwpUgOJB5cq5X+JWlMcSht6QbjIEYt13nQZpig6ffBH+VNkgyYqPz3fKip8E6TwZjBjzqGORblpG0j5mJcPqAuj6zAp7SQt8cP0gM8lAZ5y6+YqTW8oaaMiAsCcoAAagycO3f1cGBxk13Y+BOv48qog+jcA4mCQJuW-jcPzptjWkoOX2inEeNiJ7iu0ajau3onj39Rzx5B7UP3xFDDzu4882zDnqArOcGKtbsf1u2MhiXCQ+F40BFhocJYEDxvpw7GPeFgRjq095cAhxCYJ7hCMR+hIgQEGAD-P+kBuwvSWoTfkBAL5iSgIAuwnA3AyA4MIEB8DujCH9JAKBUAwGwMIUwcQnBIReHQZkQmDAvBfgAITGEJsA0Bv8cFlGyrlReLAGytyHjMNeT54xgObEAA))
- [ ] Likely other things I've not thought of...
