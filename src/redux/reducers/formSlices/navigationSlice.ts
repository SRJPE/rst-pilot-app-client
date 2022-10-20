import { createSlice } from '@reduxjs/toolkit'

const formSteps = {
  1: { name: 'Visit Setup', propName: 'visitSetup', completed: false },
  2: { name: 'Trap Status', propName: 'trapStatus', completed: false },
  3: {
    name: 'Trap Pre-Processing',
    propName: 'trapPreProcessing',
    completed: false,
  },
  4: { name: 'Fish Processing', propName: 'fishProcessing', completed: false },
  5: { name: 'Fish Input', propName: 'fishInput', completed: false },
  6: {
    name: 'Trap Post-Processing',
    propName: 'trapPostProcessing',
    completed: false,
  },
  7: { name: 'Incomplete Sections', propName: 'incompleteSections' },
  8: { name: 'High Flows', propName: 'highFlows', completed: false },
  9: { name: 'High Temperatures', propName: 'highTemperatures' },
  10: { name: 'Non Functional Trap', propName: 'nonFunctionalTrap' },
  11: { name: 'No Fish Caught', propName: 'noFishCaught' },
  12: { name: 'End Trapping', propName: 'endTrapping' },
  13: { name: 'Start Mark Recapture', propName: 'StartMarkRecapture' },
}

interface NavigationStateI {
  activeStep: number
  steps: any
  formIsValid?: boolean
}

const initialState: NavigationStateI = {
  activeStep: 1,
  steps: formSteps,
  formIsValid: false,
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: initialState,
  reducers: {
    updateActiveStep: (state, action) => {
      state.activeStep = action.payload
    },
    markStepCompleted: (state, action) => {
      //currently working: "state.activeStep - 1" could be refactored in the future
      if (state.steps[state.activeStep - 1]?.completed !== undefined) {
        state.steps[state.activeStep - 1].completed = action.payload
      }
    },
  },
})

export const { updateActiveStep, markStepCompleted } = navigationSlice.actions

export default navigationSlice.reducer
