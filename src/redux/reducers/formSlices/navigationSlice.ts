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
  8: { name: 'Start Mark Recapture', propName: 'StartMarkRecapture' },
  9: { name: 'High Flows', propName: 'highFlows' },
  10: { name: 'High Temperatures', propName: 'highTemperatures' },
  11: { name: 'Non Functional Trap', propName: 'nonFunctionalTrap' },
  12: { name: 'No Fish Caught', propName: 'noFishCaught' },
  13: { name: 'End Trapping', propName: 'endTrapping' },
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
    updateActiveStep: (state, action) => {
      state.activeStep = action.payload
    },
    markStepCompleted: (state, action) => {
      //currently working: "state.activeStep - 1" could be refactored in the future
      if (state.steps[state.activeStep - 1]?.completed !== undefined) {
        state.steps[state.activeStep - 1].completed = action.payload
      }
    },
    checkIfFormIsComplete: state => {
      //if all steps are completed,
      //iterate over the first 6 step and check if all steps are completed
      if (state.steps) {
        const stepsArray = Object.values(state.steps).slice(0, 6)
        console.log('🚀 ~ stepsArray', stepsArray)
        const isFormComplete = stepsArray.some((step: any) => {
          console.log('step: ', step.name, step.completed)
          step.completed === false
        })
        console.log('🚀 ~ isFormComplete ~ isFormComplete', isFormComplete)

        //mark form IsCompleted as True
        state.isFormComplete = isFormComplete

        // console.log(
        //   'TEST',
        //   Object.values(state.steps)
        //     .slice(0, 6)
        //     .some((step: any) => {
        //       console.log('step: ', step.name, step.completed)
        //       step.completed === false
        //     })
        // )
        // state.isFormComplete = Object.values(state.steps)
        //   .slice(0, 6)
        //   .some((step: any) => {
        //     console.log('step: ', step.name, step.completed)
        //     step.completed === false
        //   })
      }
    },
  },
})

export const { updateActiveStep, markStepCompleted, checkIfFormIsComplete } =
  navigationSlice.actions

export default navigationSlice.reducer
