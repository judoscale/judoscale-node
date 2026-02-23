/* global test, expect, describe, beforeEach */

const { resolveTeamEmailRecipients } = require('../../src/triggers/team-email-recipient')

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

describe('resolveTeamEmailRecipients', () => {
  describe('when there are active users', () => {
    test('returns all users who logged in within the active threshold', () => {
      const team = {
        users: [
          { email: 'a@example.com', name: 'Alice', lastLoginAt: daysAgo(10) },
          { email: 'b@example.com', name: 'Bob', lastLoginAt: daysAgo(30) },
          { email: 'c@example.com', name: 'Charlie', lastLoginAt: daysAgo(200) },
        ],
        ownerEmail: 'owner@example.com',
      }

      const recipients = resolveTeamEmailRecipients(team)

      expect(recipients).toEqual([
        { email: 'a@example.com', name: 'Alice' },
        { email: 'b@example.com', name: 'Bob' },
      ])
    })

    test('respects a custom activeDays threshold', () => {
      const team = {
        users: [
          { email: 'a@example.com', name: 'Alice', lastLoginAt: daysAgo(10) },
          { email: 'b@example.com', name: 'Bob', lastLoginAt: daysAgo(30) },
        ],
      }

      const recipients = resolveTeamEmailRecipients(team, { activeDays: 20 })

      expect(recipients).toEqual([{ email: 'a@example.com', name: 'Alice' }])
    })
  })

  describe('when there are no active users', () => {
    test('falls back to the most recently signed-in user', () => {
      const team = {
        users: [
          { email: 'old@example.com', name: 'Old User', lastLoginAt: daysAgo(200) },
          { email: 'recent@example.com', name: 'Recent User', lastLoginAt: daysAgo(120) },
        ],
        ownerEmail: 'owner@example.com',
      }

      const recipients = resolveTeamEmailRecipients(team)

      expect(recipients).toEqual([{ email: 'recent@example.com', name: 'Recent User' }])
    })
  })

  describe('when no users have ever logged in', () => {
    test('falls back to the owner email', () => {
      const team = {
        users: [
          { email: 'a@example.com', name: 'Alice' },
          { email: 'b@example.com', name: 'Bob' },
        ],
        ownerEmail: 'owner@example.com',
      }

      const recipients = resolveTeamEmailRecipients(team)

      expect(recipients).toEqual([{ email: 'owner@example.com', name: null }])
    })
  })

  describe('when there are no users at all', () => {
    test('falls back to the owner email', () => {
      const team = {
        users: [],
        ownerEmail: 'owner@example.com',
      }

      const recipients = resolveTeamEmailRecipients(team)

      expect(recipients).toEqual([{ email: 'owner@example.com', name: null }])
    })

    test('returns empty array when no owner email either', () => {
      const team = { users: [] }

      const recipients = resolveTeamEmailRecipients(team)

      expect(recipients).toEqual([])
    })
  })

  describe('when users array is missing', () => {
    test('falls back to owner email', () => {
      const team = { ownerEmail: 'owner@example.com' }

      const recipients = resolveTeamEmailRecipients(team)

      expect(recipients).toEqual([{ email: 'owner@example.com', name: null }])
    })
  })

  describe('user name handling', () => {
    test('returns null for name when user has no name', () => {
      const team = {
        users: [{ email: 'a@example.com', lastLoginAt: daysAgo(5) }],
      }

      const recipients = resolveTeamEmailRecipients(team)

      expect(recipients).toEqual([{ email: 'a@example.com', name: null }])
    })
  })
})
