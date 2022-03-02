'use strict';

const requestMetrics = require('./lib/request-metrics');
const defaultConfig = require('./lib/default-config');

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
    const queued = requestMetrics.queueTimeFromHeaders(req.headers, now)

    if (config.log && queued) {
      config.log(`${config.prefix}queued=${Math.round(queued)}`)
    }

    next()
  }
}
