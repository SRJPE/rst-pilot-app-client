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
  crew: Array<string>
}

const initialState: InitialStateI = {
  placeholderID: {
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
      const { tabID, values } = action.payload
      if (state[tabID]) {
        state[tabID].values = values
      } else {
        state[tabID] = { completed: false, isPaperEntry: false, values }
      }
    },
    markVisitSetupCompleted: (state, action) => {
      const { tabID, completed } = action.payload
      state[tabID].completed = completed
    },
    markTrapVisitPaperEntry: (state, action) => {
      const { tabID, isPaperEntry } = action.payload
      state[tabID].isPaperEntry = isPaperEntry
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
