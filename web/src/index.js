import requestMetrics from './lib/request-metrics'
import defaultConfig from './lib/default-config'
import MetricStore from './lib/metrics-store'
import Reporter from './lib/reporter'
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

  const store = new MetricStore()
  const reporter = new Reporter()

  reporter.start(finalConfig, store)

  return ({ headers }, _res, next) => {
    const now = finalConfig.now || new Date()
    const queueTime = requestMetrics.queueTimeFromHeaders(headers, now)

    if (queueTime) {
      store.push('qt', queueTime)
    }

    next()
  }
}
