/* global test, expect, describe */

const welcomeEmail = require('../src/emails/welcome')
const lostEmail = require('../src/emails/lost')

describe('welcomeEmail', () => {
  test('returns subject and htmlBody', () => {
    const result = welcomeEmail({ name: 'Alice Wonder' })

    expect(result.subject).toBe('Welcome to Judoscale!')
    expect(result.htmlBody).toBeDefined()
  })

  test('uses first name in greeting', () => {
    const result = welcomeEmail({ name: 'Alice Wonder' })

    expect(result.htmlBody).toContain('Hey Alice')
  })

  test('falls back to "there" when no name', () => {
    const result = welcomeEmail({})

    expect(result.htmlBody).toContain('Hey there')
  })

  test('includes key content', () => {
    const result = welcomeEmail({ name: 'Test' })

    expect(result.htmlBody).toContain('Welcome to Judoscale')
    expect(result.htmlBody).toContain('automatically scales')
  })

  test('is valid HTML', () => {
    const result = welcomeEmail({ name: 'Test' })

    expect(result.htmlBody).toContain('<!DOCTYPE html>')
    expect(result.htmlBody).toContain('</html>')
  })
})

describe('lostEmail', () => {
  test('returns subject and htmlBody', () => {
    const result = lostEmail({ name: 'Bob Builder' })

    expect(result.subject).toBe("We're sorry to see you go")
    expect(result.htmlBody).toBeDefined()
  })

  test('uses first name in greeting', () => {
    const result = lostEmail({ name: 'Bob Builder' })

    expect(result.htmlBody).toContain('Hey Bob')
  })

  test('falls back to "there" when no name', () => {
    const result = lostEmail({})

    expect(result.htmlBody).toContain('Hey there')
  })

  test('includes key content', () => {
    const result = lostEmail({ name: 'Test' })

    expect(result.htmlBody).toContain('canceled')
    expect(result.htmlBody).toContain('reactivate')
  })

  test('is valid HTML', () => {
    const result = lostEmail({ name: 'Test' })

    expect(result.htmlBody).toContain('<!DOCTYPE html>')
    expect(result.htmlBody).toContain('</html>')
  })
})
