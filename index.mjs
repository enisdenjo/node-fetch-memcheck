import http from "node:http";
import wtfnode from "wtfnode";

const fetchModuleName = process.env.FETCH_MODULE_NAME;
const consumeBody = ["1", "t", "true"].includes(process.env.CONSUME_BODY);

/** @type {{ fetch: typeof fetch }} */
const fetchModule = await (async () => {
  switch (fetchModuleName) {
    case "native":
      return globalThis;
    case "undici":
    case "@whatwg-node/fetch":
      return import(fetchModuleName);
    case "node-fetch":
      return { fetch: (await import(fetchModuleName)).default };
    default:
      throw new Error(`unrecognized fetch module "${fetchModuleName}"`);
  }
})();

console.log(`Node ${process.version} with ${fetchModuleName}`);

http
  .createServer(async (req, res) => {
    let body = "";
    try {
      if (req.url.endsWith("gc")) {
        for (let i = 0; i < 10; i++) {
          global.gc();
          await new Promise((resolve) => process.nextTick(resolve));
        }
      } else if (req.url.endsWith("wtfnode")) {
        let info = "";
        let warn = "";
        let err = "";

        wtfnode.setLogger("info", (msg, ...params) => {
          info += msg + "" + params.map(String).join(", ");
          info += "\n";
        });
        wtfnode.setLogger("warn", (msg, ...params) => {
          warn += msg + "" + params.map(String).join(", ");
          warn += "\n";
        });
        wtfnode.setLogger("error", (msg, ...params) => {
          err += msg + "" + params.map(String).join(", ");
          err += "\n";
        });
        wtfnode.dump();
        wtfnode.resetLoggers();

        body = [info, warn, err].join("\n");
      } else {
        const res = await fetchModule.fetch("https://httpbin:8080/anything", {
          method: "POST",
          body: '{ "hello": "world" }',
          headers: {
            "user-agent": `node@${process.version}`,
          },
        });
        if (consumeBody) {
          await res.json();
        }
      }
    } finally {
      res.writeHead(200).end(body);
    }
  })
  .listen(3000, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("Server is running...");
  });
