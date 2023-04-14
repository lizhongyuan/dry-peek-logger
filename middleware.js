'use strict';


const { Net } = require('./util');
const { BaseLogger } = require('./logger');
const { constant } = require('./common');
const { DEFAULT_DRY_PEEK_OPTION } = constant.CONFIG_OPTION;
const { TRACE_ID_HEADER } = constant.TRACE_ID;


function expressMiddlewareBuilder(options = DEFAULT_DRY_PEEK_OPTION) {
  function expressLoggerMiddleware (req, res, next) {

    if (!dryPeekOptions["name"]) {
      dryPeekOptions["name"] = 'dpLogger';
    }

    dryPeekOptions["method"] = req.method;
    dryPeekOptions["httpPath"] = Net.Http.getPath(req.originalUrl);
    dryPeekOptions["traceId"] = req.headers[TRACE_ID_HEADER];

    req.context = {};
    req.context[dryPeekOptions.name] = new BaseLogger(dryPeekOptions);

    next();
  }

  return expressLoggerMiddleware;
}


function koaMiddlewareBuilder(options = DEFAULT_DRY_PEEK_OPTION) {

  async function koa2LoggerMiddleware(ctx, next) {

    if (!options.name) {
      options.name = 'dpLogger';
    }

    options.httpPath = Net.Http.getPath(ctx.url);
    options.method = ctx.method;
    options.traceId = ctx.req.headers[TRACE_ID_HEADER];

    ctx[options.name] = new BaseLogger(options);

    await next();
  }

  return koa2LoggerMiddleware;
}


module.exports = {
  koaMiddlewareBuilder,
  expressMiddlewareBuilder,
};
