/* global test, expect, describe */

const { LostTrigger, HEROKU_ADDON_PLATFORM } = require('../../src/triggers/lost-trigger')

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function buildTeam(overrides = {}) {
  return {
    lostAt: null,
    platform: HEROKU_ADDON_PLATFORM,
    users: [{ email: 'user@example.com', name: 'Test User', lastLoginAt: daysAgo(5) }],
    ownerEmail: 'owner@example.com',
    ...overrides,
  }
}

describe('LostTrigger', () => {
  describe('shouldFire', () => {
    test('fires when lostAt is set and platform is heroku', () => {
      const trigger = new LostTrigger({
        team: buildTeam({ lostAt: daysAgo(1) }),
      })

      expect(trigger.shouldFire()).toBe(true)
    })

    test('does not fire when lostAt is null', () => {
      const trigger = new LostTrigger({
        team: buildTeam({ lostAt: null }),
      })

      expect(trigger.shouldFire()).toBe(false)
    })

    test('does not fire when platform is not heroku', () => {
      const trigger = new LostTrigger({
        team: buildTeam({ lostAt: daysAgo(1), platform: 'render' }),
      })

      expect(trigger.shouldFire()).toBe(false)
    })

    test('does not fire for heroku_direct platform', () => {
      const trigger = new LostTrigger({
        team: buildTeam({ lostAt: daysAgo(1), platform: 'heroku_direct' }),
      })

      expect(trigger.shouldFire()).toBe(false)
    })

    test('does not fire when both lostAt is null and platform is wrong', () => {
      const trigger = new LostTrigger({
        team: buildTeam({ lostAt: null, platform: 'render' }),
      })

      expect(trigger.shouldFire()).toBe(false)
    })
  })

  describe('recipients', () => {
    test('returns team email recipients when trigger should fire', () => {
      const trigger = new LostTrigger({
        team: buildTeam({ lostAt: daysAgo(1) }),
      })

      const recipients = trigger.recipients()

      expect(recipients).toEqual([{ email: 'user@example.com', name: 'Test User' }])
    })

    test('returns empty array when trigger should not fire', () => {
      const trigger = new LostTrigger({
        team: buildTeam({ lostAt: null }),
      })

      expect(trigger.recipients()).toEqual([])
    })

    test('resolves recipients across multiple users on the team', () => {
      const trigger = new LostTrigger({
        team: buildTeam({
          lostAt: daysAgo(1),
          users: [
            { email: 'a@example.com', name: 'Alice', lastLoginAt: daysAgo(10) },
            { email: 'b@example.com', name: 'Bob', lastLoginAt: daysAgo(20) },
          ],
        }),
      })

      const recipients = trigger.recipients()

      expect(recipients).toHaveLength(2)
      expect(recipients).toEqual([
        { email: 'a@example.com', name: 'Alice' },
        { email: 'b@example.com', name: 'Bob' },
      ])
    })

    test('falls back to owner email when no users are active', () => {
      const trigger = new LostTrigger({
        team: buildTeam({
          lostAt: daysAgo(1),
          users: [],
          ownerEmail: 'owner@example.com',
        }),
      })

      const recipients = trigger.recipients()

      expect(recipients).toEqual([{ email: 'owner@example.com', name: null }])
    })
  })
})
