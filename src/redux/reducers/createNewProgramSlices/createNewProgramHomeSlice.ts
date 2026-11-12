import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

export interface CreateNewProgramInitialStateI {
  values: {
    monitoringProgramName: string
    streamName: string
    fundingAgency: string
    program?: string
    copyExistingProgram: 'true' | 'false'
  }
  steps: Array<{ name: string; completed: boolean }>
  // Client-generated uid for one wizard attempt, used to dedupe the queued
  // program submission (see saveMonitoringProgramSubmission) if the user
  // resubmits after backing out of "Create New Program Complete." Cleared
  // for free by resetCreateNewProgramHomeSlice.
  submissionUid: string | null
}
export const initialState: CreateNewProgramInitialStateI = {
  values: {
    monitoringProgramName: '',
    streamName: '',
    fundingAgency: '',
    copyExistingProgram: 'false',
    program: '',
  },
  submissionUid: null,
  steps: [
    { name: 'trappingSites', completed: false },
    { name: 'crewMembers', completed: false },
    {
      name: 'efficiencyTrialProtocols',
      completed: false,
    },
    {
      name: 'trappingProtocols',
      completed: false,
    },
    {
      name: 'permitInformation',
      completed: false,
    },
  ],
}

export const createNewProgramHomeSlice = createSlice({
  name: 'createNewProgramHome',
  initialState: initialState,
  reducers: {
    resetCreateNewProgramHomeSlice: () => initialState,
    saveNewProgramValues: (state, action) => {
      state.values = action.payload
    },
    markCreateNewProgramStepCompleted: (state, action) => {
      const stepName = action.payload
      const stepsCopy = cloneDeep(state.steps)
      const stepIndex = stepsCopy.findIndex(step => step.name === stepName)
      stepsCopy[stepIndex].completed = true
      state.steps = stepsCopy
    },
    markCreateNewProgramStepIncomplete: (state, action) => {
      const stepName = action.payload
      const stepsCopy = cloneDeep(state.steps)
      const stepIndex = stepsCopy.findIndex(step => step.name === stepName)
      stepsCopy[stepIndex].completed = false
      state.steps = stepsCopy
    },
    setSubmissionUid: (state, action) => {
      state.submissionUid = action.payload
    },
  },
})

export const {
  resetCreateNewProgramHomeSlice,
  saveNewProgramValues,
  markCreateNewProgramStepCompleted,
  markCreateNewProgramStepIncomplete,
  setSubmissionUid,
} = createNewProgramHomeSlice.actions

export default createNewProgramHomeSlice.reducer
