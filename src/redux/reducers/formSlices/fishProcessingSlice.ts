import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: fishProcessingValuesI
}

interface fishProcessingValuesI {
  fishProcessedResult: string
  reasonForNotProcessing: string
  willBeHoldingFishForMarkRecapture: boolean
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    fishProcessedResult: '',
    reasonForNotProcessing: '',
    willBeHoldingFishForMarkRecapture: false,
  },
}

export const fishProcessingSlice = createSlice({
  name: 'fishProcessing',
  initialState: initialState,
  reducers: {
    resetFishProcessingSlice: () => initialState,
    saveFishProcessing: (state, action) => {
      state.values = action.payload
    },
    markFishProcessingCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const {
  resetFishProcessingSlice,
  saveFishProcessing,
  markFishProcessingCompleted,
} = fishProcessingSlice.actions

export default fishProcessingSlice.reducer
