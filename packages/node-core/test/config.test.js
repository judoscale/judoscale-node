/* global test, expect, describe, jest */

const Config = require('../src/config')

describe('Config', () => {
  beforeEach(() => {
    delete process.env.RENDER_INSTANCE_ID
    delete process.env.RENDER_SERVICE_ID
    delete process.env.DYNO
    delete process.env.JUDOSCALE_URL
    delete process.env.ECS_CONTAINER_METADATA_URI
  })

  test('has logger property', () => {
    expect(new Config()).toHaveProperty('logger')
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

  test('has container property for ECS', () => {
    process.env.ECS_CONTAINER_METADATA_URI = 'ecs-service/container-id'
    expect(new Config()).toHaveProperty('container', 'container-id')
  })

  test('has container property for Heroku', () => {
    process.env.DYNO = 'web.123'
    expect(new Config()).toHaveProperty('container', 'web.123')
  })

  test('has version property', () => {
    expect(new Config().version).toMatch(/\d+\.\d+\.\d+/)
  })

  test('has report_interval_seconds property', () => {
    expect(new Config()).toHaveProperty('report_interval_seconds', 10)
  })
})
