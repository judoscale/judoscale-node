class WorkerMetricsCollector {
  constructor(collectorName, config = {}) {
    this.collectorName = collectorName
    this.config = config
  }

  collect() {
    throw new Error('Define collect() in subclass')
  }
}

module.exports = WorkerMetricsCollector
