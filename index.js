import http from "node:http";

const fetchModuleName = process.env.FETCH_MODULE_NAME;

/** @type {{ fetch: typeof fetch }} */
const fetchModule = await (() => {
  switch (fetchModuleName) {
    case "native":
      return globalThis;
    case "undici":
    case "@whatwg-node/fetch":
      return import(fetchModuleName);
    default:
      throw new Error(`unrecognized fetch module "${fetchModuleName}"`);
  }
})();

console.log(`Node ${process.version} with ${fetchModuleName}`);

http
  .createServer((req, res) => {
    if (req.url.endsWith("gc")) {
      global.gc();
      res.writeHead(200).end();
      return;
    }

    fetchModule
      .fetch("http://httpbin:8080/status/200", {
        headers: {
          "user-agent": `node@${process.version}`,
        },
      })
      .finally(() => {
        res.writeHead(200).end();
      });
  })
  .listen(3000, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("Server is running...");
  });
