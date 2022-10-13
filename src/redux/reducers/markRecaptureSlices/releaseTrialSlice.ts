import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: {
    wild: ReleaseTrialWildValuesI
    hatchery: ReleaseTrialHatcheryValuesI
  }
}

export interface ReleaseTrialWildValuesI {
  wildCount: number | null
  deadWildCount: number | null
  willSupplement: string
}
export interface ReleaseTrialHatcheryValuesI {
  hatcheryCount: number | null
  runID: string
  runWeight: number | null
  deadHatcheryCount: number | null
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    wild: {
      wildCount: null,
      deadWildCount: null,
      willSupplement: '',
    },
    hatchery: {
      hatcheryCount: null,
      runID: '',
      runWeight: null,
      deadHatcheryCount: null,
    },
  },
}

export const releaseTrialSlice = createSlice({
  name: ' releaseTrial',
  initialState: initialState,
  reducers: {
    saveReleaseTrialWild: (state, action) => {
      state.values.wild = action.payload
    },
    saveReleaseTrialHatchery: (state, action) => {
      state.values.hatchery = action.payload
    },
    markReleaseTrialCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const {
  saveReleaseTrialWild,
  saveReleaseTrialHatchery,
  markReleaseTrialCompleted,
} = releaseTrialSlice.actions

export default releaseTrialSlice.reducer
