'use strict';


exports.DEFAULT_DRY_PEEK_OPTIONS = {
  label: 'demo-service',
  name: 'dryPeekLogger',
  console: true,
  needErrorFile: false,
  autoTraceId: true,
  colorized: false,
  pivot: '|',
  template: '{{label}} {{timestamp}} {{level}} {{traceId}} {{ip}} {{pid}} {{method}} {{httpPath}} {{timeCost}} {{pivot}} {{message}}',

  frequency: null,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  filename: 'dryPeek.log-%DATE%',
  dirname: '.',
  stream: null,
  maxSize: null,
  maxFiles: null,
  options: { flags: 'a' },
  auditFile: '..json',
  utc: false,
  extension: '',
  createSymlink: false,
  symlinkName: 'current.log',
  auditHashType: 'sha256',
  level: 'silly',
};


exports.DEFAULT_PLACE_HOLDER = '-';
exports.TRACE_ID_HEADER = 'dry-peek-trace-id';
