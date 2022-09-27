import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  values: fishProcessingValuesI
}

interface fishProcessingValuesI {
  fishProcessed: string
  reasonForNotProcessing: string
}

const initialState: InitialStateI = {
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
  },
})

export const { saveFishProcessing } = fishProcessingSlice.actions

export default fishProcessingSlice.reducer
