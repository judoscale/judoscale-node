const EmailClient = require('./email-client')
const welcomeEmail = require('./emails/welcome')
const lostEmail = require('./emails/lost')

class LifecycleEmails {
  constructor({ apiToken, fromAddress, messageStream }) {
    if (!apiToken) throw new Error('apiToken is required')
    if (!fromAddress) throw new Error('fromAddress is required')

    this.client = new EmailClient({ apiToken, fromAddress, messageStream })
  }

  async sendWelcomeEmail({ email, name }) {
    const { subject, htmlBody } = welcomeEmail({ name })

    return this.client.send({
      to: email,
      subject,
      htmlBody,
    })
  }

  async sendLostEmail({ email, name }) {
    const { subject, htmlBody } = lostEmail({ name })

    return this.client.send({
      to: email,
      subject,
      htmlBody,
    })
  }

  // @deprecated Use sendLostEmail instead
  async sendChurnEmail({ email, name }) {
    return this.sendLostEmail({ email, name })
  }
}

module.exports = LifecycleEmails
