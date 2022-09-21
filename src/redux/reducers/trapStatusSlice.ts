import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface InitialStateI {
  values: TrapStatusValuesI
}

export interface TrapStatusValuesI {
  trapStatus: string
  reasonNotFunc: string
  flowMeasure: number | null
  waterTemperature: number | null
  waterTurbidity: number | null
}

const initialState: InitialStateI = {
  values: {
    trapStatus: '',
    reasonNotFunc: '',
    flowMeasure: null,
    waterTemperature: null,
    waterTurbidity: null,
  },
}

export const trapStatusSlice = createSlice({
  name: 'trapStatus',
  initialState: initialState,
  reducers: {
    saveTrapStatus: (state, action) => {
      state.values = action.payload
    },
  },
})

export const { saveTrapStatus } = trapStatusSlice.actions

export default trapStatusSlice.reducer
