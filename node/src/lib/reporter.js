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

      if (!config.api_base_url) {
        config.logger.info(`[Judoscale] Reporter not started: JUDOSCALE_URL is not set`)
        return
      }

      const adapter = new Adapter(collectors)
      const adapterMsg = adapter.identifier

      config.logger.info(
        `[Judoscale] Reporter starting, will report every ${config.report_interval_seconds} seconds. Adapters: [${adapterMsg}]`
      )

      this.report(adapter, config, collectors)

      forever((next) => {
        setTimeout(() => {
          this.report(adapter, config, collectors)

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

  report(adapter, config, collectors) {
    const metrics = collectors.map((collector) => collector.collect()).flat()
    const report = new Report(adapter, config, metrics)
    config.logger.info(`[Judoscale] Reporting ${report.metrics.length} metrics`)

    new Api(config).reportMetrics(report.payload()).then(async () => {
      config.logger.debug('[Judoscale] Reported successfully')
    })
  }
}

export default Reporter
