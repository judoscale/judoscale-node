import Api from './api'
import Report from './report'
import forever from 'async/forever'

class Reporter {
  constructor() {
    this.started = this.hasStarted() || false
    this.reporting = true
  }

  start(config, store, collectors, Adapter) {
    if (!this.hasStarted()) {
      this.started = true

      const adapter = new Adapter(collectors)
      const adapterMsg = adapter.identifier

      config
        .logger
        .info(`Reporter starting, will report every ${config.report_interval_seconds} seconds or so. Adapters: [${adapterMsg}]`)

      forever((next) => {
        if (this.reporting) {
          config.log('Reporting....')
          this.reporting = false
          setTimeout(() => {
            const metrics = collectors.map((collector) => collector.collect()).flat()

            this.report(adapter, config, metrics)
          }, ((1 - (Math.random() / 4)) * (config.report_interval_seconds * 1000)))
        }

        next()
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
    config.logger.info(`Reporting ${report.metrics.length} metrics`)

    new Api(config).reportMetrics(report.payload()).then(async () => {
      this.reporting = true
      config.logger.info('Reported successfully')
    })
  }
}

export default Reporter
