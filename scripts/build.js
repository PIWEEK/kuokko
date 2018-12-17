const browserSync = require("browser-sync");

const rollup = require("rollup");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");

const BUNDLE_INPUT_OPTIONS = {
  input: "src/main.js",
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),

    commonjs({
      include: 'node_modules/**',
      sourceMap: false,
    })
  ]
};

const BUNDLE_OUTPUT_OPTIONS = {
  file: "out/bundle.js",
  format: "umd"
};


async function watch() {
  const bs = browserSync.create();

  bs.init({
    server: ".",
    open: false,
    watch: false,
    reloadDelay: 200,
  });

  bs.watch("*.css", function(event, file) {
    if (event === "change") {
      bs.reload("*.css");
    }
  });

  bs.watch("src/*.js", async function(event, file) {
    if (event !== "change") return;

    const bundle = await rollup.rollup(BUNDLE_INPUT_OPTIONS);
    await bundle.write(BUNDLE_OUTPUT_OPTIONS);

    bs.reload("out/bundle.js");
  });
}

async function build() {
  const bundle = await rollup.rollup(BUNDLE_INPUT_OPTIONS);
  await bundle.write(BUNDLE_OUTPUT_OPTIONS);
}

if (process.argv.length >= 3) {
  const cmd = process.argv[2];
  switch(cmd) {
  case "watch": return watch();
  case "build": return build();
  default:
    console.log("Available commands: watch, build");
    process.exit(-1);
  }
} else {
  console.log("Not enough arguments");
  process.exit(-1);
}

