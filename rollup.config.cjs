const nodeResolve = require("@rollup/plugin-node-resolve");
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
