'use strict';


/*
const DEFAULT_LOGGER_NAME = 'dpLogger';       // 日志实例名
const DEFAULT_LEVEL = 'info';               // 日志level
const DEFAULT_FILE_NAME= 'app%DATE%';         // 日志名(非时间部分)
const DEFAULT_DIRNAME = './logs';             // 日志文件路径
const DEFAULT_CONSOLE = true;               // 是否在console打印
const DEFAULT_NEED_ERROR_FILE = false;      // 是否需要单独收集error日志
const DEFAULT_AUTO_TRACE_ID = true;         // 是否自动生成trace_id
const DEFAULT_DATE_PATTERN = '-YYYY.MM.DD'; // 日志名(时间部分)
const DEFAULT_ZIPPED_ARCHIVE = true;        // 是否打包
 */

// default winston option
exports.DEFAULT_DRY_PEEK_OPTIONS = {
  name: 'dpLogger',
  console: true,
  needErrorFile: false,
  autoTraceId: true,
  level: 'info',
  dirname: './logs',
  filename: 'app%DATE%',
  datePattern: '-YYYY.MM.DD',
  zippedArchive: true,
};


exports.DEFAULT_PLACE_HOLDER = '-';
exports.TRACE_ID_HEADER = 'x-trace-id';
