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
  },
})

export const {
  resetVisitSetupSlice,
  saveVisitSetup,
  markVisitSetupCompleted,
  markTrapVisitPaperEntry,
} = visitSetupSlice.actions

export default visitSetupSlice.reducer
