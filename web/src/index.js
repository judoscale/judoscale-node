import requestMetrics from './lib/request-metrics'
import defaultConfig from './lib/default-config'

/**
 * Construct a middleware function for logging request queue time in whole milliseconds.
 * Log output looks like: [judoscale] queued=123
 *
 * @param {object} config - optional configuration
 *    config.log {function} - this function will be called with the queue time message
 *    config.now {Date} - represents the current time, used for testing
 *    config.prefix {string} - prefix log output (default "[judoscale] ")
 * @returns {function} - HTTP middleware
 */
export default (config) => {
  const finalConfig = { ...defaultConfig, ...config }

  return ({ headers }, _res, next) => {
    const now = finalConfig.now || new Date()
    const queued = requestMetrics.queueTimeFromHeaders(headers, now)

    if (finalConfig.log && queued) {
      finalConfig.log(`${finalConfig.prefix}queued=${Math.round(queued)}`)
    }

    next()
  }
}
