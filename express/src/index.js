import defaultConfig from 'judoscale-node'
import MetricStore from 'judoscale-node'
import Reporter from 'judoscale-node'
import requestMetrics from './lib/request-metrics'
import WebMetricsCollector from './lib/web-metrics-collector'
import Adapter from './lib/adapter'
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
  const collectors = [new WebMetricsCollector(store)]
  const reporter = new Reporter()

  reporter.start(finalConfig, store, collectors, Adapter)

  return ({ headers }, _res, next) => {
    const now = finalConfig.now || new Date()
    const queueTime = requestMetrics.queueTimeFromHeaders(headers, now)

    if (queueTime) {
      store.push('qt', queueTime)
    }

    next()
  }
}
