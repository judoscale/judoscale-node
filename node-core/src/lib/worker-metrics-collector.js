/**
 * @param {String} collector_name - The collector's name
 */
class WorkerMetricsCollector {
  constructor(collectorName) {
    this.collectorName = collectorName
  }

  collect() {
    throw new Error('Define collect() in subclass')
  }
}

export default WorkerMetricsCollector
