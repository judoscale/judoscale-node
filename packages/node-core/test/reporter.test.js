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

  test('collects web and worker metrics on the primary instance', () => {
    const config = { platform: new Platform.Heroku('web.1') }

    expect(new Reporter().activeCollectors(adapters, config)).toEqual([webCollector, workerCollector])
  })

  test('skips worker metrics on redundant instances', () => {
    const config = { platform: new Platform.Heroku('web.2') }

    expect(new Reporter().activeCollectors(adapters, config)).toEqual([webCollector])
  })

  test('skips worker metrics on one-off instances', () => {
    const config = { platform: new Platform.Heroku('run.1234') }

    expect(new Reporter().activeCollectors(adapters, config)).toEqual([webCollector])
  })
})
