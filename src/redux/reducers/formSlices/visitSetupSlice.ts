import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  isHistorical: false
  values: VisitSetupValuesI
}

interface VisitSetupValuesI {
  stream: string
  trapSite: string
  crew: Array<string>
}

const initialState: InitialStateI = {
  completed: false,
  isHistorical: false,
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
    saveVisitSetup: (state, action) => {
      state.values = action.payload
    },
    markVisitSetupCompleted: (state, action) => {
      state.completed = action.payload
    },
    markTrapVisitHistorical: (state, action) => {
      state.isHistorical = action.payload
    },
  },
})

export const {
  saveVisitSetup,
  markVisitSetupCompleted,
  markTrapVisitHistorical,
} = visitSetupSlice.actions

export default visitSetupSlice.reducer
