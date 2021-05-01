import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/core.ts", // our source file
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es", // the preferred format
    },
    {
      globals: { "json-logic-js": "jsonLogic" },
      file: pkg.browser,
      format: "iife",
      name: "OpenDecisionJSInterpreter", // the global which can be used in a browser
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require("typescript"),
    }),
    terser(), // minifies generated bundles
  ],
};
