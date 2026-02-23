const LifecycleEmails = require('./lifecycle-emails')
const EmailClient = require('./email-client')
const welcomeEmail = require('./emails/welcome')
const lostEmail = require('./emails/lost')
const { WelcomeTrigger } = require('./triggers/welcome-trigger')
const { LostTrigger } = require('./triggers/lost-trigger')
const { resolveTeamEmailRecipients } = require('./triggers/team-email-recipient')

module.exports = {
  LifecycleEmails,
  EmailClient,
  welcomeEmail,
  lostEmail,
  WelcomeTrigger,
  LostTrigger,
  resolveTeamEmailRecipients,
}
