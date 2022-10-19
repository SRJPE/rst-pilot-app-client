import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: ReleaseTrialValuesI
}

export interface ReleaseTrialValuesI {
  wildCount: number | null
  deadWildCount: number | null
  willSupplement: string | boolean
  hatcheryCount: number | null
  runIDHatchery: string
  runWeightHatchery: number | null
  deadHatcheryCount: number | null
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    wildCount: null,
    deadWildCount: null,
    willSupplement: false,
    hatcheryCount: null,
    runIDHatchery: '',
    runWeightHatchery: null,
    deadHatcheryCount: null,
  },
}

export const releaseTrialSlice = createSlice({
  name: 'releaseTrial',
  initialState: initialState,
  reducers: {
    saveReleaseTrial: (state, action) => {
      state.values = action.payload
    },

    markReleaseTrialCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const { saveReleaseTrial, markReleaseTrialCompleted } =
  releaseTrialSlice.actions

export default releaseTrialSlice.reducer
