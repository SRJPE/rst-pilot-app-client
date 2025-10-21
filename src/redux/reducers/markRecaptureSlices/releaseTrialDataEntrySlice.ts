import { createSlice } from '@reduxjs/toolkit'
import { ReleaseMarkI } from '../addAnotherMarkSlice'

interface InitialStateI {
  completed: boolean
  crew: Array<string>
  trapLocationIds: Array<number>
  programId: number | null
  values: ReleaseTrialValuesI
}

export interface ReleaseTrialValuesI {
  appliedMarks: Array<ReleaseMarkI>
  releaseLocation: string | null
  markedTime: Date | null
  releaseTime: Date | null
}

const initialState: InitialStateI = {
  completed: false,
  crew: [],
  trapLocationIds: [],
  programId: null,
  values: {
    appliedMarks: [],
    releaseLocation: null,
    markedTime: null,
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
    // saveTrapVisitInformation: (state, action) => {
    //   state.crew = action.payload.crew
    //   state.programId = action.payload.programId
    //   state.trapLocationIds = action.payload.trapLocationIds
    // },
    saveTrapVisitInformation: (state, action) => {
      state.crew = action.payload.crew
      state.programId = action.payload.programId
      state.trapLocationIds = action.payload.trapLocationIds
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
  saveTrapVisitInformation,
  addMarkToAppliedMarks,
  removeMarkFromAppliedMarks,
  markReleaseTrialDataEntryCompleted,
} = releaseTrialDataEntrySlice.actions

export default releaseTrialDataEntrySlice.reducer
