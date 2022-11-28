import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: ReleaseTrialValuesI
}

export interface ReleaseTrialValuesI {
  markType: string | null
  markColor: string | null
  markPosition: string | null
  releaseLocation: string | null
  releaseTime: string | null
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    markType: null,
    markColor: null,
    markPosition: null,
    releaseLocation: null,
    releaseTime: null,
  },
}

export const releaseTrialDataEntrySlice = createSlice({
  name: 'releaseTrialDataEntry',
  initialState: initialState,
  reducers: {
    resetReleaseTrialDataEntrySlice: () => initialState,
    saveReleaseTrial: (state, action) => {
      state.values = action.payload
    },

    markReleaseTrialCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const {
  resetReleaseTrialDataEntrySlice,
  saveReleaseTrial,
  markReleaseTrialCompleted,
} = releaseTrialDataEntrySlice.actions

export default releaseTrialDataEntrySlice.reducer
