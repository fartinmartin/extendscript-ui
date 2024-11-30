import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
// import removeExports from "./rollup/rollup-plugin-remove-exports.js";
import pkg from "./package.json" assert { type: "json" };

export default [
	{
		input: "src/index.ts",
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
		],
	},
	{
		input: "src/index.ts",
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
