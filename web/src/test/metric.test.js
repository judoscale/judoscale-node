/* global test, expect, describe */

import Metric from '../lib/metric'

const identifier = 'some-identifier'
const time = new Date()
const value = '1234'
const metric = new Metric(identifier, time, value)

describe('Metric', () => {
})
