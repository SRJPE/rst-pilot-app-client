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

export const paperEntrySlice = createSlice({
  name: 'paperEntry',
  initialState: initialState,
  reducers: {
    resetPaperEntrySlice: () => initialState,
    savePaperEntry: (state, action) => {
      state.values = action.payload
    },
    markPaperEntryCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const { resetPaperEntrySlice, savePaperEntry, markPaperEntryCompleted } =
  paperEntrySlice.actions

export default paperEntrySlice.reducer
