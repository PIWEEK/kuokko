var bs = require("browser-sync").create();

bs.init({
  server: ".",
  open: false,
  watch: true,
  files: ["src/*.js", "index.html"],
  reloadDelay: 1000,
});
