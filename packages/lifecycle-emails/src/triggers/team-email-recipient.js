/**
 * Resolves email recipients for a team, following this priority:
 *
 * 1. All active users (determined by lastLoginAt within the active threshold)
 * 2. If no active users, the most recently signed-in user
 * 3. If all else fails, the owner email
 */

const DEFAULT_ACTIVE_DAYS = 90

function resolveTeamEmailRecipients(team, { activeDays = DEFAULT_ACTIVE_DAYS } = {}) {
  const users = team.users || []
  const activeThreshold = new Date()
  activeThreshold.setDate(activeThreshold.getDate() - activeDays)

  const activeUsers = users.filter(
    (user) => user.lastLoginAt && new Date(user.lastLoginAt) >= activeThreshold
  )

  if (activeUsers.length > 0) {
    return activeUsers.map(toRecipient)
  }

  const mostRecentUser = findMostRecentlySignedIn(users)
  if (mostRecentUser) {
    return [toRecipient(mostRecentUser)]
  }

  if (team.ownerEmail) {
    return [{ email: team.ownerEmail, name: null }]
  }

  return []
}

function findMostRecentlySignedIn(users) {
  if (users.length === 0) return null

  const usersWithLogin = users.filter((user) => user.lastLoginAt)
  if (usersWithLogin.length === 0) return null

  return usersWithLogin.reduce((latest, user) =>
    new Date(user.lastLoginAt) > new Date(latest.lastLoginAt) ? user : latest
  )
}

function toRecipient(user) {
  return {
    email: user.email,
    name: user.name || null,
  }
}

module.exports = { resolveTeamEmailRecipients, DEFAULT_ACTIVE_DAYS }
