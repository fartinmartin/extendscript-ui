import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
// import removeExports from "./rollup/rollup-plugin-remove-exports.js";
import pkg from "./package.json" assert { type: "json" };

export default [
	{
		input: "src/index.ts",
		context: "this",
		external: pkg.dependencies ? Object.keys(pkg.dependencies) : null,
		output: {
			file: pkg.main,
			format: "es",
		},
		plugins: [
			typescript({
				ignoreDeprecations: "5.0",
				declaration: true,
				declarationDir: "dist",
			}),
			copy({
				targets: [{ src: "src/types/jsx.d.ts", dest: "dist/types" }],
			}),
		],
	},
	{
		input: "src/index.ts",
		context: "this",
		output: {
			file: `dist/jsx/${pkg.name}-v${pkg.version}.jsx`,
			format: "cjs",
		},
		plugins: [
			nodeResolve(),
			typescript({
				ignoreDeprecations: "5.0",
				declaration: false,
				removeComments: true,
			}),
			// removeExports(),
		],
	},
];
