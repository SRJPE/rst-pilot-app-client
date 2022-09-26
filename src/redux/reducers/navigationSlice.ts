import { createSlice } from '@reduxjs/toolkit'

const formSteps = {
  1: { name: 'Visit Setup', completed: false },
  2: { name: 'Trap Status', completed: false },
  3: { name: 'Trap Operations', completed: false },
  4: { name: 'Fish Processing', completed: false },
  5: { name: 'Fish Input', completed: false },
} as any

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
