import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  [tabId: string]: TrapOperationsStateI
}

interface TrapOperationsStateI {
  completed: boolean
  values: TrapOperationsValuesI
}

export interface TrapOperationsValuesI {
  trapStatus: string
  reasonNotFunc: string
  flowMeasure: number | null
  flowMeasureUnit: string
  waterTemperature: number | null
  waterTemperatureUnit: string
  waterTurbidity: number | null
  waterTurbidityUnit: string

  coneSetting: string | null
  totalRevolutions: number | null
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
  trapVisitStopTime: Date | null
}

const initialState: InitialStateI = {
  placeholderId: {
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
      coneSetting: 'full',
      totalRevolutions: null,
      rpm1: null,
      rpm2: null,
      rpm3: null,
      trapVisitStopTime: null,
    },
  },
}

export const trapOperationsSlice = createSlice({
  name: 'trapOperations',
  initialState: initialState,
  reducers: {
    resetTrapOperationsSlice: () => initialState,
    saveTrapOperations: (state, action) => {
      const { tabId, values } = action.payload
      state[tabId] = {
        completed: true,
        values: {
          ...values,
          trapVisitStopTime: state[tabId]
            ? state[tabId].values.trapVisitStopTime
            : action.payload.values.trapVisitStopTime,
        },
      }
    },
    markTrapOperationsCompleted: (state, action) => {
      const { tabId, value } = action.payload
      state[tabId].completed = value
    },
  },
})

export const {
  resetTrapOperationsSlice,
  saveTrapOperations,
  markTrapOperationsCompleted,
} = trapOperationsSlice.actions

export default trapOperationsSlice.reducer
