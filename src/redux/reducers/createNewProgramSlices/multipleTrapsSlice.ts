import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

interface InitialStateI {
  completed: boolean
  numberOfTrappingSites: number | null
  multipleTrapsStore: MultipleTrapsStoreI
}

const initialState: InitialStateI = {
  completed: false,
  numberOfTrappingSites: null,
  multipleTrapsStore: {},
}

export interface MultipleTrapsStoreI {
  [siteName: string]: Array<string>
}

export const multipleTrapsSlice = createSlice({
  name: 'multipleTraps',
  initialState: initialState,
  reducers: {
    resetTrappingSitesSlice: () => initialState,
    saveMultipleTraps: (state, action) => {
      let multipleTrapsStoreCopy = cloneDeep(state.multipleTrapsStore)
      console.log('🚀 ~ payload:', action.payload)
      console.log('🚀 ~ multipleTrapsStoreCopy:', multipleTrapsStoreCopy)
    },
  },
})

export const { saveMultipleTraps } = multipleTrapsSlice.actions

export default multipleTrapsSlice.reducer
