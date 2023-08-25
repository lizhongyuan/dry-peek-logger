'use strict';


const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, format, transports } = winston;


const winstonPool = {};
const transportPool = {};


function setLevel(level) {

  const keys = Object.keys(transportPool);

  for (const key of keys) {
    for (const transport in transportPool[key]) {
      transportPool[key][transport].level = level;
    }
  }
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
  constructor(name, transportOptions, dpTransportOptions, winstonOptions) {
    this.name_ = name;
    this.transportOptions_ = transportOptions;
    this.dpTransportOptions_ = dpTransportOptions;
    this.winstonOptions_ = winstonOptions;
  }


  addTransportsToPool_(transportName, transportOptions, dpTransportOptions) {
    transportPool[transportName] = [];

    const fileTransport = new DailyRotateFile(transportOptions);
    transportPool[transportName].push(fileTransport);

    if (dpTransportOptions.console) {
      this.addConsoleTransportToPool_(transportName, transportOptions);
    }

    if (dpTransportOptions.needErrorFile) {
      this.addErrFileTransportToPool_(transportName, transportOptions);
    }
  }


  addConsoleTransportToPool_(transportName, transportOptions) {
    const consoleTransport = new transports.Console(transportOptions);
    transportPool[transportName].push(consoleTransport);
  }


  addErrFileTransportToPool_(transportName, transportOptions) {
    const errFileName = "error-" + transportOptions.filename;
    let errTransportOption = {
      filename: errFileName,
      json: false,
      humanReadableUnhandledException: true,
      level: 'error',
    };

    errTransportOption = Object.assign({}, transportOptions, errTransportOption);
    const errTransport = new DailyRotateFile(errTransportOption);

    transportPool[transportName].push(errTransport);
  }


  addWinstonToPool_(name, winstonOptions) {
    const { colorized } = winstonOptions;

    const formatPrintf = format.printf(({ level, message, }) => {
      if (colorized) {
        const colorizer = format.colorize();
        return colorizer.colorize(level, `${message}`);
      }

      return `${message}`;
    })

    if (!winstonPool[name]) {
      winstonPool[name] = createLogger({
        transports: transportPool[name],
        exitOnError: false,
        format: format.combine(
          formatPrintf
        ),
      });
    }
  }


  generate() {
    this.addTransportsToPool_(this.name_, this.transportOptions_, this.dpTransportOptions_);
    this.addWinstonToPool_(this.name_, this.winstonOptions_);
  }
}


exports.WinstonFactory = WinstonFactory;

exports.getWinstonPool = () => {
  return winstonPool;
};
