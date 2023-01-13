import { createSlice } from '@reduxjs/toolkit'

export const numOfFormSteps = 6

const formSteps = {
  1: { name: 'Visit Setup', propName: 'visitSetup', completed: false },
  2: { name: 'Trap Operations', propName: 'trapOperations', completed: false },
  3: { name: 'Fish Processing', propName: 'fishProcessing', completed: false },
  4: { name: 'Fish Input', propName: 'fishInput', completed: false },
  5: {
    name: 'Trap Post-Processing',
    propName: 'trapPostProcessing',
    completed: false,
  },
  6: { name: 'Incomplete Sections', propName: 'incompleteSections' },
  7: { name: 'Start Mark Recapture', propName: 'StartMarkRecapture' },
  8: { name: 'High Flows', propName: 'highFlows' },
  9: { name: 'High Temperatures', propName: 'highTemperatures' },
  10: { name: 'Non Functional Trap', propName: 'nonFunctionalTrap' },
  11: { name: 'No Fish Caught', propName: 'noFishCaught' },
  12: { name: 'End Trapping', propName: 'endTrapping' },
  13: { name: 'Add Fish', propName: 'addFish' },
  14: { name: 'Paper Entry', propName: 'paperEntry' },
  15: { name: 'Started Trapping', propName: 'startedTrapping' },
}

interface NavigationStateI {
  activeStep: number
  steps: any
  isFormComplete?: boolean
}

const initialState: NavigationStateI = {
  activeStep: 1,
  steps: formSteps,
  isFormComplete: false,
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: initialState,
  reducers: {
    resetNavigationSlice: () => initialState,
    updateActiveStep: (state, action) => {
      state.activeStep = action.payload
    },
    markStepCompleted: (state, action) => {
      //currently working: "state.activeStep - 1" could be refactored in the future

      //super hacky fixes for the demo:

      //another fix to get visitSetup working properly
      if (action.payload[1] === 'visitSetup') {
        state.steps['1'].completed = action.payload[0]
      } else if (action.payload[1] === 'fishInput') {
        state.steps[state.activeStep].completed = action.payload[0]
      } else if (action.payload[1] === 'fishProcessing') {
        state.steps[state.activeStep - 1].completed = action.payload[0]
      } else {
        state.steps[state.activeStep - 1].completed = action.payload[0]
      }
    },
    checkIfFormIsComplete: (state) => {
      //iterate over the first 6 step and check if all steps are completed
      const stepsArray = Object.values(state.steps).slice(0, 6) as Array<any>
      const incompleteSteps = [] as Array<any>
      for (let step of stepsArray) {
        if (step.completed === false) {
          incompleteSteps.push(step.completed)
        }
      }
      state.isFormComplete = incompleteSteps.length === 0
    },
  },
})

export const {
  resetNavigationSlice,
  updateActiveStep,
  markStepCompleted,
  checkIfFormIsComplete,
} = navigationSlice.actions

export default navigationSlice.reducer
