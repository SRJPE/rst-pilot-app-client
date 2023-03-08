import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  [tabId: string]: PaperEntryStateI
}

interface PaperEntryStateI {
  completed: boolean
  values: {
    comments: string
    startDate: any | null
    endDate: any | null
  }
}

const initialState: InitialStateI = {
  placeholderId: {
    completed: false,
    values: {
      comments: '',
      startDate: null,
      endDate: null,
    },
  },
}

export const paperEntrySlice = createSlice({
  name: 'paperEntry',
  initialState: initialState,
  reducers: {
    resetPaperEntrySlice: () => initialState,
    savePaperEntry: (state, action) => {
      const { tabId, values } = action.payload
      state[tabId] = {completed: true, values}
    },
    markPaperEntryCompleted: (state, action) => {
      const { tabId, value } = action.payload
      state[tabId].completed = value
    },
  },
})

export const { resetPaperEntrySlice, savePaperEntry, markPaperEntryCompleted } =
  paperEntrySlice.actions

export default paperEntrySlice.reducer
