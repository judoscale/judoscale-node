const getLogger = require('./logger')
const packageInfo = require('../../package.json')

module.exports = function () {
  const defaultLogLevel = process.env.JUDOSCALE_LOG_LEVEL || 'info'

  let apiBaseUrl = process.env.JUDOSCALE_URL
  let containerID = process.env.DYNO

  if (process.env.RENDER_INSTANCE_ID) {
    containerID = process.env.RENDER_INSTANCE_ID.replace(process.env.RENDER_SERVICE_ID, '').replace('-', '')
    apiBaseUrl = `https://adapter.judoscale.com/api/${process.env.RENDER_SERVICE_ID}`
  }

  if (process.env.ECS_CONTAINER_METADATA_URI) {
    const parts = process.env.ECS_CONTAINER_METADATA_URI.split('/')
    containerID = parts[parts.length - 1]
  }

  return {
    version: packageInfo.version,
    api_base_url: apiBaseUrl,
    log_level: defaultLogLevel,
    container: containerID,
    report_interval_seconds: 10,
    now: null,
    logger: getLogger(defaultLogLevel),
  }
}
