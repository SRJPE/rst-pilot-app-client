import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: TrapPreProcessingValuesI
}

export interface TrapPreProcessingValuesI {
  coneDepth: number | null
  coneSetting: string
  checked: string | boolean
  totalRevolutions: number | null
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    coneDepth: null,
    coneSetting: '',
    checked: '',
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
    saveTrapPreProcessing: (state, action) => {
      state.values = action.payload
    },
    markTrapPreProcessingCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const { saveTrapPreProcessing, markTrapPreProcessingCompleted } =
  trapPreProcessingSlice.actions

export default trapPreProcessingSlice.reducer