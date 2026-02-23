const { resolveTeamEmailRecipients } = require('./team-email-recipient')

class WelcomeTrigger {
  /**
   * @param {object} options
   * @param {object} options.team - The team object to evaluate
   * @param {boolean} [options.team.welcomeEmailSent] - Whether the welcome email was already sent
   * @param {string} [options.team.provisionedAt] - Timestamp when team was provisioned
   * @param {Array} [options.team.users] - Users on the team
   * @param {string} [options.team.ownerEmail] - Fallback owner email
   */
  constructor({ team }) {
    this.team = team
  }

  shouldFire() {
    return this._isProvisioned() && !this._alreadySent()
  }

  recipients() {
    if (!this.shouldFire()) return []

    return resolveTeamEmailRecipients(this.team)
  }

  _isProvisioned() {
    return Boolean(this.team.provisionedAt)
  }

  _alreadySent() {
    return Boolean(this.team.welcomeEmailSent)
  }
}

module.exports = { WelcomeTrigger }
