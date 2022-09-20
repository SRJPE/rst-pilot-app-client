import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const ACTIONS = {
  UPDATE_ACTIVE_STEP: 'update-active-step',
}

const formSteps = [
  { name: 'Visit Setup', completed: false },
  { name: 'Trap Status', completed: false },
  { name: 'Trap Operations', completed: false },
  { name: 'Fish Processing', completed: false },
  { name: 'Fish Input', completed: false },
] as Array<any>

export interface NavigationState {
  activeStep: number
  steps: Array<any>
  formIsValid?: boolean
}

export const initialState: NavigationState = {
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
