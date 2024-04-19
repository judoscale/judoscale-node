/* global test, expect, describe, jest */

import WebMetricsCollector from '../lib/web-metrics-collector'
import MetricsStore from '../lib/metrics-store'

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
