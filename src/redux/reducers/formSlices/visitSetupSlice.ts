import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: VisitSetupValuesI
}

interface VisitSetupValuesI {
  stream: string
  trapSite: string
  crew: Array<string>
}

const initialState: InitialStateI = {
  completed: false,
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
  },
})

export const { resetVisitSetupSlice, saveVisitSetup, markVisitSetupCompleted } =
  visitSetupSlice.actions

export default visitSetupSlice.reducer
