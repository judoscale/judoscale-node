/* global test, expect, describe */

const MetricsStore = require('../src/metrics-store')
const Platform = require('../src/platform')
const Reporter = require('../src/reporter')
const WebMetricsCollector = require('../src/web-metrics-collector')
const WorkerMetricsCollector = require('../src/worker-metrics-collector')

describe('Reporter', () => {
  const webCollector = new WebMetricsCollector(new MetricsStore())
  const workerCollector = new WorkerMetricsCollector('Worker')
  const adapters = [
    { identifier: 'judoscale-web', collector: webCollector },
    { identifier: 'judoscale-worker', collector: workerCollector }
  ]

  const configFor = (platform) => {
    const logs = []

    return {
      config: {
        api_base_url: 'https://example.com',
        logger: {
          info: (message) => logs.push(message)
        },
        platform,
        report_interval_seconds: 10
      },
      logs
    }
  }

  test('collects web and worker metrics on the primary instance', () => {
    const config = { platform: new Platform.Heroku('web.1') }

    expect(new Reporter().activeCollectors(adapters, config)).toEqual([webCollector, workerCollector])
  })

  test('skips worker metrics on redundant instances', () => {
    const config = { platform: new Platform.Heroku('web.2') }

    expect(new Reporter().activeCollectors(adapters, config)).toEqual([webCollector])
  })

  test.each([
    ['Heroku release', new Platform.Heroku('release.1')],
    ['Heroku', new Platform.Heroku('run.1234')],
    ['Scalingo', new Platform.Scalingo('one-off-1234')]
  ])('does not start in %s ephemeral instances', (_platformName, platform) => {
    const { config, logs } = configFor(platform)
    const reporter = new Reporter()

    reporter.start(config, adapters)

    expect(reporter.hasStarted()).toEqual(false)
    expect(logs).toContain('[Judoscale] Reporter not started: in an ephemeral container')
  })
})
