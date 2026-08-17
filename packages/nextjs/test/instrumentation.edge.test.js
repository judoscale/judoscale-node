/* global test, expect */

// NEXT_RUNTIME must be set before loading the module under test
process.env.NEXT_RUNTIME = 'edge'

const { register } = require('../src/index')

test('register skips when NEXT_RUNTIME is edge', () => {
  expect(register()).toBeUndefined()
  expect(register()).toBeUndefined()
})
