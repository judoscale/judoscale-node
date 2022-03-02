const assert = require('assert')
const judoscale = require('..')

module.exports = {
  logRequestQueueTime: function () {
    // request started 100ms before now
    const now = new Date('2012-12-12T12:12:12.012Z')
    const requestStart = new Date(now - 100).getTime().toString()
    const req = { headers: { 'x-request-start': requestStart } }
    const res = {}
    const next = function () {}
    const logger = new Logger()
    const _judoscale = judoscale({
      log: logger.log.bind(logger),
      now: now
    })

    _judoscale(req, res, next)

    assert.equal(logger.msgs[0], '[judoscale] queued=100')
  },

  noLoggingWithMissingHeader: function () {
    const req = { headers: {} }
    const res = {}
    const next = function () {}
    const logger = new Logger()
    const _judoscale = judoscale({ log: logger.log.bind(logger) })

    _judoscale(req, res, next)

    assert.equal(logger.msgs[0], null)
  }
}

class Logger {
  constructor () {
    this.msgs = []
  }

  log (msg) {
    this.msgs.push(msg)
  }
}
