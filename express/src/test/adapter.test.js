/* global test, expect, describe */

import { defaultConfig } from 'judoscale-node-core'
import Adapter from '../lib/adapter'

const collectors = [{ a: 'collector' }]
const adapter = new Adapter(collectors)

describe('constructor', () => {
  test('collectors property', () => {
    expect(adapter.collectors).toEqual(collectors)
  })

  test('identifier property', () => {
    expect(adapter.identifier).toEqual('judoscale-express')
  })

  test('adapter_version property', () => {
    expect(adapter.adapter_version).toEqual(defaultConfig.version)
  })

  test('language_version property', () => {
    expect(adapter.language_version).toEqual(process.version)
  })
})

describe('asJson', () => {
  const asJson = adapter.asJson()

  test(`${adapter.identifier} as main key`, () => {
    expect(asJson).toHaveProperty(adapter.identifier)
  })

  test('adapter_version with property value', () => {
    expect(asJson).toHaveProperty(`${adapter.identifier}.adapter_version`, adapter.adapter_version)
  })

  test('language_version with property value', () => {
    expect(asJson).toHaveProperty(`${adapter.identifier}.language_version`, adapter.language_version)
  })
})
