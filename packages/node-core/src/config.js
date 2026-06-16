const winston = require('winston')
const packageInfo = require('../package.json')
const Platform = require('./platform')

class Config {
  constructor(options = {}) {
    Object.assign(this, getDefaultOptions(), options)
    if (!this.logger) this.logger = getLogger(this.log_level)
  }
}

function getDefaultOptions() {
  const defaultLogLevel = process.env.JUDOSCALE_LOG_LEVEL || 'info'

  return {
    // TODO: camelCase these for internal use, snake_case for reporting
    version: packageInfo.version,
    api_base_url: process.env.JUDOSCALE_URL,
    log_level: defaultLogLevel,
    platform: Platform.detect(process.env),
    report_interval_seconds: 10,
  }
}

function getLogger(level) {
  const logger = winston.createLogger({ level })

  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  )

  return logger
}

module.exports = Config
