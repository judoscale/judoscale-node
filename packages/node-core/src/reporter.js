const Api = require('./api')
const Report = require('./report')
const WorkerMetricsCollector = require('./worker-metrics-collector')
const forever = require('async/forever')

class Reporter {
  constructor() {
    this.started = this.hasStarted() || false
  }

  start(config, adapters) {
    if (!this.hasStarted()) {
      if (!config.api_base_url) {
        config.logger.info(`[Judoscale] Reporter not started: JUDOSCALE_URL is not set`)
        return
      }

      if (config.platform.ephemeralInstance()) {
        config.logger.info('[Judoscale] Reporter not started: in an ephemeral container')
        return
      }

      this.started = true

      const adapterMsg = adapters.map((a) => a.identifier).join(', ')

      config.logger.info(
        `[Judoscale] Reporter starting, will report every ${config.report_interval_seconds} seconds. Adapters: [${adapterMsg}]`
      )

      forever((next) => {
        setTimeout(() => {
          this.report(adapters, config).then(() => {
            next()
          })
        }, config.report_interval_seconds * 1000)
      })
    }
  }

  stop() {
    this.started = false
  }

  hasStarted() {
    return this.started
  }

  async report(adapters, config) {
    const collectors = this.activeCollectors(adapters, config)
    const metrics = (await Promise.all(collectors.map((collector) => collector.collect()))).flat()
    const report = new Report(adapters, config, metrics)
    config.logger.info(`[Judoscale] Reporting ${report.metrics.length} metrics`)

    new Api(config).reportMetrics(report.payload())
      .then(async () => {
        config.logger.debug('[Judoscale] Reported successfully')
      })
      .catch((error) => {
        config.logger.error('[Judoscale] Error reporting metrics:', error)
      })
  }

  activeCollectors(adapters, config) {
    const collectors = adapters.map((a) => a.collector).filter(Boolean)

    if (config.platform.redundantInstance()) {
      return collectors.filter((collector) => !(collector instanceof WorkerMetricsCollector))
    }

    return collectors
  }
}

module.exports = Reporter
