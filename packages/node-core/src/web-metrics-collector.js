class WebMetricsCollector {
  constructor(store, collectorName = 'Web') {
    this.collectorName = collectorName
    this.store = store
  }

  collect() {
    return this.store.flush()
  }
}

module.exports = WebMetricsCollector
