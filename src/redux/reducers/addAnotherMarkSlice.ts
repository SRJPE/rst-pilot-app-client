import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: ReleaseTrialValuesI
}

export interface ReleaseTrialValuesI {
  markType: string | null
  markColor: string | null
  markPosition: string | null
  markNumber: number | null
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    markType: null,
    markColor: null,
    markPosition: null,
    markNumber: null,
  },
}

export const addAnotherMarkSlice = createSlice({
  name: 'addAnotherMark',
  initialState: initialState,
  reducers: {
    resetAddAnotherMarkSlice: () => initialState,
    saveAddAnotherMark: (state, action) => {
      state.values = action.payload
    },

    markAddAnotherMarkCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const {
  resetAddAnotherMarkSlice,
  saveAddAnotherMark,
  markAddAnotherMarkCompleted,
} = addAnotherMarkSlice.actions

export default addAnotherMarkSlice.reducer
