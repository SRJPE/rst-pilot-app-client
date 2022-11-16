import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: {
    comments: string
    startDate: any | null
    endDate: any | null
  }
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    comments: '',
    startDate: new Date(),
    endDate: new Date(),
  },
}

export const historicalDataSlice = createSlice({
  name: 'historicalData',
  initialState: initialState,
  reducers: {
    resetHistoricalDataSlice: () => initialState,
    saveHistoricalData: (state, action) => {
      state.values = action.payload
    },
    markHistoricalDataCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const {
  resetHistoricalDataSlice,
  saveHistoricalData,
  markHistoricalDataCompleted,
} = historicalDataSlice.actions

export default historicalDataSlice.reducer
