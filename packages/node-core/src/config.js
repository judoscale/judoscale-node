const winston = require('winston')
const packageInfo = require('../package.json')

class Config {
  constructor(options = {}) {
    Object.assign(this, getDefaultOptions(), options)
    if (!this.logger) this.logger = getLogger(this.log_level)
  }
}

function getDefaultOptions() {
  const defaultLogLevel = process.env.JUDOSCALE_LOG_LEVEL || 'info'

  let apiBaseUrl = process.env.JUDOSCALE_URL
  let containerID

  if (process.env.JUDOSCALE_CONTAINER) {
    containerID = process.env.JUDOSCALE_CONTAINER
  } else if (process.env.DYNO) {
    containerID = process.env.DYNO
  } else if (process.env.RENDER_INSTANCE_ID) {
    apiBaseUrl ||= `https://adapter.judoscale.com/api/${process.env.RENDER_SERVICE_ID}`
    containerID = process.env.RENDER_INSTANCE_ID.replace(`${process.env.RENDER_SERVICE_ID}-`, '')
  } else if (process.env.ECS_CONTAINER_METADATA_URI) {
    const parts = process.env.ECS_CONTAINER_METADATA_URI.split('/')
    containerID = parts[parts.length - 1]
  } else if (process.env.FLY_MACHINE_ID) {
    containerID = process.env.FLY_MACHINE_ID
  } else if (process.env.RAILWAY_REPLICA_ID) {
    containerID = process.env.RAILWAY_REPLICA_ID
  }

  return {
    // TODO: camelCase these for internal use, snake_case for reporting
    version: packageInfo.version,
    api_base_url: apiBaseUrl,
    log_level: defaultLogLevel,
    container: containerID,
    report_interval_seconds: 10,
  }
}

function getLogger(level) {
  const logger = winston.createLogger({ level })

  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  )

  return logger
}

module.exports = Config
