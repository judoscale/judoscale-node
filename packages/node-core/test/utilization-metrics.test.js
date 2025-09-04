/* global test, expect, describe, jest */

// Mock to return our controlled monotonic time
const mockMonotonicTime = jest.fn()

jest.mock('process', () => {
  return {
    ...jest.requireActual('process'),
    hrtime: { bigint: mockMonotonicTime }
  }
})

const UtilizationTracker = require('../src/utilization-tracker')

describe('UtilizationTracker', () => {
  // after { reset_tracker_state }

  test('tracks utilization percentage based on time spent with no active requests', () => {
    // T=0:   Start tracker
    // T=1:   Request 1 starts -> total_idle_time=1
    // T=2:   Request 1 ends   -> total_idle_time=1
    // T=4:   Request 2 starts -> total_idle_time=3 (1 + 2)
    // T=5:   Request 3 starts -> total_idle_time=3
    // T=6:   Request 2 ends   -> total_idle_time=3
    // T=8:   Request 3 ends   -> total_idle_time=3
    // T=10:  Report cycle     -> total_idle_time=5 (3 + 2), utilization_pct=50

    const tracker = new UtilizationTracker()

    // T=0: Tracker starts
    mockMonotonicTime.mockReturnValue(0)
    tracker.start()
    expect(tracker.utilizationPct(false)).toBe(100) // No time has passed yet

    // T=1: Request 1 starts
    mockMonotonicTime.mockReturnValue(1)
    tracker.incr()
    expect(tracker.utilizationPct(false)).toBe(0) // 1 second idle out of 1 total second = 100% idle

    // T=2: Request 1 ends
    mockMonotonicTime.mockReturnValue(2)
    tracker.decr()
    expect(tracker.utilizationPct(false)).toBe(50) // 1 second idle out of 2 total seconds = 50% idle

    // T=4: Request 2 starts
    mockMonotonicTime.mockReturnValue(4)
    tracker.incr()
    expect(tracker.utilizationPct(false)).toBe(25) // 3 seconds idle out of 4 total seconds = 75% idle

    // T=5: Request 3 starts
    mockMonotonicTime.mockReturnValue(5)
    tracker.incr()
    expect(tracker.utilizationPct(false)).toBe(40) // 3 seconds idle out of 5 total seconds = 60% idle

    // T=6: Request 2 ends
    mockMonotonicTime.mockReturnValue(6)
    tracker.decr()
    expect(tracker.utilizationPct(false)).toBe(50) // 3 seconds idle out of 6 total seconds = 50% idle

    // T=8: Request 3 ends
    mockMonotonicTime.mockReturnValue(8)
    tracker.decr()
    expect(tracker.utilizationPct(false)).toBe(62) // 3 seconds idle out of 8 total seconds = 37.5% idle

    // T=10: Report cycle - should calculate final utilization percentage
    mockMonotonicTime.mockReturnValue(10)
    expect(tracker.utilizationPct()).toBe(50) // 5 seconds idle out of 10 total seconds = 50% idle
  })

  test('resets the tracking cycle when utilization_pct is requested with no args', () => {
    // T=0:   Start tracker
    // T=1:   Request 1 starts -> total_idle_time=1
    // T=2:   Request 1 ends   -> total_idle_time=1
    // T=4:   Report cycle     -> total_idle_time=3 (1 + 2), utilization_pct=25
    // T=5:   Request 2 starts -> total_idle_time=1
    // T=8:   Report cycle     -> total_idle_time=1 (request still running), utilization_pct=75
    // T=9:   Request 3 starts -> total_idle_time=0
    // T=10:  Request 2 ends   -> total_idle_time=0
    // T=11:  Request 3 ends   -> total_idle_time=0
    // T=12:  Report cycle     -> total_idle_time=1, utilization_pct=75

    const tracker = new UtilizationTracker()

    // T=0: Tracker starts
    mockMonotonicTime.mockReturnValue(0)
    tracker.start()
    expect(tracker.utilizationPct(false)).toBe(100) // No time has passed yet

    // T=1: Request 1 starts
    mockMonotonicTime.mockReturnValue(1)
    tracker.incr()
    expect(tracker.utilizationPct(false)).toBe(0) // 1 second idle out of 1 total second = 100% idle

    // T=2: Request 1 ends
    mockMonotonicTime.mockReturnValue(2)
    tracker.decr()
    expect(tracker.utilizationPct(false)).toBe(50) // 1 second idle out of 2 total seconds = 50% idle

    mockMonotonicTime.mockReturnValue(3)
    expect(tracker.utilizationPct(false)).toBe(33) // 2 seconds idle out of 3 total seconds = 66.66% idle

    // T=4: Report cycle
    mockMonotonicTime.mockReturnValue(4)
    expect(tracker.utilizationPct()).toBe(25) // 3 seconds idle out of 4 total seconds = 75% idle

    // T=5: Request 2 starts
    mockMonotonicTime.mockReturnValue(5)
    tracker.incr()
    expect(tracker.utilizationPct(false)).toBe(0) // 1 second idle out of 1 total second = 100% idle

    // T=8: Report cycle
    mockMonotonicTime.mockReturnValue(8)
    expect(tracker.utilizationPct()).toBe(75) // 1 second idle out of 4 total seconds = 25% idle

    // T=9: Request 3 starts
    mockMonotonicTime.mockReturnValue(9)
    tracker.incr()
    expect(tracker.utilizationPct(false)).toBe(100) // 0 seconds idle out of 1 total second = 0% idle

    // T=10: Request 2 ends
    mockMonotonicTime.mockReturnValue(10)
    tracker.decr()
    expect(tracker.utilizationPct(false)).toBe(100) // 0 seconds idle out of 2 total second = 0% idle

    // T=11: Request 3 ends
    mockMonotonicTime.mockReturnValue(11)
    tracker.decr()
    expect(tracker.utilizationPct(false)).toBe(100) // 0 seconds idle out of 3 total second = 0% idle

    // T=12: Report cycle
    mockMonotonicTime.mockReturnValue(12)
    expect(tracker.utilizationPct()).toBe(75) // 1 second idle out of 4 total seconds = 25% idle
  })
})
