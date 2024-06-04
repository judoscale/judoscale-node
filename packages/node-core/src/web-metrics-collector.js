class WebMetricsCollector {
  constructor(store, collectorName = 'Web', config = {}) {
    this.collectorName = collectorName
    this.store = store
    this.config = config
  }

  collect() {
    return this.store.flush()
  }
}

module.exports = WebMetricsCollector
