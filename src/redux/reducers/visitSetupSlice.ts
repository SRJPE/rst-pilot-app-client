import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  values: VisitSetupValuesI
}

interface VisitSetupValuesI {
  stream: string
  trapSite: string
  trapSubSite: string
  crew: Array<string>
}

const initialState: InitialStateI = {
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
  },
})

export const { saveVisitSetup } = visitSetupSlice.actions

export default visitSetupSlice.reducer
