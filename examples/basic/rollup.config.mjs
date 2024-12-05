import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "src/index.tsx",
	output: {
		file: "dist/index.jsx",
		format: "cjs",
	},
	plugins: [
		// https://rollupjs.org/troubleshooting/#warning-treating-module-as-external-dependency
		nodeResolve(),
		typescript(),
	],
	// https://rollupjs.org/troubleshooting/#error-this-is-undefined
	context: "this",
};
