import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  complete: boolean
  values: trapVisitFormValuesI
}

export interface trapVisitFormValuesI {
  trapVisit: Object
  trapStatus: Object
  trapOperations: Object
  fishProcessing: Object
}

const initialState: InitialStateI = {
  complete: false,
  values: {
    trapVisit: {},
    trapStatus: {},
    trapOperations: {},
    fishProcessing: {},
  },
}

export const trapStatusSlice = createSlice({
  name: 'trapStatus',
  initialState: initialState,
  reducers: {
    combineFormSlices: (state, action) => {
      state.values = action.payload
    },
  },
})

export const { combineFormSlices } = trapStatusSlice.actions

export default trapStatusSlice.reducer
