import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  [tabId: string]: TrapOperationsStateI
}

interface TrapOperationsStateI {
  completed: boolean
  values: TrapOperationsValuesI
  errors: { [name: string]: any }
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
  recordTurbidityInPostProcessing: boolean
  coneSetting: string | null
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
  trapVisitStopTime: Date | null
  trapVisitStartTime: Date | null
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
      waterTemperatureUnit: '°C',
      waterTurbidity: null,
      waterTurbidityUnit: 'ntu',
      recordTurbidityInPostProcessing: false,
      coneSetting: 'full',
      rpm1: null,
      rpm2: null,
      rpm3: null,
      trapVisitStopTime: null,
      trapVisitStartTime: null,
    },
    errors: {},
  },
}

export const trapOperationsSlice = createSlice({
  name: 'trapOperations',
  initialState: initialState,
  reducers: {
    resetTrapOperationsSlice: () => initialState,
    saveTrapOperations: (state, action) => {
      const { tabId, values, errors } = action.payload
      state[tabId] = {
        completed: true,
        values: {
          ...values,
          trapVisitStartTime: action?.payload?.values?.trapVisitStartTime
            ? action.payload.values.trapVisitStartTime
            : state?.[tabId]?.values?.trapVisitStartTime,
          trapVisitStopTime: action?.payload?.values?.trapVisitStopTime
            ? action.payload.values.trapVisitStopTime
            : state?.[tabId]?.values?.trapVisitStopTime,
        },
        errors,
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
