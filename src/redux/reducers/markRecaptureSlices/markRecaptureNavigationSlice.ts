import { createSlice } from '@reduxjs/toolkit'

const formSteps = {
  1: { name: 'Release Trial', propName: 'markRecapture', completed: false },
  2: {
    name: 'Release Data Entry',
    propName: 'releaseDataEntry',
    completed: false,
  },
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
  name: 'markRecaptureNavigation',
  initialState: initialState,
  reducers: {
    updateActiveMarkRecaptureStep: (state, action) => {
      state.activeStep = action.payload
    },
    markActiveMarkRecaptureStepCompleted: (state, action) => {
      //currently working: "state.activeStep - 1" could be refactored in the future
      if (state.steps[state.activeStep - 1]?.completed !== undefined) {
        state.steps[state.activeStep - 1].completed = action.payload
      }
    },
  },
})

export const {
  updateActiveMarkRecaptureStep,
  markActiveMarkRecaptureStepCompleted,
} = navigationSlice.actions

export default navigationSlice.reducer
