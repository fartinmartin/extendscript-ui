const nodeResolve = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");
const pkg = require("./package.json");

module.exports = {
	input: "src/index.tsx",
	output: {
		file: `dist/basic-v${pkg.version}.jsx`,
		// using an `iife` will avoid polluting the global namespace
		// https://hyperbrew.co/blog/top-2-extendscript-mistakes-and-how-to-avoid-them/
		format: "iife",
	},
	plugins: [
		// https://rollupjs.org/troubleshooting/#warning-treating-module-as-external-dependency
		nodeResolve(),
		typescript(),
	],
	// https://rollupjs.org/troubleshooting/#error-this-is-undefined
	context: "this",
};
