'use strict';


exports.DEFAULT_DRY_PEEK_OPTIONS = {
  label: 'demo-service',
  name: 'dryPeekLogger',
  console: true,
  needErrorFile: false,
  autoTraceId: true,
  level: 'info',
  dirname: './logs',
  filename: 'app%DATE%',
  datePattern: '-YYYY.MM.DD',
  zippedArchive: true,
  pivot: '|',
  template: '{{timestamp}} {{level}} {{traceId}} {{ip}} {{pid}} {{method}} {{httpPath}} {{timeCost}} {{pivot}} {{message}}',
  colorized: false,
};


exports.DEFAULT_PLACE_HOLDER = '-';
exports.TRACE_ID_HEADER = 'x-trace-id';
