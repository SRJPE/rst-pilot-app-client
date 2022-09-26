import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  complete: boolean
  values: trapStatusValuesI
}

export interface trapStatusValuesI {
  trapVisit: Object
  trapStatus: Object
}

const initialState: InitialStateI = {
  complete: false,
  values: {
    trapVisit: {},
    trapStatus: {},
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
