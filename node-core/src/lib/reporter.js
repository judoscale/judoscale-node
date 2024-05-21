import Api from './api'
import Report from './report'
import forever from 'async/forever'

class Reporter {
  constructor() {
    this.started = this.hasStarted() || false
  }

  start(config, adapters) {
    if (!this.hasStarted()) {
      this.started = true

      if (!config.api_base_url) {
        config.logger.info(`[Judoscale] Reporter not started: JUDOSCALE_URL is not set`)
        return
      }

      const adapterMsg = adapters.map((a) => a.identifier).join(', ')

      config.logger.info(
        `[Judoscale] Reporter starting, will report every ${config.report_interval_seconds} seconds. Adapters: [${adapterMsg}]`
      )

      this.report(adapters, config)

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
    const collectors = adapters.map((a) => a.collector)
    const metrics = (await Promise.all(collectors.map((collector) => collector.collect()))).flat()
    const report = new Report(adapters, config, metrics)
    config.logger.info(`[Judoscale] Reporting ${report.metrics.length} metrics`)

    new Api(config).reportMetrics(report.payload()).then(async () => {
      config.logger.debug('[Judoscale] Reported successfully')
    })
  }
}

export default Reporter
