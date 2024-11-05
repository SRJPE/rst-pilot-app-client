import { createSlice } from '@reduxjs/toolkit'
import { color } from 'native-base/lib/typescript/theme/styled-system'

export interface SlideAlertInitialStateI {
  slideAlertOpen: boolean
  slideAlertTitle: string
  slideAlertColor: 'success' | 'error' | 'warning' | 'info'
}

const initialState: SlideAlertInitialStateI = {
  slideAlertOpen: false,
  slideAlertTitle: '',
  slideAlertColor: 'success',
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
    setSlideAlertColor: (state, action) => {
      state.slideAlertColor = action.payload
    },
  },
})

export const showSlideAlert = (
  dispatch: any,
  slideTitle?: string,
  slideColor: 'success' | 'error' = 'success',
  slideDuration: number = 2000
) => {
  dispatch(setSlideAlertTitle(slideTitle))
  dispatch(setSlideAlertColor(slideColor))
  dispatch(openSlideAlert())
  setTimeout(() => {
    dispatch(closeSlideAlert())
  }, slideDuration)
}

// export const showSlideAlertWithParams = (
//   dispatch: any,
//   slideParams: {
//     title: string
//     color: 'success' | 'error' | 'warning' | 'info'
//     open: boolean
//   },
//   slideDuration?: number
// ) => {
//   dispatch(setSlideAlertParams(slideParams))
//   setTimeout(() => {
//     dispatch(setSlideAlertParams({ title: '', color: 'success', open: false }))
//   }, slideDuration || 2000)
// }

export const {
  openSlideAlert,
  closeSlideAlert,
  setSlideAlertTitle,
  setSlideAlertColor,
} = slideAlertSlice.actions

export default slideAlertSlice.reducer
