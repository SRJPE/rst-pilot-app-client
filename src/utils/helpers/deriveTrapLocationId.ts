/**
 * Matches a trapName/trapSite selection against the visit-setup trap
 * locations reference list and returns the single matching id, or null if
 * there's no unambiguous match.
 *
 * Extracted from VisitSetup.tsx's getTrapLocationId so the same matching
 * logic can also be used as a self-heal at final submission time (see
 * resolveSubmissionTrapLocationId) - before this, the 4 submission-builder
 * sites (IncompleteSections.tsx, StartedTrapping.tsx,
 * navigationFlowWarnings/{HighFlows,NoFishCaught}.tsx) each read
 * visitSetupState[id].values.trapLocationId verbatim, with no way to recover
 * a null baked in earlier by a loading race (see resolveTrapLocationId.ts).
 *
 * Leaf module on purpose - no React/redux imports, plain-node testable.
 */
export function deriveTrapLocationId({
  trapLocations,
  trapName,
  trapSite,
}: {
  trapLocations: any[] | undefined
  trapName?: string
  trapSite?: string
}): number | null {
  const locations = trapLocations ?? []
  let trapLocationId: number | null = null

  if (trapName) {
    const byTrapName = locations.filter((obj: any) => obj.trapName === trapName)
    if (byTrapName.length === 1) {
      trapLocationId = byTrapName[0].id
    }

    if (trapLocationId === null) {
      const byTrapSiteAsName = locations.filter(
        (obj: any) => obj.trapSite === trapName
      )
      if (byTrapSiteAsName.length === 1) {
        trapLocationId = byTrapSiteAsName[0].id
      }
    }
  }

  if (trapSite) {
    const bySiteName = locations.filter((obj: any) => obj.siteName === trapSite)
    if (bySiteName.length === 1) {
      trapLocationId = bySiteName[0].id
    } else if (!bySiteName.length) {
      const bySiteNameAsTrapName = locations.filter(
        (obj: any) => obj.siteName === trapName
      )
      if (bySiteNameAsTrapName.length === 1) {
        trapLocationId = bySiteNameAsTrapName[0].id
      }
    }
  }

  return trapLocationId
}

/**
 * Self-heal for the 4 trap-visit submission builders: a tab's stored
 * trapLocationId can already be null from a loading-race in VisitSetup.tsx
 * (see resolveTrapLocationId.ts's documented residual case - a brand-new tab
 * with nothing to fall back to at the time). By the time the crew actually
 * hits Save, the trapLocations reference list has almost always finished
 * loading, so re-deriving from the tab's stored trapName/trapSite here
 * recovers the id instead of submitting a guaranteed NOT NULL violation.
 */
export function resolveSubmissionTrapLocationId({
  storedTrapLocationId,
  trapName,
  trapSite,
  trapLocations,
}: {
  storedTrapLocationId: number | null | undefined
  trapName?: string
  trapSite?: string
  trapLocations: any[] | undefined
}): number | null {
  if (storedTrapLocationId != null) return storedTrapLocationId
  return deriveTrapLocationId({ trapLocations, trapName, trapSite })
}
