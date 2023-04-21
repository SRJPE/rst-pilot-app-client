import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { uid } from 'uid'

interface InitialStateI {
  values: MarkOrTagFishValuesI[]
}

export interface MarkOrTagFishValuesI {
  UID: string
  markType: string
  markColor: string
  markPosition: string
  crewMemberTagging: string
  comments?: string
}

const initialState: InitialStateI = {
  values: [],
}

export const addMarksOrTagsSlice = createSlice({
  name: 'addMarksOrTagsSlice',
  initialState: initialState,
  reducers: {
    resetMarksOrTagsSlice: () => initialState,
    saveMarkOrTagData: (state, action) => {
      let markOrTagDataCopy = cloneDeep(state.values)
      markOrTagDataCopy.push(action.payload)
      state.values = markOrTagDataCopy
    },
  },
})

export const { resetMarksOrTagsSlice, saveMarkOrTagData } =
  addMarksOrTagsSlice.actions

export default addMarksOrTagsSlice.reducer
