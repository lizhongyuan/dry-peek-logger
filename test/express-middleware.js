const { expressMiddlewareBuilder } = require('../middleware');

const option = {
    // name: 'dpLogger',     // 日志实例名称
    type: 'express',
    console: true,
    autoTraceId: false,
    needErrorFile: true,
    level: 'silly',         // level
    dirname: './logs',         // 文本存放路径
    filename: 'test%DATE%.log',       // 日志名
    datePattern: '-YYYY.MM.DD',
    zippedArchive: true,
    prepend: false,
    maxSize: '20m'
};

var express = require('express')
var app = express()

const port = 3000;

app.use(expressMiddlewareBuilder(option));

app.get('/test', function (req, res) {
    req.context.dpLogger.error("test1");
    req.context.dpLogger.warn("test1");
    req.context.dpLogger.info("test1");
    req.context.dpLogger.verbose("test1");
    req.context.dpLogger.debug("test1");
    req.context.dpLogger.silly("test1");
    req.context.dpLogger.info("test2");
    res.send('hello world, express')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
