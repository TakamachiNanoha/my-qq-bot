const Koa = require("koa");
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const websockify = require("koa-websocket");

const indexRouters = require("./routes/index");
const usersRouters = require("./routes/users");
const testRouters = require("./routes/test");
const wsRouters = require("./routes/ws");

global._ = require("lodash");
global.consoleLogger = require("./logger").consoleLogger;

const app = websockify(new Koa());

//ws
app.ws.use(function (ctx, next) {
  return next(ctx);
});

app.ws.use(wsRouters.routes(), wsRouters.allowedMethods());

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

//logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  consoleLogger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(indexRouters.routes(), indexRouters.allowedMethods());
app.use(usersRouters.routes(), usersRouters.allowedMethods());
app.use(testRouters.routes(), testRouters.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
