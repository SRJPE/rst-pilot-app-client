import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: ReleaseTrialValuesI
}

export interface ReleaseTrialValuesI {
  appliedMarks: Array<any>

  releaseLocation: string | null
  releaseTime: any | null
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    appliedMarks: [],

    releaseLocation: null,
    releaseTime: null,
  },
}

export const releaseTrialDataEntrySlice = createSlice({
  name: 'releaseTrialDataEntry',
  initialState: initialState,
  reducers: {
    resetReleaseTrialDataEntrySlice: () => initialState,
    saveReleaseTrialDataEntry: (state, action) => {
      state.values = action.payload
    },
    addMarkToAppliedMarks: (state, action) => {
      state.values.appliedMarks = [...state.values.appliedMarks, action.payload]
    },
    removeMarkFromAppliedMarks: (state, action) => {
      state.values.appliedMarks = action.payload
    },

    markReleaseTrialDataEntryCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const {
  resetReleaseTrialDataEntrySlice,
  saveReleaseTrialDataEntry,
  addMarkToAppliedMarks,
  removeMarkFromAppliedMarks,
  markReleaseTrialDataEntryCompleted,
} = releaseTrialDataEntrySlice.actions

export default releaseTrialDataEntrySlice.reducer
