const mergeConfig = require('./merge-config')
const Reporter = require('./reporter')

class Judoscale {
  static adapters = []

  constructor(options) {
    this.config = mergeConfig(options)
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
