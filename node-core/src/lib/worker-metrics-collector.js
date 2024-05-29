class WorkerMetricsCollector {
  constructor(collectorName) {
    this.collectorName = collectorName
  }

  collect() {
    throw new Error('Define collect() in subclass')
  }
}

module.exports = WorkerMetricsCollector
