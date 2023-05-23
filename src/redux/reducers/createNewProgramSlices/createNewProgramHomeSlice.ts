import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

export interface CreateNewProgramInitialStateI {
  values: {
    monitoringProgramName: string
    streamName: string
    fundingAgency: string
  }
  steps: Array<{ name: string; completed: boolean }>
}
export const initialState: CreateNewProgramInitialStateI = {
  values: {
    monitoringProgramName: '',
    streamName: '',
    fundingAgency: '',
  },
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
      const stepIndex = stepsCopy.findIndex((step) => step.name === stepName)
      stepsCopy[stepIndex].completed = true
      state.steps = stepsCopy
    },
  },
})

export const {
  resetCreateNewProgramHomeSlice,
  saveNewProgramValues,
  markCreateNewProgramStepCompleted,
} = createNewProgramHomeSlice.actions

export default createNewProgramHomeSlice.reducer
