import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: TrapPreProcessingValuesI
}

export interface TrapPreProcessingValuesI {
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
    coneDepth: null,
    coneSetting: 'full',
    totalRevolutions: null,
    rpm1: null,
    rpm2: null,
    rpm3: null,
  },
}

export const trapPreProcessingSlice = createSlice({
  name: 'trapPreProcessing',
  initialState: initialState,
  reducers: {
    resetTrapPreProcessingSlice: () => initialState,
    saveTrapPreProcessing: (state, action) => {
      state.values = action.payload
    },
    markTrapPreProcessingCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const {
  resetTrapPreProcessingSlice,
  saveTrapPreProcessing,
  markTrapPreProcessingCompleted,
} = trapPreProcessingSlice.actions

export default trapPreProcessingSlice.reducer
