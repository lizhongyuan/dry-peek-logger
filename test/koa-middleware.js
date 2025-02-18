'use strict';


const Koa = require('koa');
const app = new Koa();

const { koaMiddlewareBuilder } = require('../middleware');

const loggerConfig = {
  name: 'dpLogger',
  level: 'debug',
  filename: 'koa-app',
  dirname: './koaLogs',
};


app.use(koaMiddlewareBuilder(loggerConfig));


app.use(async (ctx, next) => {
  ctx.dpLogger.info("---- In Service A ----");
  ctx.dpLogger.info('Step 1');
  ctx.dpLogger.info('Step 2');

  await next();
});

app.use(async (ctx, next) => {
  ctx.dpLogger.info("---- In Service B ----");
  ctx.dpLogger.info('Step 3');
  ctx.dpLogger.info('Step 4');
  ctx.dpLogger.info('Step 5');
  ctx.dpLogger.debug('Step 6, debug');
  ctx.dpLogger.info('Step 7');
  ctx.dpLogger.error('Step 8, error!!');

  await next();
});

app.use(async (ctx, next) => {
  ctx.dpLogger.info("---- In Service C ----");
  ctx.dpLogger.info('Step 9');
  ctx.dpLogger.info('Step 10');

  ctx.body = 'Hello World';
});


app.listen(3000);
