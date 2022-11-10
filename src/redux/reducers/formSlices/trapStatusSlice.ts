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
  coneDepth: number | null
  coneSetting: string | null
  totalRevolutions: number | null
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
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
    waterTurbidityUnit: 'ntu',
    coneDepth: null,
    coneSetting: 'full',
    totalRevolutions: null,
    rpm1: null,
    rpm2: null,
    rpm3: null,
  },
}

export const trapStatusSlice = createSlice({
  name: 'trapStatus',
  initialState: initialState,
  reducers: {
    resetTrapStatusSlice: () => initialState,
    saveTrapStatus: (state, action) => {
      state.values = action.payload
    },
    markTrapStatusCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const { resetTrapStatusSlice, saveTrapStatus, markTrapStatusCompleted } =
  trapStatusSlice.actions

export default trapStatusSlice.reducer
