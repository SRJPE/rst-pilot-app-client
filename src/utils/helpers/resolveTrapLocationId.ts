/**
 * Safety net for VisitSetup.tsx's trap-location lookup.
 *
 * Background: `trap_location_id` is NOT NULL on the server. VisitSetup.tsx
 * resolves it from the crew's trapName/trapSite selection by matching against
 * `visitSetupDefaultsState.trapLocations` (fetched over the network on login
 * / returning to Home). If that reference list is still empty when the crew
 * hits Next — most commonly right after an app reload, before the fetch has
 * completed — the lookup fails and returns null, which then gets saved onto
 * the tab and picked up VERBATIM by the final trap-visit submission builder.
 * Confirmed in production: this produces a queued submission that 400s on
 * every retry forever (a NOT NULL constraint violation), with no way for the
 * crew to self-recover.
 *
 * This function is the one decision point that prevents that: a failed
 * lookup should only ever be trusted as "no such location" when the
 * reference data has actually loaded. If it hasn't, and this tab already had
 * a previously resolved id (e.g. the crew is just re-confirming Visit Setup
 * on an existing trap visit after a reload), keep the old id instead of
 * overwriting it with null.
 *
 * Leaf module on purpose — no React/redux imports, so it stays plain-node
 * testable (same rationale as coreLegacyProgram.ts / mergeOrderedFields.ts).
 */
export function resolveTrapLocationId({
  resolvedId,
  trapLocationsLoaded,
  existingId,
}: {
  /** Result of matching trapName/trapSite against the reference list. */
  resolvedId: number | null
  /** Whether visitSetupDefaultsState.trapLocations has any rows at all. */
  trapLocationsLoaded: boolean
  /** This tab's previously saved trapLocationId, if any. */
  existingId: number | null | undefined
}): number | null {
  if (resolvedId !== null) return resolvedId
  if (trapLocationsLoaded) return null // genuine no-match; don't mask it
  return existingId ?? null
}
