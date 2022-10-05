import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: fishProcessingValuesI
}

interface fishProcessingValuesI {
  fishProcessed: string
  reasonForNotProcessing: string
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    fishProcessed: '',
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
