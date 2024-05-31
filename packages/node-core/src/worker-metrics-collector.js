class WorkerMetricsCollector {
  constructor(collectorName) {
    this.collectorName = collectorName
    this.config = {}
  }

  collect() {
    throw new Error('Define collect() in subclass')
  }
}

module.exports = WorkerMetricsCollector
