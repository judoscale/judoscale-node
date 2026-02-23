/* global test, expect, describe, jest, beforeEach */

const LifecycleEmails = require('../src/lifecycle-emails')
const EmailClient = require('../src/email-client')

jest.mock('../src/email-client')

beforeEach(() => {
  EmailClient.mockClear()
})

function buildEmails() {
  return new LifecycleEmails({
    apiToken: 'test-token',
    fromAddress: 'hello@judoscale.com',
  })
}

describe('constructor', () => {
  test('throws if apiToken is missing', () => {
    expect(() => new LifecycleEmails({ fromAddress: 'a@b.com' })).toThrow('apiToken is required')
  })

  test('throws if fromAddress is missing', () => {
    expect(() => new LifecycleEmails({ apiToken: 'tok' })).toThrow('fromAddress is required')
  })

  test('creates an EmailClient with the given config', () => {
    buildEmails()

    expect(EmailClient).toHaveBeenCalledWith({
      apiToken: 'test-token',
      fromAddress: 'hello@judoscale.com',
      messageStream: undefined,
    })
  })

  test('passes messageStream to EmailClient', () => {
    new LifecycleEmails({
      apiToken: 'test-token',
      fromAddress: 'hello@judoscale.com',
      messageStream: 'custom-stream',
    })

    expect(EmailClient).toHaveBeenCalledWith({
      apiToken: 'test-token',
      fromAddress: 'hello@judoscale.com',
      messageStream: 'custom-stream',
    })
  })
})

describe('sendWelcomeEmail', () => {
  test('sends a welcome email to the given address', async () => {
    const emails = buildEmails()
    const mockSend = jest.fn().mockResolvedValue({ MessageID: '123' })
    emails.client.send = mockSend

    await emails.sendWelcomeEmail({ email: 'user@example.com', name: 'Jane Doe' })

    expect(mockSend).toHaveBeenCalledTimes(1)

    const call = mockSend.mock.calls[0][0]
    expect(call.to).toBe('user@example.com')
    expect(call.subject).toBe('Welcome to Judoscale!')
    expect(call.htmlBody).toContain('Hey Jane')
    expect(call.htmlBody).toContain('Welcome to Judoscale')
  })

  test('uses fallback greeting when name is not provided', async () => {
    const emails = buildEmails()
    const mockSend = jest.fn().mockResolvedValue({})
    emails.client.send = mockSend

    await emails.sendWelcomeEmail({ email: 'user@example.com' })

    const call = mockSend.mock.calls[0][0]
    expect(call.htmlBody).toContain('Hey there')
  })
})

describe('sendLostEmail', () => {
  test('sends a lost email to the given address', async () => {
    const emails = buildEmails()
    const mockSend = jest.fn().mockResolvedValue({ MessageID: '456' })
    emails.client.send = mockSend

    await emails.sendLostEmail({ email: 'user@example.com', name: 'John Smith' })

    expect(mockSend).toHaveBeenCalledTimes(1)

    const call = mockSend.mock.calls[0][0]
    expect(call.to).toBe('user@example.com')
    expect(call.subject).toBe("We're sorry to see you go")
    expect(call.htmlBody).toContain('Hey John')
    expect(call.htmlBody).toContain('canceled')
  })

  test('uses fallback greeting when name is not provided', async () => {
    const emails = buildEmails()
    const mockSend = jest.fn().mockResolvedValue({})
    emails.client.send = mockSend

    await emails.sendLostEmail({ email: 'user@example.com' })

    const call = mockSend.mock.calls[0][0]
    expect(call.htmlBody).toContain('Hey there')
  })
})

describe('sendChurnEmail (deprecated)', () => {
  test('delegates to sendLostEmail', async () => {
    const emails = buildEmails()
    const mockSend = jest.fn().mockResolvedValue({ MessageID: '789' })
    emails.client.send = mockSend

    await emails.sendChurnEmail({ email: 'user@example.com', name: 'Jane' })

    expect(mockSend).toHaveBeenCalledTimes(1)
    const call = mockSend.mock.calls[0][0]
    expect(call.to).toBe('user@example.com')
    expect(call.subject).toBe("We're sorry to see you go")
  })
})
