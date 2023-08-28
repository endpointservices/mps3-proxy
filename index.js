const Proxy = require("cloudworker-proxy");
// https://github.com/markusahlstrand/cloudworker-proxy

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
      allowedHeaders: ["Content-Type"],
      allowedExposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
      maxAge: 600,
      optionsSuccessStatus: 204,
      terminatePreflight: false,
    },
  },
  {
    handlerName: "s3",
    path: "/:file*",
    options: {
      region: "eu-central-1",
      accessKeyId: S3_KEY_ID,
      secretAccessKey: S3_ACCESS_KEY,
      bucket: "mps3-demo",
      path: "{file}",
    },
  },
];

const proxy = new Proxy(config);

addEventListener("fetch", (event) => {
  event.respondWith(proxy.resolve(event));
});
