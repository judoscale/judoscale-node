/* global test, expect, describe, jest */

import defaultConfig from '../lib/default-config'
import logger from '../lib/logger'

jest.mock('../lib/logger')

describe('defaultConfig', () => {
  test('has logger property', () => {
    expect(defaultConfig).toHaveProperty('logger')
  })

  test('has log property', () => {
    expect(defaultConfig).toHaveProperty('log')
  })

  test('has prefix property', () => {
    expect(defaultConfig).toHaveProperty('prefix', '[judoscale] ')
  })

  test('has now property', () => {
    expect(defaultConfig).toHaveProperty('now', null)
  })

  test('has api_base_url property', () => {
    expect(defaultConfig).toHaveProperty('api_base_url', process.env.JUDOSCALE_URL)
  })

  test('has dyno property', () => {
    expect(defaultConfig).toHaveProperty('dyno', process.env.DYNO)
  })

  test('has version property', () => {
    expect(defaultConfig).toHaveProperty('version', '1.0.3')
  })

  test('has report_interval_seconds property', () => {
    expect(defaultConfig).toHaveProperty('report_interval_seconds', 10)
  })

  test('log property wraps logger log()', () => {
    defaultConfig.log('log')
    expect(logger.log).toHaveBeenCalledWith({ level: 'debug', message: 'log' })
  })
})
