class WebMetricsCollector {
  constructor(store, utilizationTracker = null, collectorName = 'Web', config = {}) {
    this.collectorName = collectorName
    this.store = store
    this.utilizationTracker = utilizationTracker
    this.config = config
  }

  collect() {
    if (this.utilizationTracker && this.utilizationTracker.isStarted) {
      const utilizationPct = this.utilizationTracker.utilizationPct()
      this.store.push('up', utilizationPct)
    }

    return this.store.flush()
  }
}

module.exports = WebMetricsCollector
