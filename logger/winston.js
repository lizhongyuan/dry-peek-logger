'use strict';


// use os.EOL
const os = require('os');

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, format } = winston;
const { printf } = format;
const { Time } = require('../util');
const { DEFAULT_DRY_PEEK_OPTIONS } = require('../common/constant/config_option');

const dryPeekWinstonPool = {};    // winston池

/*
 {
    "myLogger1": [

    ],
    "myLogger2": [

    ],
 }
 */
const dryPeekTransportPool = {};  // transport池


/**
 *
 * @type {Format}
 */
const dryPeekLogFormat = printf(({ message, level }) => {

  const timestamp = Time.getISODate(Date.now());

  // 处理多行message
  message = message ? message.replace(/\r\n|\r|\n/g, `${os.EOL} | `) : message;

  return `${timestamp} ${level} ${message}`;
});


function setLevel(level) {

  const keys = Object.keys(dryPeekTransportPool);

  keys.forEach(curKey => {
    for (const transport in dryPeekTransportPool[curKey]) {
      dryPeekTransportPool[curKey][transport].level = level;
      console.log('transport:', transport, 'level', level);
    }
  })
}


process.on('SIGUSR1', function() {
  console.log('SIGUSR1, set debug');
  setLevel('debug');
});

process.on('SIGUSR2', function() {
  console.log('SIGUSR2, set info');
  setLevel('info');
});


class WinstonFactory {

  constructor(options = DEFAULT_DRY_PEEK_OPTIONS) {
    this.options = options;
    this.defaultTransportOptions_ = {
      json: false,
      format: dryPeekLogFormat
    }
  }

  addNewTransportsToPool_(options) {
    dryPeekTransportPool[options.name] = [];

    const defaultTransportOption = Object.assign({}, this.defaultTransportOptions_, options);
    const defaultTransport = new DailyRotateFile(defaultTransportOption);

    dryPeekTransportPool[options.name].push(defaultTransport);

    if (options.console) {
      const consoleTransportOption = Object.assign({}, this.defaultTransportOptions_, options);
      const consoleTransport = new winston.transports.Console(consoleTransportOption);

      dryPeekTransportPool[options.name].push(consoleTransport);
    }

    if (options.needErrorFile) {
      const errFileName = "error-" + options.filename;
      let errTransportOption = {
        filename: errFileName,
        json: false,
        humanReadableUnhandledException: true,
        level: 'error',
      };

      errTransportOption = Object.assign({}, this.defaultTransportOptions_, options, errTransportOption);
      const errTransport = new DailyRotateFile(errTransportOption);

      dryPeekTransportPool[options.name].push(errTransport);
    }

    return options.name;
  }


  addNewWinstonToPool_(name) {

    const winstonName = name;
    const transportName = name;

    if (!dryPeekWinstonPool[winstonName]) {
      dryPeekWinstonPool[winstonName] = createLogger({
        transports: dryPeekTransportPool[transportName],
        exitOnError: false
      });
    }
  }


  generate() {

    const { name } = this.options;

    this.addNewTransportsToPool_(this.options);
    this.addNewWinstonToPool_(name);

    return dryPeekWinstonPool[name];
  }
}


exports.WinstonFactory = WinstonFactory;

exports.getWinstonPool = () => {
  return dryPeekWinstonPool;
};
