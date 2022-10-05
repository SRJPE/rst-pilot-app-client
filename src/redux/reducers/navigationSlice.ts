import { createSlice } from '@reduxjs/toolkit'

const formSteps = {
  1: { name: 'Visit Setup', propName: 'visitSetup' },
  2: { name: 'Trap Status', propName: 'trapStatus' },
  3: { name: 'Trap Operations', propName: 'trapOperations' },
  4: { name: 'Fish Processing', propName: 'fishProcessing' },
  5: { name: 'Fish Input', propName: 'fishInput' },
  6: { name: 'High Flows', propName: 'highFlows' },
  7: { name: 'High Temperatures', propName: 'highTemperatures' },
  8: { name: 'Non Functional Trap', propName: 'nonFunctionalTrap' },
  9: { name: 'No Fish Caught', propName: 'noFishCaught' },
  10: { name: 'End Trapping', propName: 'endTrapping' },
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
  },
})

export const { updateActiveStep } = navigationSlice.actions

export default navigationSlice.reducer
