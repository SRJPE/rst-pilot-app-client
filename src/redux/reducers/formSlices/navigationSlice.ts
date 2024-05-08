import { createSlice } from '@reduxjs/toolkit'
import FishHolding from '../../../screens/formScreens/FishHolding'

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
  16: { name: 'Fish Holding', propName: 'FishHolding' },
}

export interface NavigationStateI {
  activeStep: number
  steps: any
  previousPageWasIncompleteSections?: boolean
  isFormComplete?: boolean
}

const initialState: NavigationStateI = {
  activeStep: 1,
  steps: formSteps,
  previousPageWasIncompleteSections: false,
  isFormComplete: false,
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: initialState,
  reducers: {
    resetNavigationSlice: () => initialState,
    togglePreviousPageWasIncompleteSections: (state) => {
      state.previousPageWasIncompleteSections =
        !state.previousPageWasIncompleteSections
    },
    updateActiveStep: (state, action) => {
      state.activeStep = action.payload
    },
    markStepCompleted: (state, action) => {
      let steps = {...state.steps}
      Object.keys(steps).forEach((key) => {
        if (steps[key].propName === action.payload.propName) {
          steps[key] = { ...steps[key], completed: true }
        }
      })
      state.steps = steps
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
  togglePreviousPageWasIncompleteSections,
} = navigationSlice.actions

export default navigationSlice.reducer
