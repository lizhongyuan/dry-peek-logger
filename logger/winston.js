'use strict';


const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, format } = winston;
const { timestamp, printf, prettyPrint, label, splat } = format;
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



function setLevel(level) {

  const keys = Object.keys(dryPeekTransportPool);

  keys.forEach(key => {
    for (const transport in dryPeekTransportPool[key]) {
      dryPeekTransportPool[key][transport].level = level;
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

  constructor(options = DEFAULT_DRY_PEEK_OPTIONS,
              transportOptions,
              dpTransportOptions,
              winstonOptions
  ) {
    this.options = options;
    this.transportOptions_ = transportOptions;
    this.dpTransportOptions_ = dpTransportOptions;
    this.winstonOptions_ = winstonOptions;
  }

  addTransportsToPool_(transportName, transportOptions, dpTransportOptions) {
    dryPeekTransportPool[transportName] = [];

    const fileTransport = new DailyRotateFile(transportOptions);
    dryPeekTransportPool[transportName].push(fileTransport);

    if (dpTransportOptions.console) {
      const consoleTransport = new winston.transports.Console(transportOptions);
      dryPeekTransportPool[transportName].push(consoleTransport);
    }

    if (dpTransportOptions.needErrorFile) {
      const errFileName = "error-" + transportOptions.filename;
      let errTransportOption = {
        filename: errFileName,
        json: false,
        humanReadableUnhandledException: true,
        level: 'error',
      };

      errTransportOption = Object.assign({}, transportOptions, errTransportOption);
      const errTransport = new DailyRotateFile(errTransportOption);

      dryPeekTransportPool[transportName].push(errTransport);
    }
  }


  addWinstonToPool_(name, winstonOptions) {
    const { colorized } = winstonOptions;

    const customFormat = winston.format.printf(({ level, message, }) => {
      if (colorized) {
        const colorizer = winston.format.colorize();
        return colorizer.colorize(level, `${message}`);
      }

      return `${message}`;
    })

    if (!dryPeekWinstonPool[name]) {
      dryPeekWinstonPool[name] = createLogger({
        transports: dryPeekTransportPool[name],
        exitOnError: false,
        format: winston.format.combine(
          customFormat
        ),
      });
    }
  }


  generate() {

    const { name } = this.options;

    this.addTransportsToPool_(
      name,
      this.transportOptions_,
      this.dpTransportOptions_
    );
    this.addWinstonToPool_(
      name,
      this.winstonOptions_,
    );

    return dryPeekWinstonPool[name];
  }
}


exports.WinstonFactory = WinstonFactory;

exports.getWinstonPool = () => {
  return dryPeekWinstonPool;
};
