/* global test, expect, describe */

const { Api, defaultConfig, logger, Metric, MetricsStore, Report, Reporter } = require('../index')

describe('exports', () => {
  test('Api', () => {
    expect(Api).toBeDefined()
  })

  test('defaultConfig', () => {
    expect(defaultConfig).toBeDefined()
  })

  test('logger', () => {
    expect(logger).toBeDefined()
  })

  test('Metric', () => {
    expect(Metric).toBeDefined()
  })

  test('MetricStore', () => {
    expect(MetricsStore).toBeDefined()
  })

  test('Report', () => {
    expect(Report).toBeDefined()
  })

  test('Reporter', () => {
    expect(Reporter).toBeDefined()
  })
})
