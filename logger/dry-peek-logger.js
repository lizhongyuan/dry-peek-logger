'use strict';


const process = require('process');
const { format } = require('util');
const { TraceId, Net, Time} = require('../util');
const { DEFAULT_DRY_PEEK_OPTIONS, DEFAULT_PLACE_HOLDER } = require('../common/constant/config_option');
const { WinstonFactory, getWinstonPool } = require('./winston');
const traceIdInstance = new TraceId();
const { handlebars } = require('./handlebars');


const winstonPool = getWinstonPool();
const { WINSTON_DAILY_ROTATE_FILE_KEYS } = require('../common/constant/winston');


class DryPeekLogger {

  constructor(options = DEFAULT_DRY_PEEK_OPTIONS) {

    const loggerOptions = Object.assign({}, DEFAULT_DRY_PEEK_OPTIONS, options);

    this.name_ = loggerOptions.name;

    this.dryPeekOptions = {};
    this.dryPeekOptions.autoTraceId = loggerOptions.autoTraceId;

    this.dryPeekOptions.transportOptions = {};
    for (const key of WINSTON_DAILY_ROTATE_FILE_KEYS) {
      if (loggerOptions[key]) {
        this.dryPeekOptions.transportOptions[key] = loggerOptions[key];
      }
    }

    this.dryPeekOptions.dpTransportOptions = {}
    this.dryPeekOptions.dpTransportOptions.console = loggerOptions.console;
    this.dryPeekOptions.dpTransportOptions.needErrorFile = loggerOptions.needErrorFile;

    this.dryPeekOptions.winston = {};
    this.dryPeekOptions.winston.colorized = loggerOptions.colorized;

    this.dryPeekOptions.logView = {};
    if (typeof loggerOptions.template === "string" && loggerOptions.template.indexOf("message") !== -1) {
      loggerOptions.template = loggerOptions.template.replace("message", "dryPeekEncode message");
    }
    this.dryPeekOptions.template = handlebars.compile(loggerOptions.template);
    this.dryPeekOptions.logView.controller = DEFAULT_PLACE_HOLDER; // todo: for NestJS
    this.dryPeekOptions.logView.service = DEFAULT_PLACE_HOLDER;
    this.dryPeekOptions.logView.label = loggerOptions.label;
    this.dryPeekOptions.logView.httpPath = loggerOptions.httpPath || DEFAULT_PLACE_HOLDER;
    this.dryPeekOptions.logView.method = loggerOptions.method || DEFAULT_PLACE_HOLDER;
    this.dryPeekOptions.logView.pid = process.pid;
    this.dryPeekOptions.logView.ip = Net.IP.getLocalIp();
    this.dryPeekOptions.logView.timeCost = DEFAULT_PLACE_HOLDER;
    this.dryPeekOptions.logView.pivot = loggerOptions.pivot;
    this.dryPeekOptions.startTimestamp = Date.now();
    this.setTraceId(loggerOptions.traceId);

    if (!winstonPool[this.name_]) {
      const winstonFactory = new WinstonFactory(
        this.name_,
        this.dryPeekOptions.transportOptions,
        this.dryPeekOptions.dpTransportOptions,
        this.dryPeekOptions.winston,
      );
      winstonFactory.generate();
    }
  }


  setTraceId(traceId) {
    if (typeof traceId === 'string' && traceId !== '') {
      this.dryPeekOptions.logView.traceId = traceId;
      return;
    }

    if (this.dryPeekOptions.autoTraceId === true) {
      this.dryPeekOptions.logView.traceId = traceIdInstance.generate();
    } else {
      this.dryPeekOptions.logView.traceId = DEFAULT_PLACE_HOLDER;
    }
  }


  getTraceId() {
    return this.dryPeekOptions.logView.traceId;
  }


  error(...args) {
    this.dryPeekOptions.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekOptions.logView.level = 'error';
    const formatLog = this._buildLog(args);
    winstonPool[this.name_].error(formatLog);
  }


  warn(...args) {
    this.dryPeekOptions.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekOptions.logView.level = 'warn';
    const formatLog = this._buildLog(args);
    winstonPool[this.name_].warn(formatLog);
  }


  verbose(...args) {
    this.dryPeekOptions.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekOptions.logView.level = 'verbose';

    const formatLog = this._buildLog(args);
    winstonPool[this.name_].verbose(formatLog);
  }


  info(...args) {
    this.dryPeekOptions.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekOptions.logView.level = 'info';

    const formatLog = this._buildLog(args);
    winstonPool[this.name_].info(formatLog);
  }


  debug(...args) {
    this.dryPeekOptions.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekOptions.logView.level = 'debug';

    const formatLog = this._buildLog(args);
    winstonPool[this.name_].debug(formatLog);
  }


  silly(...args) {
    this.dryPeekOptions.logView.timestamp = Time.getISODate(Date.now());
    this.dryPeekOptions.logView.level = 'silly';

    const formatLog = this._buildLog(args);
    winstonPool[this.name_].silly(formatLog);
  }


  _buildLog(args) {

    const timeCost = Date.now() - this.dryPeekOptions.startTimestamp;

    this.dryPeekOptions.logView.timeCost = String(timeCost) + 'ms';
    this.dryPeekOptions.logView.pivot = '|';

    const handledArgs = [];
    for (let arg of args) {
      if (arg) {
        if (typeof arg === 'string') {
          arg = arg.replace(/[\n\r]/g,'');
        } else if (typeof arg === 'object') {
          arg = JSON.stringify(arg).replace(/[\n\r]/g,'').replace(/&quot;/g,'"');
        }
      } else {
        arg = '';
      }
      handledArgs.push(arg);
    }

    this.dryPeekOptions.logView.message = format(...handledArgs);

    try {
      return this.dryPeekOptions.template(this.dryPeekOptions.logView);
    } catch (e) {
      console.log(e)
      return '';
    }
  }
}


module.exports = DryPeekLogger;
