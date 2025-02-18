![banner](logo.jpg)

# dry-peek-logger
[![npm version](https://img.shields.io/npm/v/dry-peek-logger)](https://www.npmjs.com/package/dry-peek-logger)

A traceable, flexible and light Node.js logger based on winston. Sometimes, dry peeking is the best strategy.

# Install

Using NPM:
```
$ npm install dry-peek-logger
```

Using YARN:
```
$ yarn add dry-peek-logger
```

# Usage
## Options
### Unique options
* **name:** The name of the log variable, used for code invocation. (default: "dryPeekLogger")
* **console:** Whether to print to the console. (default: false)
* **needErrorFile:** Whether to generate a file that only collects error logs simultaneously. (default: false)
* **autoTraced:** Whether to generate a trace id which can trace a life cycle, such as a http request. (default: true)
* **colorized:** Whether the logs displayed on the console are in color. If it is true, it will have an impact on the logs in the log file. (default: false)
* **pivot:** A separator used to help divide the business content and service content of one record. (default: '|')
* **template:** The template of log content, using handlebars-helpers. (default: "{{label}} {{timestamp}} {{level}} {{traceId}} {{ip}} {{pid}} {{method}} {{httpPath}} {{timeCost}} {{pivot}} {{message}}")
### winston-daily-rotate-file's options
See [page of winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file#options)

## Config demo
```config
{
    /*--------------------------------------------*
     *----- dry-peek-logger's unique options -----*
     *--------------------------------------------*/
    "name": "myLogger",
    "console": true,
    "needErrorFile": false,
    "autoTraceId": true,
    
    /*----------------------------------------------*
     *----- winston-daily-rotate-file's options -----*
     *----------------------------------------------*/
    "datePattern": "-YYYY-MM-DD",
    "level": "info",
    "filename": "myLog",
    "zippedArchive": true,
    "localTime": true,
    "prepend": false,
    "maxSize": "20m",
    "maxFiles": "14d",
    "frequency": "24h"
}
```

## Middleware
### express
#### code
```js
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
```

#### log
test-2025.02.13.log
```
dry-peek-demo [2025-02-13T09:20:08.492Z] <error> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (28ms) | test dry-peek-logger error level
dry-peek-demo [2025-02-13T09:20:08.531Z] <warn> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (66ms) | test dry-peek-logger warn level
dry-peek-demo [2025-02-13T09:20:08.532Z] <info> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (67ms) | test dry-peek-logger info level
dry-peek-demo [2025-02-13T09:20:08.533Z] <info> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (68ms) | Dry peek !
dry-peek-demo [2025-02-13T09:20:08.533Z] <info> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (68ms) | {"test":"Dry peek !"}
dry-peek-demo [2025-02-13T09:20:08.534Z] <info> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (69ms) | Dry peek 321, 789, dryPeek
dry-peek-demo [2025-02-13T09:20:08.534Z] <info> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (69ms) | ["Dry","peek !",123,{"test":true}]
dry-peek-demo [2025-02-13T09:20:08.534Z] <info> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (69ms) | Dry peek ! 666 {"test":true}
dry-peek-demo [2025-02-13T09:20:08.535Z] <info> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (70ms) | Dry2 peek ! 666 {"test":true}
dry-peek-demo [2025-02-13T09:20:10.944Z] <error> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (1ms) | test dry-peek-logger error level
dry-peek-demo [2025-02-13T09:20:10.952Z] <warn> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (9ms) | test dry-peek-logger warn level
dry-peek-demo [2025-02-13T09:20:10.952Z] <info> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (10ms) | test dry-peek-logger info level
dry-peek-demo [2025-02-13T09:20:10.955Z] <info> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (12ms) | Dry peek !
dry-peek-demo [2025-02-13T09:20:10.956Z] <info> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (13ms) | {"test":"Dry peek !"}
dry-peek-demo [2025-02-13T09:20:10.956Z] <info> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (13ms) | Dry peek 321, 789, dryPeek
dry-peek-demo [2025-02-13T09:20:10.957Z] <info> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (14ms) | ["Dry","peek !",123,{"test":true}]
dry-peek-demo [2025-02-13T09:20:10.957Z] <info> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (14ms) | Dry peek ! 666 {"test":true}
dry-peek-demo [2025-02-13T09:20:10.958Z] <info> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (15ms) | Dry2 peek ! 666 {"test":true}
```
error-test-2025.02.13.log
```
dry-peek-demo [2025-02-13T09:20:08.492Z] <error> {00000001Ngg5Zjoq} {{10.14.108.146}} 47765 GET /test (28ms) | test dry-peek-logger error level
dry-peek-demo [2025-02-13T09:20:10.944Z] <error> {00000002-AaXznem} {{10.14.108.146}} 47765 GET /test (1ms) | test dry-peek-logger error level
```

### koa
#### code
```js
'use strict';


const Koa = require('koa');
const app = new Koa();

const { koaMiddlewareBuilder } = require('../middleware');

const loggerConfig = {
    name: 'dpLogger',
    level: 'debug',
    filename: 'koa-app',
    dirname: './koaLogs',
};


app.use(koaMiddlewareBuilder(loggerConfig));


app.use(async (ctx, next) => {
    ctx.dpLogger.info("---- In Service A ----");
    ctx.dpLogger.info('Step 1');
    ctx.dpLogger.info('Step 2');

    await next();
});

app.use(async (ctx, next) => {
    ctx.dpLogger.info("---- In Service B ----");
    ctx.dpLogger.info('Step 3');
    ctx.dpLogger.info('Step 4');
    ctx.dpLogger.info('Step 5');
    ctx.dpLogger.debug('Step 6, debug');
    ctx.dpLogger.info('Step 7');
    ctx.dpLogger.error('Step 8, error!!');

    await next();
});

app.use(async (ctx, next) => {
    ctx.dpLogger.info("---- In Service C ----");
    ctx.dpLogger.info('Step 9');
    ctx.dpLogger.info('Step 10');

    ctx.body = 'Hello World';
});


app.listen(3000);
```
#### log
```
demo-service 2025-02-13T09:06:00.611Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 27ms | ---- In Service A ----
demo-service 2025-02-13T09:06:00.659Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 75ms | Step 1
demo-service 2025-02-13T09:06:00.660Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 76ms | Step 2
demo-service 2025-02-13T09:06:00.661Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 77ms | ---- In Service B ----
demo-service 2025-02-13T09:06:00.661Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 77ms | Step 3
demo-service 2025-02-13T09:06:00.661Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 78ms | Step 4
demo-service 2025-02-13T09:06:00.663Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 79ms | Step 5
demo-service 2025-02-13T09:06:00.664Z debug 00000001YTxn_BJK 10.14.108.146 39291 GET /test 80ms | Step 6, debug
demo-service 2025-02-13T09:06:00.664Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 80ms | Step 7
demo-service 2025-02-13T09:06:00.665Z error 00000001YTxn_BJK 10.14.108.146 39291 GET /test 81ms | Step 8, error!!
demo-service 2025-02-13T09:06:00.665Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 81ms | ---- In Service C ----
demo-service 2025-02-13T09:06:00.665Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 82ms | Step 9
demo-service 2025-02-13T09:06:00.667Z info 00000001YTxn_BJK 10.14.108.146 39291 GET /test 83ms | Step 10
demo-service 2025-02-13T09:18:47.561Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 0ms | ---- In Service A ----
demo-service 2025-02-13T09:18:47.567Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 6ms | Step 1
demo-service 2025-02-13T09:18:47.567Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 6ms | Step 2
demo-service 2025-02-13T09:18:47.569Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 8ms | ---- In Service B ----
demo-service 2025-02-13T09:18:47.569Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 8ms | Step 3
demo-service 2025-02-13T09:18:47.570Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 9ms | Step 4
demo-service 2025-02-13T09:18:47.570Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 9ms | Step 5
demo-service 2025-02-13T09:18:47.571Z debug 00000002JDtvfAfl 10.14.108.146 39291 GET /test 10ms | Step 6, debug
demo-service 2025-02-13T09:18:47.572Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 11ms | Step 7
demo-service 2025-02-13T09:18:47.572Z error 00000002JDtvfAfl 10.14.108.146 39291 GET /test 11ms | Step 8, error!!
demo-service 2025-02-13T09:18:47.574Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 13ms | ---- In Service C ----
demo-service 2025-02-13T09:18:47.575Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 14ms | Step 9
demo-service 2025-02-13T09:18:47.576Z info 00000002JDtvfAfl 10.14.108.146 39291 GET /test 15ms | Step 10
```

### Nest.js
Imitate the methods in the Express example.

# Trace ID by http request
You can set headers.dry-peek-trace-id in an HTTP request to pass the trace ID through an HTTP call.

# The Team

## LiZhongyuan
<https://github.com/lizhongyuan>

# License

[//]: # (Licensed under [MIT]&#40;./LICENSE&#41;.)
Licensed under MIT.
