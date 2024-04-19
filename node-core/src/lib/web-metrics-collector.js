/**
 * @param {String} collector_name - The collector's name
 */
class WebMetricsCollector {
  constructor(store, collectorName = 'Web') {
    this.collectorName = collectorName
    this.store = store
  }

  collect() {
    return this.store.flush()
  }
}

export default WebMetricsCollector
