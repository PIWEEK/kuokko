var bs = require("browser-sync").create();

bs.init({
  server: ".",
  open: false,
  watch: true,
  files: ["src/**", "index.html"],
  reloadDelay: 200,
});

// Provide a callback to capture ALL events to CSS
// files - then filter for 'change' and reload all
// css files on the page.
bs.watch("*.css", function(event, file) {
  if (event === "change") {
    bs.reload("*.css");
  }
});
