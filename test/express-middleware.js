const { expressMiddlewareBuilder } = require('../middleware');

const option = {
    // name: 'dpLogger',     // 日志实例名称
    type: 'express',
    console: true,
    autoTraceId: true,
    needErrorFile: true,
    level: 'silly',         // level
    dirname: './logs',         // 文本存放路径
    filename: 'test%DATE%.log',       // 日志名
    datePattern: '-YYYY.MM.DD',
    zippedArchive: true,
    prepend: false,
    maxSize: '20m',
    template: '[{{timestamp}}] <{{level}}> {{traceId}} {{ip}} {{pid}} {{method}} {{httpPath}} ({{timeCost}}) {{pivot}} {{message}}'
};

const express = require('express');
const app = express();

const port = 3000;

app.use(expressMiddlewareBuilder(option));

app.get('/test', function (req, res) {
    req.context.dpLogger.error("test dry-peek-logger error");
    req.context.dpLogger.warn("test dry-peek-logger warn");
    req.context.dpLogger.info("test dry-peek-logger info");
    req.context.dpLogger.verbose("test dry-peek-logger verbose");
    req.context.dpLogger.debug("test dry-peek-logger debug");
    req.context.dpLogger.silly("test dry-peek-logger silly");
    req.context.dpLogger.info("Dry peek !");
    res.send('hello world, express')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
