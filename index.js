// https://github.com/markusahlstrand/cloudworker-proxy
const Proxy = require("edge-proxy");
import index_html from "./index.html";
import simple_css from "./simple.css.txt";

const config = [
  {
    handlerName: "rateLimit",
    options: {
      limit: 1000, // The default allowed calls
      scope: "default",
      type: "IP", // Anything except IP will sum up all calls
    },
  },
  {
    handlerName: "cors",
    options: {
      allowedOrigins: ["*"],
      allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS"],
      allowCredentials: true,
      allowedHeaders: ["*"],
      allowedExposeHeaders: ["X-Amz-Version-Id", "ETag"],
      maxAge: 600,
      optionsSuccessStatus: 204,
      terminatePreflight: false,
    },
  },
  {
    handlerName: "s3",
    path: "/s3-demo/:file",
    method: ["PUT", "GET", "DELETE"],
    options: {
      region: "eu-central-1",
      accessKeyId: S3_KEY_ID,
      secretAccessKey: S3_ACCESS_KEY,
      bucket: "mps3-demo",
      enableBucketOperations: true,
    },
  },
  {
    handlerName: "response",
    path: "/simple.css",
    options: {
      headers: {
        "Content-Type": "text/css; charset=utf-8",
      },
      body: simple_css,
    },
  },
  {
    handlerName: "response",
    options: {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
      body: index_html,
    },
  },
];

const proxy = new Proxy(config);

addEventListener("fetch", (event) => {
  event.respondWith(proxy.resolve(event));
});
