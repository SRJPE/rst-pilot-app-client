import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const formSteps = [
  { name: 'Visit Setup', completed: false },
  { name: 'Trap Status', completed: false },
  { name: 'Trap Operations', completed: false },
  { name: 'Fish Processing', completed: false },
  { name: 'Fish Input', completed: false },
] as Array<any>

interface NavigationStateI {
  activeStep: number
  steps: Array<any>
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
