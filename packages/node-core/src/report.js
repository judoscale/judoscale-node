class Report {
  constructor(adapters, config, metrics = []) {
    this.adapters = adapters
    this.config = config
    this.metrics = metrics
  }

  payload() {
    const adapterMetadata = {}
    for (const adapter of this.adapters) {
      adapterMetadata[adapter.identifier] = adapter.meta || {}
    }

    return {
      container: this.config.container,
      pid: process.pid,
      adapters: adapterMetadata,
      config: {
        version: this.config.version,
        container: this.config.container,
        log_level: this.config.log_level,
      },
      metrics: this.metrics.map((metric) => [
        metric.time.getTime() / 1000,
        metric.value,
        metric.identifier,
        metric.queueName,
      ]),
    }
  }
}

module.exports = Report
