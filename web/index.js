const RequestMetrics = require('./lib/RequestMetrics')

const defaultConfig = {
  // use built-in console.log by default
  log: console.log,

  // prefix logs so it's clear where they come from
  prefix: '[judoscale] ',

  // dynamically determine the current time at runtime
  now: null
}

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
module.exports = function (config) {
  if (typeof config !== 'object') config = {}
  config = { ...defaultConfig, ...config }

  return function (req, _res, next) {
    const now = config.now || new Date()
    const queued = RequestMetrics.queueTimeFromHeaders(req.headers, now)

    if (config.log && queued) {
      config.log(`${config.prefix}queued=${Math.round(queued)}`)
    }

    next()
  }
}
