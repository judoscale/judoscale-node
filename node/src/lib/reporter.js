import Api from './api'
import Report from './report'
import forever from 'async/forever'

class Reporter {
  constructor() {
    this.started = this.hasStarted() || false
  }

  start(config, store, collectors, Adapter) {
    if (!this.hasStarted()) {
      this.started = true

      const adapter = new Adapter(collectors)
      const adapterMsg = adapter.identifier

      config
        .logger
        .info(`[Judoscale] Reporter starting, will report every ${config.report_interval_seconds} seconds. Adapters: [${adapterMsg}]`)

      forever((next) => {
        setTimeout(() => {
          const metrics = collectors.map((collector) => collector.collect()).flat()

          this.report(adapter, config, metrics)

          next()
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

  report(adapter, config, metrics) {
    const report = new Report(adapter, config, metrics)
    config.logger.info(`[Judoscale] Reporting ${report.metrics.length} metrics`)

    new Api(config).reportMetrics(report.payload()).then(async () => {
      config.logger.debug('[Judoscale] Reported successfully')
    })
  }
}

export default Reporter
