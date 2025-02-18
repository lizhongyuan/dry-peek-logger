const Handlebars = require('handlebars');

const log = {
  timestamp: '2023-04-15T03:41:57.135Z',
  level: 'error',
  traceId: '-',
  ip: '192.168.101.35',
  pid: 4381,
  method: 'GET',
  httpPath: "/test",
  timeCost: '11ms',
  pivot: '|',
  message: 'Hello'
}

const template = Handlebars.compile("{{timestamp}} {{level}} {{traceId}} {{ip}} {{pid}} {{method}} {{httpPath}} {{timeCost}} {{pivot}} {{message}}");

const output = template(log);

console.log(output);

