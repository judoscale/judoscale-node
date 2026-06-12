/* global test, expect, describe */

const Platform = require('../src/platform')

describe('Platform', () => {
  test('detects the platform from environment variables, JUDOSCALE_CONTAINER winning over platform vars', () => {
    expect(Platform.detect({ JUDOSCALE_CONTAINER: 'x', DYNO: 'web.1' })).toBeInstanceOf(Platform.Custom)
    expect(Platform.detect({ DYNO: 'web.1' })).toBeInstanceOf(Platform.Heroku)
    expect(Platform.detect({ RENDER_INSTANCE_ID: 'srv-x-abc', RENDER_SERVICE_ID: 'srv-x' })).toBeInstanceOf(
      Platform.Render
    )
    expect(Platform.detect({ ECS_CONTAINER_METADATA_URI: 'http://169.254.170.2/v3/abc' })).toBeInstanceOf(Platform.Ecs)
    expect(Platform.detect({ FLY_MACHINE_ID: '683d924b322418' })).toBeInstanceOf(Platform.Fly)
    expect(Platform.detect({ RAILWAY_REPLICA_ID: 'f9c88b6e' })).toBeInstanceOf(Platform.Railway)
    expect(Platform.detect({ CONTAINER: 'web-1' })).toBeInstanceOf(Platform.Scalingo)
    expect(Platform.detect({})).toBeInstanceOf(Platform.Unknown)
  })

  test('treats only ordinal instances beyond the first as redundant on Heroku and Scalingo', () => {
    expect(new Platform.Heroku('web.1').redundantInstance()).toEqual(false)
    expect(new Platform.Heroku('web.2').redundantInstance()).toEqual(true)
    expect(new Platform.Scalingo('web-1').redundantInstance()).toEqual(false)
    expect(new Platform.Scalingo('web-2').redundantInstance()).toEqual(true)
    expect(new Platform.Heroku('web.1000').redundantInstance()).toEqual(true)
    expect(new Platform.Scalingo('worker-1024').redundantInstance()).toEqual(true)
  })

  test('never treats opaque-id platforms as redundant', () => {
    expect(new Platform.Render('5497f74465-m5wwr', 'srv-x').redundantInstance()).toEqual(false)
    expect(new Platform.Ecs('a8880ee042bc4db3ba878dce65b769b6-2750272591').redundantInstance()).toEqual(false)
    expect(new Platform.Fly('683d924b322418').redundantInstance()).toEqual(false)
    expect(new Platform.Railway('f9c88b6e-0e96-46f2-9884-ece3bf53d009').redundantInstance()).toEqual(false)
    expect(new Platform.Custom('abcdef-2750272591').redundantInstance()).toEqual(false)
    expect(new Platform.Unknown('').redundantInstance()).toEqual(false)
  })

  test('treats only Heroku release dynos as release instances', () => {
    expect(new Platform.Heroku('release.1').releaseInstance()).toEqual(true)
    expect(new Platform.Heroku('release.2').releaseInstance()).toEqual(true)
    expect(new Platform.Heroku('web.1').releaseInstance()).toEqual(false)
    expect(new Platform.Scalingo('web-1').releaseInstance()).toEqual(false)
    expect(new Platform.Unknown('').releaseInstance()).toEqual(false)
  })

  test('treats Heroku and Scalingo one-off containers as one-off', () => {
    expect(new Platform.Heroku('run.1234').oneOff()).toEqual(true)
    expect(new Platform.Scalingo('one-off-1234').oneOff()).toEqual(true)
  })

  test('does not treat formation containers as one-off', () => {
    expect(new Platform.Heroku('web.1').oneOff()).toEqual(false)
    expect(new Platform.Scalingo('web-1').oneOff()).toEqual(false)
    expect(new Platform.Scalingo('worker-2').oneOff()).toEqual(false)
    expect(new Platform.Heroku('runner-1').oneOff()).toEqual(false)
  })

  test('never treats opaque-id platforms as one-off', () => {
    expect(new Platform.Render('5497f74465-m5wwr', 'srv-x').oneOff()).toEqual(false)
    expect(new Platform.Fly('683d924b322418').oneOff()).toEqual(false)
    expect(new Platform.Unknown('').oneOff()).toEqual(false)
  })

  test('strips the service id prefix from the Render instance id', () => {
    expect(new Platform.Render('srv-x-5497f74465-m5wwr', 'srv-x').container).toEqual('5497f74465-m5wwr')
  })
})
