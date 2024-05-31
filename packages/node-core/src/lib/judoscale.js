const getLogger = require('./logger')
const defaultConfig = require('./default-config')
const Reporter = require('./reporter')

class Judoscale {
  static adapters = []

  constructor(options) {
    this.config = { ...defaultConfig(), ...options }
    if (!this.config.logger) this.config.logger = getLogger(this.config.log_level)

    const reporter = new Reporter()

    reporter.start(this.config, Judoscale.adapters)
  }

  static registerAdapter(identifier, collector, meta = {}) {
    Judoscale.adapters.push({
      identifier,
      collector,
      meta,
    })
  }
}

module.exports = Judoscale
