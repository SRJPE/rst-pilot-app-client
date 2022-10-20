import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: trapPostProcessingValuesI
}

export interface trapPostProcessingValuesI {
  debrisVolume: number | null
  rpm1: number | null
  rpm2: number | null
  rpm3: number | null
  trapLocation: any
  endingTrapStatus: string
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    debrisVolume: null,
    rpm1: null,
    rpm2: null,
    rpm3: null,
    trapLocation: '',
    endingTrapStatus: '',
  },
}

export const trapPostProcessingSlice = createSlice({
  name: 'trapPostProcessing',
  initialState: initialState,
  reducers: {
    saveTrapPostProcessing: (state, action) => {
      state.values = action.payload
    },
    markTrapPostProcessingCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const { saveTrapPostProcessing, markTrapPostProcessingCompleted } =
  trapPostProcessingSlice.actions

export default trapPostProcessingSlice.reducer
