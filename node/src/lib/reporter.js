import Api from './api'
import Report from './report'
import forever from 'async/forever'

class Reporter {
  constructor() {
    this.started = this.hasStarted() || false
  }

  start(config, store, collectors, adapter) {
    if (!this.hasStarted()) {
      this.started = true

      const adapter = new adapter(collectors)
      const adapterMsg = adapter.identifier

      config
        .logger
        .info(`Reporter starting, will report every ${config.report_interval_seconds} seconds or so. Adapters: [${adapterMsg}]`)

      forever(async (next) => {
        const interval = (1 - (Math.random() / 4)) * (config.report_interval_seconds * 1000)

        await setTimeout(() => {
          const metrics = collectors.map((collector) => collector.collect()).flat()

          this.report(adapter, config, metrics)

          next()
        }, interval)
      })
    }
  }

  stop() {
    this.started = false
  }

  hasStarted() {
    return this.started
  }

  async report(adapter, config, metrics) {
    const report = new Report(adapter, config, metrics)
    config.logger.info(`Reporting ${report.metrics.length} metrics`)

    await new Api(config).reportMetrics(report.payload()).then(async () => {
      config.logger.info('Reported successfully')
    })
  }
}

export default Reporter
