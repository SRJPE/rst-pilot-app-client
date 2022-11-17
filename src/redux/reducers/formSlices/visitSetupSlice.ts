import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  isPaperEntry: false
  values: VisitSetupValuesI
}

interface VisitSetupValuesI {
  stream: string
  trapSite: string
  crew: Array<string>
}

const initialState: InitialStateI = {
  completed: false,
  isPaperEntry: false,
  values: {
    stream: '',
    trapSite: '',
    crew: [],
  },
}

export const visitSetupSlice = createSlice({
  name: 'visitSetup',
  initialState: initialState,
  reducers: {
    resetVisitSetupSlice: () => initialState,
    saveVisitSetup: (state, action) => {
      state.values = action.payload
    },
    markVisitSetupCompleted: (state, action) => {
      state.completed = action.payload
    },
    markTrapVisitPaperEntry: (state, action) => {
      state.isPaperEntry = action.payload
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
