# `@extendscript-ui/example-basic`

![screenshot](/basic.png)

This example renders a basic `Dialog` with several `Button`s grouped within two `Panel`s.

The project uses [Rollup](https://rollupjs.org/) with as few dependencies and config as I could manage! It builds a single `dist/index.jsx` file that you can run in After Effects via `File > Scripts > Run Script File...`

Below is an outline of why each dependency/config is included:

Rollup + TypeScript requires:

- `@rollup/plugin-typescript`
- `rollup`
- `tslib`
- `typescript`

In order to include `extendscript-ui` code in the output `.jsx` you need to add `@rollup/plugin-node-resolve`, see [Rollup docs](https://rollupjs.org/troubleshooting/#warning-treating-module-as-external-dependency).

TypeScript should be pinned to version `5.4.5`, the latest version with `target: "es3"` support, see https://github.com/microsoft/TypeScript/issues/51909. For more information on ExtendScript, check out HyperBrew's article on [Building Adobe Scripts](https://hyperbrew.co/blog/building-adobe-scripts/)!

Speaking of TypeScript, to get full type support for things like After Effect's `alert` you'll need to add `types-for-adobe`, as well as update your `tsconfig.json`. Here's a complete rundown of the `tsconfig.json`:

```jsonc
{
	"compilerOptions": {
		// output to es3, and ignore TypeScript's warning that es3 is old
		"target": "es3",
		"ignoreDeprecations": "5.0",
		// follow node.js conventions when locating imports
		"moduleResolution": "node",
		// make sure TypeScript yells at you for everything :)
		"strict": true,
		// don't include default DOM types etc as ExtendScript does not have those objects!
		"noLib": true,
		// since we aren't including any types by default (noLib: true), we should
		// tell TypeScript what types we DO want to include. first, defining
		// what folders to look in...
		"typeRoots": [
			"./node_modules/types-for-adobe/",
			"./node_modules/extendscript-ui/dist"
		],
		// ...and then what sub-folders/files to look for within those typeRoots folders
		"types": ["AfterEffects/23.0", "types/jsx.d.ts"],
		// tell TypeScript how to transform your JSX code (react)...
		"jsx": "react",
		// and the name of the jsxFactory fn to use when doing so (`jsx`, as exported by extendscript-ui)
		"jsxFactory": "jsx"
	},
	// tell TypeScript to ignore files in our /dist folder—otherwise it may get confused
	"exclude": ["dist"]
}
```
