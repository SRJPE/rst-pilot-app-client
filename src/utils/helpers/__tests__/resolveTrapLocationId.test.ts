import { describe, it, expect } from 'vitest'
import { resolveTrapLocationId } from '../resolveTrapLocationId'

/**
 * Regression coverage for a real production bug, confirmed via server logs
 * (repeated `null value in column "trap_location_id" violates not-null
 * constraint` on trap_visit inserts) and a captured client payload: a
 * fully-filled-out trap visit (real environmental readings, trap operations
 * data, comments) got submitted with trapLocationId: null. Root cause:
 * VisitSetup.tsx resolves trapLocationId by matching the crew's
 * trapName/trapSite selection against visitSetupDefaultsState.trapLocations,
 * a reference list fetched over the network - which can still be empty right
 * after an app reload, before the fetch completes. The crew's own selection
 * was fine; the lookup table just hadn't loaded yet.
 */
describe('resolveTrapLocationId', () => {
  it('returns the resolved id when the lookup succeeded', () => {
    expect(
      resolveTrapLocationId({
        resolvedId: 12,
        trapLocationsLoaded: true,
        existingId: null,
      })
    ).toBe(12)
    // Even when a (now-irrelevant) existingId is present, a real resolved id
    // always wins.
    expect(
      resolveTrapLocationId({
        resolvedId: 12,
        trapLocationsLoaded: true,
        existingId: 99,
      })
    ).toBe(12)
  })

  it('trusts a null result as a genuine "no match" once reference data has loaded', () => {
    // The reference list loaded and just doesn't contain a matching
    // trapName/trapSite - this is a real data problem, not a loading race,
    // and must not be silently papered over with a stale id.
    expect(
      resolveTrapLocationId({
        resolvedId: null,
        trapLocationsLoaded: true,
        existingId: 99,
      })
    ).toBe(null)
  })

  it('falls back to the tab’s previously saved id when reference data has not loaded yet', () => {
    // The exact production scenario: app reload, trapLocations hasn't
    // fetched yet, crew hits Next on an existing tab that already had a
    // correct trapLocationId from before.
    expect(
      resolveTrapLocationId({
        resolvedId: null,
        trapLocationsLoaded: false,
        existingId: 99,
      })
    ).toBe(99)
  })

  it('has no choice but to return null for a brand-new tab with nothing to fall back to', () => {
    // First-ever navigation through Visit Setup with no prior tab state -
    // reference data not loaded and nothing saved yet. This residual edge
    // case is not fully closed by this fix; flagged separately.
    expect(
      resolveTrapLocationId({
        resolvedId: null,
        trapLocationsLoaded: false,
        existingId: null,
      })
    ).toBe(null)
    expect(
      resolveTrapLocationId({
        resolvedId: null,
        trapLocationsLoaded: false,
        existingId: undefined,
      })
    ).toBe(null)
  })
})
