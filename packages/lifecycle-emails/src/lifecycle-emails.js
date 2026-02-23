const EmailClient = require('./email-client')
const welcomeEmail = require('./emails/welcome')
const churnEmail = require('./emails/churn')

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

  async sendChurnEmail({ email, name }) {
    const { subject, htmlBody } = churnEmail({ name })

    return this.client.send({
      to: email,
      subject,
      htmlBody,
    })
  }
}

module.exports = LifecycleEmails
