/* global test, expect, describe, jest */

const Config = require('../src/config')

describe('Config', () => {
  beforeEach(() => {
    delete process.env.JUDOSCALE_URL
    delete process.env.JUDOSCALE_LOG_LEVEL
    delete process.env.DYNO
    delete process.env.RENDER_INSTANCE_ID
    delete process.env.RENDER_SERVICE_ID
    delete process.env.ECS_CONTAINER_METADATA_URI
    delete process.env.FLY_MACHINE_ID
    delete process.env.RAILWAY_REPLICA_ID
  })

  test('has logger property', () => {
    expect(new Config()).toHaveProperty('logger')
  })

  test('has log_level property that can be overridden via JUDOSCALE_LOG_LEVEL', () => {
    expect(new Config()).toHaveProperty('log_level', 'info')

    process.env.JUDOSCALE_LOG_LEVEL = 'warn'
    expect(new Config()).toHaveProperty('log_level', 'warn')
  })

  test('has now property', () => {
    expect(new Config()).toHaveProperty('now', null)
  })

  test('has api_base_url property', () => {
    process.env.JUDOSCALE_URL = 'HO HO HO'
    expect(new Config()).toHaveProperty('api_base_url', 'HO HO HO')
  })

  test('has api_base_url and container properties for render', () => {
    process.env.RENDER_INSTANCE_ID = 'renderServiceId-renderInstanceId'
    process.env.RENDER_SERVICE_ID = 'renderServiceId'

    expect(new Config()).toHaveProperty('api_base_url', 'https://adapter.judoscale.com/api/renderServiceId')
    expect(new Config()).toHaveProperty('container', 'renderInstanceId')
  })

  test('JUDOSCALE_URL overrides RENDER_INSTANCE_ID for render', () => {
    process.env.JUDOSCALE_URL = 'HO HO HO'
    process.env.RENDER_INSTANCE_ID = 'renderServiceId-renderInstanceId'
    process.env.RENDER_SERVICE_ID = 'renderServiceId'

    expect(new Config()).toHaveProperty('api_base_url', 'HO HO HO')
    expect(new Config()).toHaveProperty('container', 'renderInstanceId')
  })

  test('has container property for ECS', () => {
    process.env.ECS_CONTAINER_METADATA_URI = 'ecs-service/container-id'
    expect(new Config()).toHaveProperty('container', 'container-id')
  })

  test('has container property for Heroku', () => {
    process.env.DYNO = 'web.123'
    expect(new Config()).toHaveProperty('container', 'web.123')
  })

  test('has container property for Fly', () => {
    process.env.FLY_MACHINE_ID = 'random-machine-id'
    expect(new Config()).toHaveProperty('container', 'random-machine-id')
  })

  test('has container property for Railway', () => {
    process.env.RAILWAY_REPLICA_ID = 'random-replica-uuid'
    expect(new Config()).toHaveProperty('container', 'random-replica-uuid')
  })

  test('has version property', () => {
    expect(new Config().version).toMatch(/\d+\.\d+\.\d+/)
  })

  test('has report_interval_seconds property', () => {
    expect(new Config()).toHaveProperty('report_interval_seconds', 10)
  })
})
