/* global test, expect, describe, jest */

const WebMetricsCollector = require('../src/web-metrics-collector')
const MetricsStore = require('../src/metrics-store')

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
})
