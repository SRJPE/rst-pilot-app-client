import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  [tabId: string]: VisitSetupStateI
}

interface VisitSetupStateI {
  completed: boolean
  isPaperEntry: false
  values: VisitSetupValuesI
}

interface VisitSetupValuesI {
  programId: number | null
  trapLocationId: number | null
  stream: string
  trapSite: string
  trapName?: string
  crew: Array<string>
  project?: string | null
}

const initialState: InitialStateI = {
  placeholderId: {
    completed: false,
    isPaperEntry: false,
    values: {
      programId: null,
      trapLocationId: null,
      stream: '',
      trapSite: '',
      crew: [],
    },
  },
}

export const visitSetupSlice = createSlice({
  name: 'visitSetup',
  initialState: initialState,
  reducers: {
    resetVisitSetupSlice: () => initialState,
    saveVisitSetup: (state, action) => {
      const { tabId, values, isPaperEntry } = action.payload
      state[tabId] = { completed: true, isPaperEntry, values }
    },
    markVisitSetupCompleted: (state, action) => {
      const { tabId, completed } = action.payload
      state[tabId].completed = completed
    },
    markTrapVisitPaperEntry: (state, action) => {
      const { tabId, isPaperEntry } = action.payload
      state[tabId].isPaperEntry = isPaperEntry
    },
    restoreTabState: (state, action) => {
      const { tabId, tabState } = action.payload
      state[tabId] = tabState
    },
    /**
     * Self-heal for a `trapLocationId` baked in as null by a loading race in
     * VisitSetup.tsx (see deriveTrapLocationId.ts / resolveTrapLocationId.ts),
     * discovered because it also silently dropped equipment-scoped dynamic
     * fields on Trap Operations/Trap Post-Processing. Only patches the one
     * field — unlike saveVisitSetup, it doesn't touch completed/isPaperEntry
     * or require the full values object.
     */
    repairTrapLocationId: (state, action) => {
      const { tabId, trapLocationId } = action.payload
      if (state[tabId]) {
        state[tabId].values.trapLocationId = trapLocationId
      }
    },
  },
})

export const {
  resetVisitSetupSlice,
  saveVisitSetup,
  markVisitSetupCompleted,
  markTrapVisitPaperEntry,
  restoreTabState,
  repairTrapLocationId,
} = visitSetupSlice.actions

export default visitSetupSlice.reducer
