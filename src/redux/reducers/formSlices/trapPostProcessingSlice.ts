import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  [tabId: string]: TrapPostProcessingStateI
}

interface TrapPostProcessingStateI {
  completed: boolean
  values: trapPostProcessingValuesI
  errors: { [name: string]: any }
}

export interface trapPostProcessingValuesI {
  debrisVolume: number | null
  totalRevolutions: number | null
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
  trapLatitude: number | null
  trapLongitude: number | null
  endingTrapStatus: string
  trapVisitStartTime: Date | null
}

const initialState: InitialStateI = {
  placeholderId: {
    completed: false,
    values: {
      debrisVolume: null,
      totalRevolutions: null,
      rpm1: null,
      rpm2: null,
      rpm3: null,
      trapLatitude: null,
      trapLongitude: null,
      endingTrapStatus: 'Restart Trap',
      trapVisitStartTime: null,
    },
    errors: {},
  },
}

export const trapPostProcessingSlice = createSlice({
  name: 'trapPostProcessing',
  initialState: initialState,
  reducers: {
    resetTrapPostProcessingSlice: () => initialState,
    saveTrapPostProcessing: (state, action) => {
      const { tabId, values, errors } = action.payload
      state[tabId] = {
        completed: true,
        values: {
          ...values,
          trapVisitStartTime: state[tabId]
            ? state[tabId].values.trapVisitStartTime
            : values.trapVisitStartTime,
        },
        errors,
      }
    },
    updateTrapVisitStartTime: (state, action) => {
      const { tabId, value } = action.payload
      state[tabId].values.trapVisitStartTime = value
    },
    markTrapPostProcessingCompleted: (state, action) => {
      const { tabId, value } = action.payload
      state[tabId].completed = value
    },
  },
})

export const {
  resetTrapPostProcessingSlice,
  saveTrapPostProcessing,
  updateTrapVisitStartTime,
  markTrapPostProcessingCompleted,
} = trapPostProcessingSlice.actions

export default trapPostProcessingSlice.reducer
