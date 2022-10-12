import { createSlice } from '@reduxjs/toolkit'

const formSteps = {
  1: { name: 'Visit Setup', propName: 'visitSetup', completed: false },
  2: { name: 'Trap Status', propName: 'trapStatus', completed: false },
  3: { name: 'Trap Operations', propName: 'trapOperations', completed: false },
  4: { name: 'Fish Processing', propName: 'fishProcessing', completed: false },
  5: { name: 'Fish Input', propName: 'fishInput', completed: false },
  6: { name: 'High Flows', propName: 'highFlows', completed: false },
  7: { name: 'High Temperatures', propName: 'highTemperatures' },
  8: { name: 'Non Functional Trap', propName: 'nonFunctionalTrap' },
  9: { name: 'No Fish Caught', propName: 'noFishCaught' },
  10: { name: 'End Trapping', propName: 'endTrapping' },
  11: { name: 'Incomplete Sections', propName: 'incompleteSections' },
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
      console.log('###', state.steps[state.activeStep])
      state.steps[state.activeStep].completed = action.payload
    },
  },
})

export const { updateActiveStep, markStepCompleted } = navigationSlice.actions

export default navigationSlice.reducer
