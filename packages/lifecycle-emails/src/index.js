const LifecycleEmails = require('./lifecycle-emails')
const EmailClient = require('./email-client')
const welcomeEmail = require('./emails/welcome')
const churnEmail = require('./emails/churn')

module.exports = {
  LifecycleEmails,
  EmailClient,
  welcomeEmail,
  churnEmail,
}
