/* global test, expect, describe, jest */

const WebMetricsCollector = require('../src/web-metrics-collector')
const MetricsStore = require('../src/metrics-store')
const { UtilizationTracker } = require('../src')

const store = new MetricsStore()
const collector = new WebMetricsCollector(store)

describe('constructor', () => {
  test('collectorName property', () => {
    expect(collector.collectorName).toEqual('Web')
  })

  test('store property', () => {
    expect(collector.store).toEqual(store)
  })
})

describe('collect', () => {
  test('Returns the flush() return', () => {
    expect(collector.collect()).toEqual([])
  })

  test('Adds utilization pct metric when given utilization tracker', () => {
    collector.utilizationTracker = {isStarted: false, utilizationPct: () => 10}

    expect(collector.collect().length).toBe(0)

    collector.utilizationTracker.isStarted = true

    const metrics = collector.collect()
    expect(metrics.length).toEqual(1)
    expect(metrics[0].identifier).toEqual('up')
    expect(metrics[0].value).toEqual(10)
  })
})
