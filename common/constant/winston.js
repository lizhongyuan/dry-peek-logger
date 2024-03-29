
exports.WINSTON_DAILY_ROTATE_FILE_KEYS = [
  // A string representing the frequency of rotation. This is useful if you want to have timed rotations, as opposed to rotations that happen at specific moments in time. Valid values are '#m' or '#h' (e.g., '5m' or '3h'). Leaving this null relies on datePattern for the rotation times. (default: null)
  // 日志截断(或轮循)频率参数. 当想进行定时的日志截断时, 使用此参数, 它使日志能够在指定的时刻进行截断. 正确的值为'#m'或者'#h' (例如, '5m'或者'3h'), 如果使用datePattern, 则此参数设置为null(默认为null)
  'frequency',

  // A string representing the moment.js date format to be used for rotating. The meta characters used in this string will dictate the frequency of the file rotation. For example, if your datePattern is simply 'HH' you will end up with 24 log files that are picked up and appended to every day. (default: 'YYYY-MM-DD')
  // moment.js日期格式的截断参数. 参数中的字符规定了截断频率. 例如, 如果你简单地使用‘HH’, 每天结束的时候, 日志会被采集到24个文件. (默认: 'YYYY-MM-DD')
  'datePattern',

  // A boolean to define whether or not to gzip archived log files. (default: 'false')
  // 是否压缩成gzip格式文件的参数. (默认: 'false')
  'zippedArchive',

  // Filename to be used to log to. This filename can include the %DATE% placeholder which will include the formatted datePattern at that point in the filename. (default: 'winston.log.%DATE%')
  // 日志名参数. 该参数可以使用占位符%DATE%, 该占位符将使用格式化的datePattern来替代 (默认: 'winston.log.%DATE%')
  'filename',

  // The directory name to save log files to. (default: '.')
  // 存放日志的文件夹路径名. (默认: '.')
  'dirname',

  // Write directly to a custom stream and bypass the rotation capabilities. (default: null)
  // 直接写入到当前流中, 不再进行截断
  'stream',

  // Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb. If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number. (default: null)
  // 截断后的文件大小的最大值. 可以是byte数值, 或者以kb, mb和gb为单位的数值. 如果使用单位, 添加'k', 'm', 或者'g'作为后缀. 单位需要直接跟在数值后边. (默认: null)
  'maxSize',

  // Maximum number of logs to keep.
  // If not set, no logs will be removed.
  // This can be a number of files or number of days.
  // If using days, add 'd' as the suffix.
  // It uses auditFile to keep track of the log files in a json format.
  // It won't delete any file not contained in it.
  // It can be a number of files or number of days (default: null)
  // 最大文件保存数.
  // 如果不设置此参数, 则不删除任何日志文件. 此参数可以是文件数或者天数. 如果使用天数, 使用'd'作为后缀.
  'maxFiles',

  // An object resembling https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options indicating additional options that should be passed to the file stream. (default: { flags: 'a' })
  'options',

  // A string representing the name of the audit file. This can be used to override the default filename which is generated by computing a hash of the options object. (default: '..json')
  // 监控文件的名称,
  'auditFile',

  // Use UTC time for date in filename. (default: false)
  // 在文件名中使用UTC时间(默认: false)
  'utc',

  // File extension to be appended to the filename. (default: '')
  'extension',

  // Create a tailable symlink to the current active log file. (default: false)
  // 是否创建指向当前起作用的日志文件的软连接(默认: false)
  'createSymlink',

  // The name of the tailable symlink. (default: 'current.log')
  // 指向最近的日志文件的转连接名称(默认: 'current.log')
  'symlinkName',

  // Use specified hashing algorithm for audit. (default: 'sha256')
  'auditHashType',

  // Name of the logging level that will be used for the transport, if not specified option from createLogger method will be used
  // transport使用的日志级别名称, 如果未被定义, 则使用createLogger函数的option
  'level',
]
