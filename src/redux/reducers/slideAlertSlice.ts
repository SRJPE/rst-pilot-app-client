import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  slideAlertOpen: boolean
  slideAlertInfo?: string
}

const initialState: InitialStateI = {
  slideAlertOpen: false,
  slideAlertInfo: '',
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
    setSlideAlertInfo: (state, action) => {
      state.slideAlertInfo = action.payload
    },
  },
})

export const showSlideAlert = (dispatch: any, slideInfo: string) => {
  dispatch(setSlideAlertInfo(slideInfo))
  dispatch(openSlideAlert())
  setTimeout(() => {
    dispatch(closeSlideAlert())
  }, 1500)
}

export const { openSlideAlert, closeSlideAlert, setSlideAlertInfo } =
  slideAlertSlice.actions

export default slideAlertSlice.reducer
