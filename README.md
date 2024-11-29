# Adobe Library Starter

> 🚧 WIP

A basic setup for writing [ExtendScript](https://extendscript.docsforadobe.dev/introduction/extendscript-overview.html) libraries for Adobe apps in TypeScript. This project is heavily influenced by [`adobe-script-starter`](https://github.com/motiondeveloper/adobe-script-starter). However...

This project will build for two environments:

- a `.jsx` file for [`// #include` or `// @include`-ing](https://extendscript.docsforadobe.dev/extendscript-tools-features/preprocessor-directives.html) into your `.jsx` files
- an [`es` module](https://rollupjs.org/guide/en/#outputformat), ready to be published on `npm` and later consumed by a script project using a bundler

## Start

- `gh repo create <my-project> --public --template fartinmartin/adobe-lib-starter`
- `gh repo clone <me>/<my-project>`

> TODO: replace above with `npx create-adobe-lib` (or similar) that will run prompts to create your project

- `npm i` yadda yadda yadda

## Commands

- `build` compile and bundle scripts
- `dev` watch mode
- `release` create release on github with script attached

## Features

- Modern JavaScript syntax compiled to ES3 and bundled using [Rollup](https://github.com/rollup/rollup)

  > Note: syntax is transformed, but no pollyfills/shims are included, so you won't be able to use features such as `Array.map` and so on.

- Types from [Types-for-Adobe](https://github.com/aenhancers/Types-for-Adobe)

  The types for After Effects are included by default. You can add programs in `tsconfig.json`, by adding them to `compilerOptions.types`.

  > TODO: see [`npx create-adobe-lib` note](#start) above

- Debugging with the [ExtendScript Debugger](https://marketplace.visualstudio.com/items?itemName=Adobe.extendscript-debug)

  Pressing <kbd>F5</kbd> will run `dist/jsx/script.jsx` in your selected application. Edit `.vscode/launch.json` to specify a different script.

  > TODO: see [`npx create-adobe-lib` note](#start) above

- Testing locally

  > Note: <sup>(mostly for myself)</sup> you can test your work by running `npm link` in your library's directory. Then, in your script directory, run `npm link [path/to/your/lib]`.
