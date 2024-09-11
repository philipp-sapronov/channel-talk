const { defineConfig } = require("rollup");
const resolve = require("@rollup/plugin-node-resolve");
const babel = require("@rollup/plugin-babel");
const typescript = require("rollup-plugin-typescript2");
const { terser } = require("rollup-plugin-terser");
const commonjs = require("@rollup/plugin-commonjs");

const extensions = [".ts"];

module.exports = defineConfig([
  {
    input: "src/index.ts",
    output: { dir: "dist", format: "cjs" },
    external: ["react"],
    plugins: [
      commonjs(),
      resolve({
        extensions,
      }),
      typescript({
        tsconfigOverride: {
          exclude: ["**/__tests__", "**/*.test.ts"],
        },
      }),
      babel({
        include: "src/**/*",
        exclude: "**/node_modules/**",
        plugins: ["@babel/plugin-transform-runtime"],
        extensions,
        babelHelpers: "runtime",
      }),
      // replace({
      //   "process.env.NODE_ENV": JSON.stringify(env),
      //   preventAssignment: true,
      // }),
      commonjs(),
      terser(),
    ],
  },
]);
