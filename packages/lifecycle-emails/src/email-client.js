const fetch = globalThis.fetch || require('node-fetch')

class EmailClient {
  constructor({ apiToken, fromAddress, messageStream = 'broadcast' }) {
    this.apiToken = apiToken
    this.fromAddress = fromAddress
    this.messageStream = messageStream
  }

  async send({ to, subject, htmlBody }) {
    const response = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': this.apiToken,
      },
      body: JSON.stringify({
        From: this.fromAddress,
        To: to,
        Subject: subject,
        HtmlBody: htmlBody,
        MessageStream: this.messageStream,
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      const body = await response.text()
      throw new Error(`Email send failed (${response.status}): ${body}`)
    }

    return response.json()
  }
}

module.exports = EmailClient
