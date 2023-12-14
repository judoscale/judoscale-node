/* global test, expect, describe, jest */

import defaultConfig from '../lib/default-config'
import logger from '../lib/logger'

jest.mock('../lib/logger')

describe('defaultConfig', () => {
  beforeEach(() => {
    delete process.env.RENDER_INSTANCE_ID
    delete process.env.RENDER_SERVICE_ID
    delete process.env.DYNO
    delete process.env.JUDOSCALE_URL
    delete process.env.ECS_CONTAINER_METADATA_URI
  })

  test('has logger property', () => {
    expect(defaultConfig()).toHaveProperty('logger')
  })

  test('has now property', () => {
    expect(defaultConfig()).toHaveProperty('now', null)
  })

  test('has api_base_url property', () => {
    process.env.JUDOSCALE_URL = 'HO HO HO'
    expect(defaultConfig()).toHaveProperty('api_base_url', 'HO HO HO')
  })

  test('has api_base_url and container properties for render', () => {
    process.env.RENDER_INSTANCE_ID = 'renderServiceId-renderInstanceId'
    process.env.RENDER_SERVICE_ID = 'renderServiceId'

    expect(defaultConfig()).toHaveProperty('api_base_url', 'https://adapter.judoscale.com/api/renderServiceId')
    expect(defaultConfig()).toHaveProperty('container', 'renderInstanceId')
  })

  test('has container property for ECS', () => {
    process.env.ECS_CONTAINER_METADATA_URI = 'ecs-service/container-id'
    expect(defaultConfig()).toHaveProperty('container', 'container-id')
  })

  test('has container property for Heroku', () => {
    process.env.DYNO = 'web.123'
    expect(defaultConfig()).toHaveProperty('container', 'web.123')
  })

  test('has version property', () => {
    expect(defaultConfig()).toHaveProperty('version', '1.1.0')
  })

  test('has report_interval_seconds property', () => {
    expect(defaultConfig()).toHaveProperty('report_interval_seconds', 10)
  })
})
