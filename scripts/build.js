const browserSync = require("browser-sync");
const browserify = require("browserify");

async function watch() {
  await build();

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

  bs.watch("src/js/**.js", async function(event, file) {
    if (event !== "change") return;

    try {
      await build();
      bs.reload("out/bundle.js");

    } catch (e) {
      console.log(e.stack);
    }
  });
}

const fs = require("fs");

async function build() {
  console.time("Compiling javascript");
  const babelOptions = {
    presets: [
      ["@babel/preset-env", {"targets": "last 2 Chrome versions"}]
    ]
  }

  return new Promise((resolve, reject) => {
    const b = browserify({
      debug: true,
      insertGlobals: true,
    });

    b.add("./src/js/main.js")
    b.transform("babelify", babelOptions);
    b.bundle((err, buf) => {

      console.timeEnd("Compiling javascript");

      if (err) {
        reject(err);
      } else {
        fs.writeFileSync("out/bundle.js", buf);
        resolve();
      }
    });
  });
}

(async function() {
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
})().catch((error) => {
  console.log(error.stack);
  process.exit(-2);
});


process.on("unhandledRejection", function(reason) {
  console.log("ERROR:", reason);
});
