/* global test, expect, describe */

const MetricsStore = require('../src/metrics-store')

const store = new MetricsStore()

describe('constructor', () => {
  test('metrics property as an empty Array', () => {
    expect(store.metrics).toEqual([])
  })

  test('flushedAt property as Date/Time object', () => {
    expect(store.flushedAt).toBeInstanceOf(Date)
  })
})

describe('push', () => {
  test('pushes new Metric instance to metrics', () => {
    const metricsLength = store.metrics.length

    store.push('id', 10)

    expect(store.metrics.length).toBeGreaterThan(metricsLength)
  })

  test('Metric instance is built with function args', () => {
    store.push('arg_id', 100)

    expect(store.metrics[store.metrics.length - 1].identifier).toEqual('arg_id')
    expect(store.metrics[store.metrics.length - 1].value).toEqual(100)
  })

  test('Wont push new metrics after 2 minutes unflushed', () => {
    store.push('id', 10)

    const metricsLength = store.metrics.length

    store.flushedAt = new Date(store.flushedAt - 130000)

    store.push('id', 10)

    expect(store.metrics.length).not.toBeGreaterThan(metricsLength)
  })
})

describe('flush', () => {
  const lastFlush = store.flushedAt
  const lastMetrics = store.metrics

  test('Returns stored metrics up to this point', () => {
    expect(store.flush()).toEqual(expect.arrayContaining(lastMetrics))
  })

  test('Sets flushedAt to the current time', () => {
    expect(store.flushedAt.getTime()).toBeGreaterThan(lastFlush.getTime())
  })

  test('Clear all stored metrics', () => {
    expect(store.metrics).toEqual([])
  })
})

describe('clear', () => {
  test('Clear all stored metrics', () => {
    store.push('id', 10)

    store.clear()

    expect(store.metrics).toEqual([])
  })
})
