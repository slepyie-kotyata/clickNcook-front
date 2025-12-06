const fs = require("fs");

const api = process.env.NG_APP_API;
const ws = process.env.NG_APP_WEBSOCKET_API;

if (!api) {
  console.error("NG_APP_API is missing in environment variables");
  process.exit(1);
}

if (!ws) {
  console.error("NG_APP_WEBSOCKET_API is missing in environment variables");
  process.exit(1);
}

let config = fs.readFileSync("ngsw-config.template.json", "utf8");
config = config.replace(/__API_URL__/g, api);
config = config.replace(/__WS_URL__/g, ws);


fs.writeFileSync("ngsw-config.json", config);
console.log(`ngsw-config.json generated with API = ${api} and WS = ${ws}`);
