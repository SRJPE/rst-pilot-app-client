import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: fishProcessingValuesI
}

interface fishProcessingValuesI {
  fishProcessedResult: string
  reasonForNotProcessing: string
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    fishProcessedResult: '',
    reasonForNotProcessing: '',
  },
}

export const fishProcessingSlice = createSlice({
  name: 'fishProcessing',
  initialState: initialState,
  reducers: {
    saveFishProcessing: (state, action) => {
      state.values = action.payload
    },
    markFishProcessingCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const { saveFishProcessing, markFishProcessingCompleted } =
  fishProcessingSlice.actions

export default fishProcessingSlice.reducer
