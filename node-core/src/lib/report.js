/**
 * @param {Object} config - Client settings
 * @param {Array[Metric]} metrics - Metrics collected
 */
class Report {
  constructor(adapter, config, metrics = []) {
    this.adapter = adapter
    this.config = config
    this.metrics = metrics
  }

  payload() {
    return {
      dyno: this.config.dyno,
      pid: process.pid,
      // TODO: this.config.asJson()
      config: {},
      adapters: this.adapter.asJson(),
      metrics: this.metrics.map((metric) => [
        metric.time.getTime() / 1000,
        metric.value,
        metric.identifier,
        metric.queueName,
      ]),
    }
  }
}

export default Report
