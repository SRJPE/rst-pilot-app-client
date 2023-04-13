import { createSlice } from '@reduxjs/toolkit'
import { ReleaseMarkI } from '../addAnotherMarkSlice'

interface InitialStateI {
  completed: boolean
  values: ReleaseTrialValuesI
}

export interface ReleaseTrialValuesI {
  appliedMarks: Array<ReleaseMarkI>
  releaseLocation: string | null
  markedTime: any | null
  releaseTime: any | null
  crew: Array<any>
  programId?: number | null
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    appliedMarks: [],
    releaseLocation: null,
    markedTime: null,
    releaseTime: null,
    crew: [],
    programId: null,
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
    saveTrapVisitInformation: (state, action) => {
      state.values.crew = action.payload.crew
      state.values.programId = action.payload.programId
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
