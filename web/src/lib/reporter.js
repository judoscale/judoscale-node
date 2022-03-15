import WebMetricsCollector from './web-metrics-collector'
import Registration from './registration'
import Api from './api'
import Report from './report'
import forever from 'async/forever'

class Reporter {
  constructor() {
    this.started = this.hasStarted() || false
    this.registered = this.isRegistered() || false
  }

  start(config, store) {
    if (!this.hasStarted()) {
      this.started = true
      const collectors = [new WebMetricsCollector(store)]

      forever(async (next) => {
        if (!this.isRegistered()) {
          await this.register(config, collectors)
        }

        const interval = (1 - (Math.random() / 4)) * 10000

        await setTimeout(() => {
          const metrics = collectors.map((collector) => collector.collect()).flat()

          this.report(config, metrics)

          next()
        }, interval)
      })
    }
  }

  stop() {
    this.registered = false
    this.started = false
  }

  isRegistered() {
    return this.registered
  }

  hasStarted() {
    return this.started
  }

  async register(config, collectors) {
    const registration = new Registration(collectors)
    await new Api(config).registerReporter(registration.asJson()).then(async () => {
      this.registered = true
      // const collectorsMsg = collectors.map((collector) => collector.collectorName).join(',')

      // config.log(`Reporter starting, Metrics collectors: [${collectorsMsg}]`)
    })
  }

  async report(config, metrics) {
    const report = new Report(config, metrics)
    // config.log(`Reporting ${report.metrics.length} metrics`)

    await new Api(config).reportMetrics(report.payload()).then(async () => {
      // config.log('Reported successfully')
    })
  }
}

export default Reporter
