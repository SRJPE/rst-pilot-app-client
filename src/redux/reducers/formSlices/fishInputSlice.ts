import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  modalOpen: boolean
  values: FishInputValuesI
}

export interface FishInputValuesI {
  speciesCaptured: Array<string>
  tableData: Array<Array<String>>
}

const initialState: InitialStateI = {
  completed: false,
  modalOpen: false,
  values: {
    speciesCaptured: ['YOY Chinook'],
    tableData: [
      ['Chinook', '100', '10', '', '', '', '', '', ''],
      ['Chinook', '100', '10', '', '', '', '', '', ''],
      ['Chinook', '100', '10', '', '', '', '', '', ''],
      ['Chinook', '100', '10', '', '', '', '', '', ''],
    ],
  },
}

export const saveFishSlice = createSlice({
  name: 'fishInput',
  initialState: initialState,
  reducers: {
    saveFishInput: (state, action) => {
      state.values = action.payload
    },
    markFishInputCompleted: (state, action) => {
      state.completed = action.payload
    },
    markFishInputModalOpen: (state, action) => {
      state.modalOpen = action.payload
    },
  },
})

export const { saveFishInput, markFishInputCompleted, markFishInputModalOpen } =
  saveFishSlice.actions

export default saveFishSlice.reducer
