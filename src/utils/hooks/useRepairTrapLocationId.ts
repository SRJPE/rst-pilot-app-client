import { useEffect } from 'react'
import { deriveTrapLocationId } from '../helpers/deriveTrapLocationId'
import { repairTrapLocationId } from '../../redux/reducers/formSlices/visitSetupSlice'

/**
 * Self-heals a `trapLocationId` baked in as null by a loading race in
 * VisitSetup.tsx: once `trapLocations` has loaded, re-derive it from the
 * tab's stored trapName/trapSite (same matching `deriveTrapLocationId` already
 * does for submission) and patch it back into the visitSetup slice.
 *
 * Without this, every screen that reads `trapLocationId` straight off the
 * visitSetup slice (equipment-type lookups for dynamic form fields, the
 * counter/revolutions hooks, etc.) silently misbehaves for the lifetime of
 * that draft - submission self-heals via resolveSubmissionTrapLocationId, but
 * nothing upstream of that did.
 */
export const useRepairTrapLocationId = ({
  activeTabId,
  trapLocationId,
  trapName,
  trapSite,
  trapLocations,
  dispatch,
}: {
  activeTabId: string | null | undefined
  trapLocationId: number | null | undefined
  trapName: string | undefined
  trapSite: string | undefined
  trapLocations: any[] | undefined
  dispatch: (action: any) => void
}) => {
  useEffect(() => {
    if (
      !activeTabId ||
      activeTabId === 'placeholderId' ||
      trapLocationId != null ||
      !trapLocations?.length
    ) {
      return
    }

    const derived = deriveTrapLocationId({ trapLocations, trapName, trapSite })
    if (derived != null) {
      dispatch(
        repairTrapLocationId({ tabId: activeTabId, trapLocationId: derived })
      )
    }
  }, [activeTabId, trapLocationId, trapName, trapSite, trapLocations])
}
