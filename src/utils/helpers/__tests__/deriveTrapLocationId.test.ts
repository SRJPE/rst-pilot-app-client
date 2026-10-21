import { describe, it, expect } from 'vitest'
import {
  deriveTrapLocationId,
  resolveSubmissionTrapLocationId,
} from '../deriveTrapLocationId'

const trapLocations = [
  { id: 1, trapName: 'RBDD-1', trapSite: 'RBDD', siteName: 'Red Bluff' },
  { id: 2, trapName: 'RBDD-2', trapSite: 'RBDD', siteName: 'Red Bluff Upper' },
]

describe('deriveTrapLocationId', () => {
  it('matches on trapName', () => {
    expect(deriveTrapLocationId({ trapLocations, trapName: 'RBDD-1' })).toBe(1)
  })

  it('matches on siteName via trapSite', () => {
    expect(
      deriveTrapLocationId({ trapLocations, trapSite: 'Red Bluff Upper' })
    ).toBe(2)
  })

  it('returns null when nothing or ambiguous matches', () => {
    expect(deriveTrapLocationId({ trapLocations: undefined })).toBe(null)
    expect(
      deriveTrapLocationId({ trapLocations, trapSite: 'nonexistent' })
    ).toBe(null)
  })
})

describe('resolveSubmissionTrapLocationId', () => {
  it('trusts an already-resolved stored id without re-deriving', () => {
    expect(
      resolveSubmissionTrapLocationId({
        storedTrapLocationId: 99,
        trapName: 'RBDD-1',
        trapLocations,
      })
    ).toBe(99)
  })

  it('self-heals a null stored id once trapLocations has loaded by save time', () => {
    // The exact production scenario this fixes: VisitSetup.tsx baked in a
    // null trapLocationId during a loading race, but by the time the crew
    // reaches Save the reference list has since loaded - re-derive from the
    // tab's own trapName/trapSite instead of submitting the stale null.
    expect(
      resolveSubmissionTrapLocationId({
        storedTrapLocationId: null,
        trapName: 'RBDD-1',
        trapLocations,
      })
    ).toBe(1)
  })

  it('still returns null if it truly cannot be derived', () => {
    expect(
      resolveSubmissionTrapLocationId({
        storedTrapLocationId: null,
        trapName: undefined,
        trapSite: undefined,
        trapLocations,
      })
    ).toBe(null)
  })
})
