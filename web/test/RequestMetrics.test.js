const assert = require('assert')
const RequestMetrics = require('../lib/RequestMetrics')

module.exports = {
  queueTimeFromHeaders: {
    handleHerokuRouterFormat: function () {
      // request started 100ms before now
      const now = new Date('2012-12-12T12:12:12.012Z')
      const requestStart = new Date(now.getTime() - 100).getTime().toString()
      const headers = { 'x-request-start': requestStart }

      const queued = RequestMetrics.queueTimeFromHeaders(headers, now)

      assert.equal(queued, 100)
    },

    handleNginxFormat: function () {
      // request started 100ms before now
      const now = new Date('2012-12-12T12:12:12.012Z')
      const requestStart = `t=${(new Date(now.getTime() - 100).getTime() / 1000).toString()}`
      const headers = { 'x-request-start': requestStart }

      const queued = RequestMetrics.queueTimeFromHeaders(headers, now)

      assert.equal(queued, 100)
    },

    handleNegativeQueueTime: function () {
      // request started 100ms *after* now
      const now = new Date('2012-12-12T12:12:12.012Z')
      const requestStart = new Date(now.getTime() + 100).getTime().toString()
      const headers = { 'x-request-start': requestStart }

      const queued = RequestMetrics.queueTimeFromHeaders(headers, now)

      assert.equal(queued, 0)
    },

    handleMissingHeader: function () {
      const headers = {}

      const queued = RequestMetrics.queueTimeFromHeaders(headers)

      assert.equal(queued, null)
    }
  }
}
