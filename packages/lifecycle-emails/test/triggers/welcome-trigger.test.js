/* global test, expect, describe */

const { WelcomeTrigger } = require('../../src/triggers/welcome-trigger')

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function buildTeam(overrides = {}) {
  return {
    provisionedAt: daysAgo(0),
    welcomeEmailSent: false,
    users: [{ email: 'user@example.com', name: 'Test User', lastLoginAt: daysAgo(0) }],
    ownerEmail: 'owner@example.com',
    ...overrides,
  }
}

describe('WelcomeTrigger', () => {
  describe('shouldFire', () => {
    test('fires when team is provisioned and welcome email has not been sent', () => {
      const trigger = new WelcomeTrigger({ team: buildTeam() })

      expect(trigger.shouldFire()).toBe(true)
    })

    test('does not fire when welcome email was already sent', () => {
      const trigger = new WelcomeTrigger({
        team: buildTeam({ welcomeEmailSent: true }),
      })

      expect(trigger.shouldFire()).toBe(false)
    })

    test('does not fire when team is not provisioned', () => {
      const trigger = new WelcomeTrigger({
        team: buildTeam({ provisionedAt: null }),
      })

      expect(trigger.shouldFire()).toBe(false)
    })

    test('does not fire when team has no provisionedAt and email already sent', () => {
      const trigger = new WelcomeTrigger({
        team: buildTeam({ provisionedAt: null, welcomeEmailSent: true }),
      })

      expect(trigger.shouldFire()).toBe(false)
    })
  })

  describe('recipients', () => {
    test('returns team email recipients when trigger should fire', () => {
      const trigger = new WelcomeTrigger({ team: buildTeam() })

      const recipients = trigger.recipients()

      expect(recipients).toEqual([{ email: 'user@example.com', name: 'Test User' }])
    })

    test('returns empty array when trigger should not fire', () => {
      const trigger = new WelcomeTrigger({
        team: buildTeam({ welcomeEmailSent: true }),
      })

      expect(trigger.recipients()).toEqual([])
    })

    test('falls back to owner email when no users', () => {
      const trigger = new WelcomeTrigger({
        team: buildTeam({ users: [] }),
      })

      const recipients = trigger.recipients()

      expect(recipients).toEqual([{ email: 'owner@example.com', name: null }])
    })
  })
})
