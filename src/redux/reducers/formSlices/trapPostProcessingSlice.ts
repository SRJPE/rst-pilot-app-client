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
  trapLatitude: number | null
  trapLongitude: number | null
  endingTrapStatus: string
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    debrisVolume: null,
    rpm1: null,
    rpm2: null,
    rpm3: null,
    trapLatitude: null,
    trapLongitude: null,
    endingTrapStatus: 'Restart Trap',
  },
}

export const trapPostProcessingSlice = createSlice({
  name: 'trapPostProcessing',
  initialState: initialState,
  reducers: {
    resetTrapPostProcessingSlice: () => initialState,
    saveTrapPostProcessing: (state, action) => {
      state.values = action.payload
    },
    markTrapPostProcessingCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const {
  resetTrapPostProcessingSlice,
  saveTrapPostProcessing,
  markTrapPostProcessingCompleted,
} = trapPostProcessingSlice.actions

export default trapPostProcessingSlice.reducer
