/* global test, expect, describe, jest, beforeEach */

const EmailClient = require('../src/email-client')
const fetch = require('node-fetch')

jest.mock('node-fetch', () => jest.fn())

beforeEach(() => {
  fetch.mockReset()
})

function buildClient(overrides = {}) {
  return new EmailClient({
    apiToken: 'test-token',
    fromAddress: 'hello@judoscale.com',
    ...overrides,
  })
}

describe('constructor', () => {
  test('stores config', () => {
    const client = buildClient()

    expect(client.apiToken).toBe('test-token')
    expect(client.fromAddress).toBe('hello@judoscale.com')
    expect(client.messageStream).toBe('broadcast')
  })

  test('allows custom messageStream', () => {
    const client = buildClient({ messageStream: 'outbound' })

    expect(client.messageStream).toBe('outbound')
  })
})

describe('send', () => {
  test('posts to Postmark API with correct headers and body', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ MessageID: 'abc-123' }),
    })

    const spy = jest.spyOn(AbortSignal, 'timeout').mockReturnValue('signal-timeout')
    const client = buildClient()

    await client.send({
      to: 'user@example.com',
      subject: 'Test Subject',
      htmlBody: '<p>Hello</p>',
    })

    expect(fetch).toHaveBeenCalledWith('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': 'test-token',
      },
      body: JSON.stringify({
        From: 'hello@judoscale.com',
        To: 'user@example.com',
        Subject: 'Test Subject',
        HtmlBody: '<p>Hello</p>',
        MessageStream: 'broadcast',
      }),
      signal: 'signal-timeout',
    })

    expect(spy).toHaveBeenCalledWith(10000)
    spy.mockRestore()
  })

  test('returns parsed JSON on success', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ MessageID: 'abc-123' }),
    })

    const client = buildClient()
    const result = await client.send({ to: 'a@b.com', subject: 'Hi', htmlBody: '<p>Hi</p>' })

    expect(result).toEqual({ MessageID: 'abc-123' })
  })

  test('throws on non-ok response', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 422,
      text: () => Promise.resolve('Invalid email'),
    })

    const client = buildClient()

    await expect(client.send({ to: 'a@b.com', subject: 'Hi', htmlBody: '<p>Hi</p>' })).rejects.toThrow(
      'Email send failed (422): Invalid email'
    )
  })
})
