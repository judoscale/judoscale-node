/**
 * @param {Object} config - Client settings
 * @param {Array[Metric]} metrics - Metrics collected
 */
class Report {
  constructor(adapters, config, metrics = []) {
    this.adapters = adapters
    this.config = config
    this.metrics = metrics
  }

  payload() {
    const adapterMetadata = {}
    for (const adapter of this.adapters) {
      adapterMetadata[adapter.identifier] = {
        adapter_version: adapter.adapter_version,
        language_version: adapter.language_version,
      }
    }

    return {
      container: this.config.container,
      pid: process.pid,
      // Convert logger (DerivedLogger instance) into something sane
      config: { ...this.config, logger: this.config.logger && this.config.logger.constructor.name },
      adapters: adapterMetadata,
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
