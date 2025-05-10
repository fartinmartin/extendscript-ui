import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/**
 * if you want to reference package.json, the easiest way is to
 * switch this config to .cjs and use `require()` instead of import:
 * const pkg = require("./package.json");
 * you'll want to replace `export default` with `module.exports = ` as well
 */

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
