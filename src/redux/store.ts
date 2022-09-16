import { configureStore } from '@reduxjs/toolkit'
import dropdownsSlice from './reducers/dropdownsSlice'

export const store = configureStore({
  reducer: {
    dropdowns: dropdownsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
