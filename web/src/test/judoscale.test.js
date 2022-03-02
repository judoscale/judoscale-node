import assert from 'assert'
import judoscale from '..'

class Logger {
  constructor() {
    this.msgs = []
  }

  log(msg) {
    this.msgs.push(msg)
  }
}

export default {
  logRequestQueueTime() {
    // request started 100ms before now
    const now = new Date('2012-12-12T12:12:12.012Z')
    const requestStart = new Date(now - 100).getTime().toString()
    const req = { headers: { 'x-request-start': requestStart } }
    const res = {}
    const next = () => {}
    const logger = new Logger()

    judoscale({
      log: logger.log.bind(logger),
      now
    })(req, res, next)

    assert.equal(logger.msgs[0], '[judoscale] queued=100')
  },

  noLoggingWithMissingHeader() {
    const req = { headers: {} }
    const res = {}
    const next = () => {}
    const logger = new Logger()

    judoscale({ log: logger.log.bind(logger) })(req, res, next)

    assert.equal(logger.msgs[0], null)
  }
}
