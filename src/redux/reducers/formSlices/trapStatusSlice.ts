import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: TrapStatusValuesI
}

export interface TrapStatusValuesI {
  trapStatus: string
  reasonNotFunc: string
  flowMeasure: number | null
  flowMeasureUnit: string
  waterTemperature: number | null
  waterTemperatureUnit: string
  waterTurbidity: number | null
  waterTurbidityUnit: string
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    trapStatus: '',
    reasonNotFunc: '',
    flowMeasure: null,
    flowMeasureUnit: 'cfs',
    waterTemperature: null,
    waterTemperatureUnit: '°F',
    waterTurbidity: null,
    waterTurbidityUnit: 'ntu'
  },
}

export const trapStatusSlice = createSlice({
  name: 'trapStatus',
  initialState: initialState,
  reducers: {
    saveTrapStatus: (state, action) => {
      state.values = action.payload
    },
    markTrapStatusCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const { saveTrapStatus, markTrapStatusCompleted } =
  trapStatusSlice.actions

export default trapStatusSlice.reducer
