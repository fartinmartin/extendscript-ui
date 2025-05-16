const typescript = require("@rollup/plugin-typescript");
const copy = require("rollup-plugin-copy");
const pkg = require("./package.json");

module.exports = [
	{
		input: "src/index.ts",
		context: "this",
		external: pkg.dependencies ? Object.keys(pkg.dependencies) : null,
		output: {
			file: pkg.main,
			format: "es",
		},
		plugins: [
			typescript(),
			copy({
				targets: [
					{
						src: "src/jsx/jsx.d.ts",
						dest: "dist/jsx/",
						rename: "extendscript-ui.d.ts",
					},
				],
			}),
		],
	},
];
