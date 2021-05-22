const Koa = require('koa')
//const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
//const logger = require('koa-logger')

const fs = require('fs')
const websockify = require('koa-websocket')
const moment = require('moment')

const index = require('./routes/index')
const users = require('./routes/users')
const ws = require('./routes/ws')

const logger = require('./logger')
const outLogger = logger.getOutLogger();

const app = websockify(new Koa());

//ws
app.ws.use(function (ctx, next) {
  return next(ctx);
});

app.ws.use(ws.routes(), ws.allowedMethods());

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
//app.use(logger());
//app.use(logger.getOutKoaLogger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

//logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  outLogger.info(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;