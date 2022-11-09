import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  slideAlertOpen: boolean
  slideAlertTitle?: string
}

const initialState: InitialStateI = {
  slideAlertOpen: false,
  slideAlertTitle: '',
}

export const slideAlertSlice = createSlice({
  name: 'slideAlert',
  initialState: initialState,
  reducers: {
    openSlideAlert: state => {
      state.slideAlertOpen = true
    },
    closeSlideAlert: state => {
      state.slideAlertOpen = false
    },
    setSlideAlertTitle: (state, action) => {
      state.slideAlertTitle = action.payload
    },
  },
})

export const showSlideAlert = (dispatch: any, slideTitle?: string) => {
  dispatch(setSlideAlertTitle(slideTitle))
  dispatch(openSlideAlert())
  setTimeout(() => {
    dispatch(closeSlideAlert())
  }, 2000)
}

export const { openSlideAlert, closeSlideAlert, setSlideAlertTitle } =
  slideAlertSlice.actions

export default slideAlertSlice.reducer
