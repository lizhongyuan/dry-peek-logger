'use strict';


const process = require('process');
const { format } = require('util');
const { TraceId, Net, Time} = require('../util');
const { DEFAULT_DRY_PEEK_OPTIONS, DEFAULT_PLACE_HOLDER } = require('../common/constant/config_option');
const { WinstonFactory, getWinstonPool } = require('./winston');
const traceIdInstance = new TraceId();
const Mustache = require("mustache");
Mustache.escape = function (text) {
  return text;
};


const winstonPool = getWinstonPool();
const { WINSTON_DAILY_ROTATE_FILE_KEYS } = require('../common/constant/winston');

class BaseLogger {

  constructor(options = DEFAULT_DRY_PEEK_OPTIONS) {

    const baseLoggerOptions = Object.assign({}, DEFAULT_DRY_PEEK_OPTIONS, options);

    this.dryPeekContent = {};
    this.dryPeekContent.name = baseLoggerOptions.name;
    this.dryPeekContent.template = baseLoggerOptions.template;
    this.dryPeekContent.autoTraceId = baseLoggerOptions.autoTraceId;

    this.dryPeekContent.winstonDailyRotateFile = {};
    for (const key of WINSTON_DAILY_ROTATE_FILE_KEYS) {
      if (baseLoggerOptions[key]) {
        this.dryPeekContent.winstonDailyRotateFile[key] = baseLoggerOptions[key];
      }
    }

    this.dryPeekContent.dpTransportOptions = {}
    this.dryPeekContent.dpTransportOptions.console = baseLoggerOptions.console;
    this.dryPeekContent.dpTransportOptions.needErrorFile = baseLoggerOptions.needErrorFile;

    this.dryPeekContent.winston = {};
    this.dryPeekContent.winston.colorized = baseLoggerOptions.colorized;

    this.dryPeekContent.logView = {};
    this.dryPeekContent.logView.controller = '-'; // todo: 增加nestjs的支持
    this.dryPeekContent.logView.service = '-';
    this.dryPeekContent.logView.label = baseLoggerOptions.label;
    this.dryPeekContent.logView.httpPath = baseLoggerOptions.httpPath || DEFAULT_PLACE_HOLDER;
    this.dryPeekContent.logView.method = baseLoggerOptions.method || DEFAULT_PLACE_HOLDER;
    this.dryPeekContent.logView.pid = process.pid;
    this.dryPeekContent.logView.ip = Net.IP.getLocalIp();
    this.dryPeekContent.logView.timeCost = DEFAULT_PLACE_HOLDER;
    this.dryPeekContent.logView.pivot = baseLoggerOptions.pivot;
    this.dryPeekContent.startTimestamp = Date.now();
    this.setTraceId(baseLoggerOptions.traceId);

    if (!winstonPool[this.dryPeekContent.name]) {
      // const winstonFactory = new WinstonFactory(baseLoggerOptions);
      const winstonFactory = new WinstonFactory(
        baseLoggerOptions,
        this.dryPeekContent.winstonDailyRotateFile,
        this.dryPeekContent.dpTransportOptions,
        this.dryPeekContent.winston,
      );
      winstonFactory.generate();
    }
  }

  setTraceId(traceId) {

    if (typeof traceId === 'string' && traceId !== '') {
      this.dryPeekContent.logView.traceId = traceId;
      return;
    }

    if (this.dryPeekContent.autoTraceId === true) {
      this.dryPeekContent.logView.traceId = traceIdInstance.generate();
    } else {
      this.dryPeekContent.logView.traceId = DEFAULT_PLACE_HOLDER;
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
    this.dryPeekContent.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekContent.logView.level = 'error';
    const formatLog = this._buildLog(args);
    winstonPool[this.dryPeekContent.name].error(formatLog);
  }

  warn(...args) {
    this.dryPeekContent.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekContent.logView.level = 'warn';
    const formatLog = this._buildLog(args);
    winstonPool[this.dryPeekContent.name].warn(formatLog);
  }

  verbose(...args) {
    this.dryPeekContent.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekContent.logView.level = 'verbose';

    const formatLog = this._buildLog(args);
    winstonPool[this.dryPeekContent.name].verbose(formatLog);
  }

  info(...args) {
    this.dryPeekContent.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekContent.logView.level = 'info';

    const formatLog = this._buildLog(args);
    winstonPool[this.dryPeekContent.name].info(formatLog);
  }

  debug(...args) {
    this.dryPeekContent.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekContent.logView.level = 'debug';

    const formatLog = this._buildLog(args);
    winstonPool[this.dryPeekContent.name].debug(formatLog);
  }

  silly(...args) {
    this.dryPeekContent.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekContent.logView.level = 'silly';

    const formatLog = this._buildLog(args);
    winstonPool[this.dryPeekContent.name].silly(formatLog);
  }

  _buildLog(args) {

    const timeCost = Date.now() - this.dryPeekContent.startTimestamp;

    this.dryPeekContent.logView.timeCost = String(timeCost) + 'ms';
    this.dryPeekContent.logView.pivot = '|';

    const handledArgs = [];
    for (let arg of args) {
      if (arg) {
        if (typeof arg === 'string') {
          arg = arg.replace(/[\n\r]/g,'');
        } else if (typeof arg === 'object') {
          arg = JSON.stringify(arg).replace(/[\n\r]/g,'');
        }
      } else {
        arg = '';
      }
      handledArgs.push(arg);
    }

    this.dryPeekContent.logView.message = format(...handledArgs);

    const output = Mustache.render(this.dryPeekContent.template, this.dryPeekContent.logView);

    return output;
  }
}


module.exports = BaseLogger;
