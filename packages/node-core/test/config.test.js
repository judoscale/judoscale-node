/* global test, expect, describe, jest */

const Config = require('../src/config')
const Platform = require('../src/platform')

describe('Config', () => {
  beforeEach(() => {
    delete process.env.JUDOSCALE_URL
    delete process.env.JUDOSCALE_LOG_LEVEL
    delete process.env.JUDOSCALE_CONTAINER
    delete process.env.DYNO
    delete process.env.RENDER_INSTANCE_ID
    delete process.env.RENDER_SERVICE_ID
    delete process.env.ECS_CONTAINER_METADATA_URI
    delete process.env.FLY_MACHINE_ID
    delete process.env.RAILWAY_REPLICA_ID
    delete process.env.CONTAINER
  })

  test('has logger property', () => {
    expect(new Config()).toHaveProperty('logger')
  })

  test('has log_level property that can be overridden via JUDOSCALE_LOG_LEVEL', () => {
    expect(new Config()).toHaveProperty('log_level', 'info')

    process.env.JUDOSCALE_LOG_LEVEL = 'warn'
    expect(new Config()).toHaveProperty('log_level', 'warn')
  })

  test('has api_base_url property', () => {
    process.env.JUDOSCALE_URL = 'HO HO HO'
    expect(new Config()).toHaveProperty('api_base_url', 'HO HO HO')
  })

  test('detects the Render platform and strips the service id prefix from the container', () => {
    process.env.RENDER_INSTANCE_ID = 'renderServiceId-renderInstanceId'
    process.env.RENDER_SERVICE_ID = 'renderServiceId'

    const config = new Config()
    expect(config.platform).toBeInstanceOf(Platform.Render)
    expect(config.platform.container).toEqual('renderInstanceId')
  })

  test('detects the ECS platform and container', () => {
    process.env.ECS_CONTAINER_METADATA_URI = 'ecs-service/container-id'
    const config = new Config()
    expect(config.platform).toBeInstanceOf(Platform.Ecs)
    expect(config.platform.container).toEqual('container-id')
  })

  test('detects the Heroku platform and container', () => {
    process.env.DYNO = 'web.123'
    const config = new Config()
    expect(config.platform).toBeInstanceOf(Platform.Heroku)
    expect(config.platform.container).toEqual('web.123')
  })

  test('detects the Fly platform and container', () => {
    process.env.FLY_MACHINE_ID = 'random-machine-id'
    const config = new Config()
    expect(config.platform).toBeInstanceOf(Platform.Fly)
    expect(config.platform.container).toEqual('random-machine-id')
  })

  test('detects the Railway platform and container', () => {
    process.env.RAILWAY_REPLICA_ID = 'random-replica-uuid'
    const config = new Config()
    expect(config.platform).toBeInstanceOf(Platform.Railway)
    expect(config.platform.container).toEqual('random-replica-uuid')
  })

  test('detects the Scalingo platform and container', () => {
    process.env.CONTAINER = 'web-1'
    const config = new Config()
    expect(config.platform).toBeInstanceOf(Platform.Scalingo)
    expect(config.platform.container).toEqual('web-1')
  })

  test('detects a custom platform via JUDOSCALE_CONTAINER', () => {
    process.env.JUDOSCALE_CONTAINER = 'custom-container-id'
    const config = new Config()
    expect(config.platform).toBeInstanceOf(Platform.Custom)
    expect(config.platform.container).toEqual('custom-container-id')
  })

  test('JUDOSCALE_CONTAINER takes priority over platform-specific env vars', () => {
    process.env.JUDOSCALE_CONTAINER = 'custom-container-id'
    process.env.DYNO = 'web.123'
    process.env.FLY_MACHINE_ID = 'fly-machine-id'
    const config = new Config()
    expect(config.platform).toBeInstanceOf(Platform.Custom)
    expect(config.platform.container).toEqual('custom-container-id')
  })

  test('has version property', () => {
    expect(new Config().version).toMatch(/\d+\.\d+\.\d+/)
  })

  test('has report_interval_seconds property', () => {
    expect(new Config()).toHaveProperty('report_interval_seconds', 10)
  })
})
