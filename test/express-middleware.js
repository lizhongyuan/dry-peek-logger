const express = require('express');
const { expressMiddlewareBuilder } = require('../middleware');


const loggerConfig = {
    label: 'dry-peek-demo',
    colorized: false,
    console: true,
    autoTraceId: true,
    needErrorFile: true,
    level: 'info',
    dirname: './logs',
    filename: 'test%DATE%.log',
    datePattern: '-YYYY.MM.DD',
    zippedArchive: true,
    prepend: false,
    maxSize: '20m',
    maxFiles: 10,
    template: '{{label}} [{{timestamp}}] <{{level}}> {{ append \'\' \'{\'}}{{traceId}}{{ append \'\' \'}\'}} {{ append \'\' \'{{\'}}{{ip}}{{ append \'\' \'}}\'}} {{pid}} {{method}} {{httpPath}} ({{timeCost}}) {{pivot}} {{message}}'
};


const app = express();
const port = 3000;

app.use(expressMiddlewareBuilder(loggerConfig));


app.get('/test', function (req, res) {
    req.context.dryPeekLogger.error("test dry-peek-logger error level");
    req.context.dryPeekLogger.warn("test dry-peek-logger warn level");
    req.context.dryPeekLogger.info("test dry-peek-logger info level");
    req.context.dryPeekLogger.verbose("test dry-peek-logger verbose level");        // This log will not be logged because the level of "verbose" is lower than that of "info".
    req.context.dryPeekLogger.debug("test dry-peek-logger debug level");            // This log will not be logged because the level of "debug" is lower than that of "info".
    req.context.dryPeekLogger.silly("test dry-peek-logger silly level");            // This log will not be logged because the level of "silly" is lower than that of "info".
    req.context.dryPeekLogger.info("Dry peek !");
    req.context.dryPeekLogger.info({ test: "Dry peek !" });
    req.context.dryPeekLogger.info("Dry peek %d, %d, %s", 321, 789, "dryPeek");
    req.context.dryPeekLogger.info(["Dry", "peek !", 123, { test: true}]);
    req.context.dryPeekLogger.info("Dry", "peek !", 666, { test: true});
    req.context.dryPeekLogger.info("Dry2", "peek !", 666, { test: true});

    res.send('hello world, express')
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
