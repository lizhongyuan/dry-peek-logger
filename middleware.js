'use strict';


const { Net } = require('./util');
const { DryPeekLogger } = require('./logger');
const { constant } = require('./common');
const { DEFAULT_DRY_PEEK_OPTIONS } = constant.CONFIG_OPTION;
const { TRACE_ID_HEADER } = constant.TRACE_ID;


function expressMiddlewareBuilder(options = DEFAULT_DRY_PEEK_OPTIONS) {
  function expressLoggerMiddleware (req, res, next) {
    options["method"] = req.method;
    options["httpPath"] = Net.Http.getPath(req.originalUrl);
    options["traceId"] = req.headers[TRACE_ID_HEADER];

    req.context = {};
    let expressDryPeekLogger = new DryPeekLogger(options);
    req.context[expressDryPeekLogger.name_] = expressDryPeekLogger;

    next();
  }

  return expressLoggerMiddleware;
}


function koaMiddlewareBuilder(options = DEFAULT_DRY_PEEK_OPTIONS) {
  async function koa2LoggerMiddleware(ctx, next) {
    options.httpPath = Net.Http.getPath(ctx.url);
    options.method = ctx.method;
    options.traceId = ctx.req.headers[TRACE_ID_HEADER];

    let expressDryPeekLogger = new DryPeekLogger(options);
    ctx[expressDryPeekLogger.name_] = expressDryPeekLogger;

    await next();
  }

  return koa2LoggerMiddleware;
}


module.exports = {
  koaMiddlewareBuilder,
  expressMiddlewareBuilder,
};
