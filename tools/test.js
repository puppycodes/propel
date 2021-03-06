#!/usr/bin/env node
const run = require("./run");

process.on("unhandledRejection", e => { throw e; });

(async() => {
  // Build the project.
  run.sh("node ./tools/build_binding.js");
  run.sh("node ./tools/build_website.js");
  await run.parcel("src/test_dl.ts", "build/website", true);
  await run.parcel("website/test_website.ts", "build/website", true);

  // Node.js tests
  run.tsnode("src/test_node.ts", {"PROPEL": "dl"});     // DL backend
  run.tsnode("src/test_node.ts", {"PROPEL": "tf"});     // TF backend
  run.tsnode("src/binding_test.ts", {"PROPEL": "tf"});  // TF-only test.

  // Web browser tests
  run.tsnode("tools/test_browser.ts");
})();
