const Config = require('./config')
const Reporter = require('./reporter')

class Judoscale {
  static adapters = []

  constructor(options) {
    this.config = new Config(options)

    // Expose config to the collectors
    for (const adapter of Judoscale.adapters) {
      adapter.collector.config = { ...this.config, ...adapter.collector.config }
    }

    new Reporter().start(this.config, Judoscale.adapters)
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
