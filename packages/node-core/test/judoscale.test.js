/* global test, expect, describe, jest */

const Judoscale = require('../src/judoscale')

describe('Judoscale', () => {
  test('registering an adapter adds it to static adapters', () => {
    const collector = {}
    Judoscale.registerAdapter('judoscale-test-adapter', collector, { foo: 'bar' })

    expect(Judoscale.adapters.length).toEqual(1)
    expect(Judoscale.adapters[0].identifier).toEqual('judoscale-test-adapter')
    expect(Judoscale.adapters[0].collector).toEqual(collector)
    expect(Judoscale.adapters[0].meta.foo).toEqual('bar')
  })

  test('passes options to config property', () => {
    const judoscale = new Judoscale({ foo: 'bar' })

    expect(judoscale.config.log_level).toEqual('info')
    expect(judoscale.config.foo).toEqual('bar')
  })

  test('exposes config to collectors', () => {
    const collector = {}
    Judoscale.registerAdapter('judoscale-test-adapter', collector, { foo: 'bar' })

    const judoscale = new Judoscale({ foo: 'bar' })

    expect(collector.config.foo).toEqual('bar')
  })
})
