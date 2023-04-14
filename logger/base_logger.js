'use strict';


const process = require('process');
const _ = require('underscore');
const { format } = require('util');
const { TraceId, Net } = require('../util');
const { DEFAULT_DRY_PEEK_OPTIONS, DEFAULT_PLACE_HOLDER } = require('../common/constant/config_option');
const { WinstonFactory, getWinstonPool } = require('./winston');
const traceIdInstance = new TraceId();


const winstonPool = getWinstonPool();


class BaseLogger {

  constructor(options = DEFAULT_DRY_PEEK_OPTIONS) {

    this.options = _.clone(options);

    const winstonOptions = Object.assign({}, DEFAULT_DRY_PEEK_OPTIONS, this.options);

    this.dryPeekContent = {};
    this.dryPeekContent.name = options.name || "dryPeekLogger";
    this.dryPeekContent.httpPath = options.httpPath || DEFAULT_PLACE_HOLDER;
    this.dryPeekContent.method = options.method || DEFAULT_PLACE_HOLDER;
    this.dryPeekContent.startTimestamp = Date.now();
    this.dryPeekContent.pid = process.pid;
    this.dryPeekContent.ip = Net.IP.getLocalIp();
    this.dryPeekContent.timeCost = DEFAULT_PLACE_HOLDER;
    this.setTraceId(options.traceId);

    if (!winstonPool[this.dryPeekContent.name]) {
      const winstonFactory = new WinstonFactory(winstonOptions);
      winstonFactory.generate();
    }
  }

  setTraceId(traceId) {

    if (typeof traceId === 'string' && traceId !== '') {
      this.dryPeekContent.traceId = traceId;
      return;
    }

    if (this.options.autoTraceId === true) {
      this.dryPeekContent.traceId = traceIdInstance.generate();
    } else {
      this.dryPeekContent.traceId = DEFAULT_PLACE_HOLDER;
    }
  }


  getTraceId() {
    return this.dryPeekContent.traceId;
  }


  /*
  getModule() {
    return this.context.module;
  }

  setModule(module) {
    this.context.module = module;
    return this;
  }

  setFunc(func) {
    this.context.func = func;
    return this;
  }

  getFunc() {
    return this.context.func;
  }
   */

  /*
  setTraceId(traceId) {
    this.context.traceId = traceId;
    return this;
  }
   */


  error(...args) {
    const formatLog = this._buildFormatLog(...args);
    winstonPool[this.dryPeekContent.name].error(formatLog);
  }

  warn(...args) {
    const formatLog = this._buildFormatLog(...args);
    winstonPool[this.dryPeekContent.name].warn(formatLog);
  }

  verbose(...args) {
    const formatLog = this._buildFormatLog(...args);
    winstonPool[this.dryPeekContent.name].verbose(formatLog);
  }

  info(...args) {
    const formatLog = this._buildFormatLog(...args);
    winstonPool[this.dryPeekContent.name].info(formatLog);
  }

  debug(...args) {
    const formatLog = this._buildFormatLog(...args);
    winstonPool[this.dryPeekContent.name].debug(formatLog);
  }

  silly(...args) {
    const formatLog = this._buildFormatLog(...args);
    winstonPool[this.dryPeekContent.name].silly(formatLog);
  }

  _buildFormatLog(params) {

    const timeCost = Date.now() - this.dryPeekContent.startTimestamp;
    this.dryPeekContent.timeCost = String(timeCost) + 'ms';
    this.dryPeekContent.pivot = '|';
    this.dryPeekContent.businessLog = format(params);

    const formatLog =
        `${this.dryPeekContent.traceId} ` +
        `${this.dryPeekContent.ip} ` +
        `${this.dryPeekContent.pid} ` +
        `${this.dryPeekContent.method} ` +
        `${this.dryPeekContent.httpPath} ` +
        `${this.dryPeekContent.timeCost} ` +
        `${this.dryPeekContent.pivot} ` +
        `${this.dryPeekContent.businessLog}`;

    return formatLog;
  }
}


module.exports = BaseLogger;
