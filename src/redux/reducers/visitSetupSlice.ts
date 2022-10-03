import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: VisitSetupValuesI
}

interface VisitSetupValuesI {
  stream: string
  trapSite: string
  trapSubSite: string
  crew: Array<string>
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    stream: '',
    trapSite: '',
    trapSubSite: '',
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
  },
})

export const { saveVisitSetup, markVisitSetupCompleted } =
  visitSetupSlice.actions

export default visitSetupSlice.reducer
