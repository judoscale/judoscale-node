const { resolveTeamEmailRecipients } = require('./team-email-recipient')

const HEROKU_ADDON_PLATFORM = 'heroku'

class LostTrigger {
  /**
   * @param {object} options
   * @param {object} options.team - The team object to evaluate
   * @param {string|null} options.team.lostAt - Timestamp when team was marked lost
   * @param {string} options.team.platform - The team's platform (e.g. "heroku", "render", "heroku_direct")
   * @param {Array} [options.team.users] - Users on the team
   * @param {string} [options.team.ownerEmail] - Fallback owner email
   */
  constructor({ team }) {
    this.team = team
  }

  shouldFire() {
    return this._hasLostAt() && this._isHerokuAddon()
  }

  recipients() {
    if (!this.shouldFire()) return []

    return resolveTeamEmailRecipients(this.team)
  }

  _hasLostAt() {
    return Boolean(this.team.lostAt)
  }

  _isHerokuAddon() {
    return this.team.platform === HEROKU_ADDON_PLATFORM
  }
}

module.exports = { LostTrigger, HEROKU_ADDON_PLATFORM }
