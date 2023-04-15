'use strict';


const { BaseLogger, getGlobalWinstonInstance } = require('./logger');

exports.BaseLogger = BaseLogger;
exports.getGlobalWinstonInstance = getGlobalWinstonInstance;
exports.middlewares = require('./middleware');
