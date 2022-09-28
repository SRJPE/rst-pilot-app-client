import { createSlice } from '@reduxjs/toolkit'

const formSteps = {
  1: { name: 'Visit Setup', completed: false },
  2: { name: 'Trap Status', completed: false },
  3: { name: 'Trap Operations', completed: false },
  4: { name: 'Fish Processing', completed: false },
  5: { name: 'Fish Input', completed: false },
  // 6: { name: 'High Flows', completed: false },
  // 7: { name: 'High Temperatures', completed: false },
  // 8: { name: 'Non Functional Trap', completed: false },
  // 9: { name: 'No Fish Caught', completed: false },
  // 10: { name: 'End Trapping', completed: false },
} as any

//display these pages in a differnt structure
const test = {
  1: { name: 'High Flows', completed: false },
  2: { name: 'High Temperatures', completed: false },
  3: { name: 'Non Functional Trap', completed: false },
  4: { name: 'No Fish Caught', completed: false },
  5: { name: 'End Trapping', completed: false },
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
    markStepCompleted: (state, action) => {},
    navigateFlow: (state, action) => {},
  },
})

export const { updateActiveStep, markStepCompleted } = navigationSlice.actions

export default navigationSlice.reducer
