import Server from "./server";

// Start server
(async () => {
  await Server.GetInstance(); // don't omit await in ESM/TLA-capable builds
})();
