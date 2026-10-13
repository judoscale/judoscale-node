/* global test, expect, describe */

const EventEmitter = require('events')
const onResponseSettled = require('../src/on-response-settled')

describe('onResponseSettled', () => {
  test('invokes the callback once on finish', () => {
    const res = new EventEmitter()
    const reasons = []

    onResponseSettled(res, (reason) => reasons.push(reason))

    res.emit('finish')
    res.emit('close')

    expect(reasons).toEqual(['finish'])
  })

  test('invokes the callback once on close when finish never fires', () => {
    const res = new EventEmitter()
    const reasons = []

    onResponseSettled(res, (reason) => reasons.push(reason))

    res.emit('close')
    res.emit('close')

    expect(reasons).toEqual(['close'])
  })
})
