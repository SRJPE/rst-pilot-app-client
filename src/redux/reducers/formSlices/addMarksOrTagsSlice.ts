import { createSlice } from '@reduxjs/toolkit'
import { uid } from 'uid'

interface InitialStateI {
  values: MarkOrTagFishValuesI[]
}

export interface MarkOrTagFishValuesI {
  id: string
  type: string
  number: string
  position: string
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
      state.values.push({ ...action.payload, id: uid() })
    },
  },
})

export const { resetMarksOrTagsSlice, saveMarkOrTagData } =
  addMarksOrTagsSlice.actions

export default addMarksOrTagsSlice.reducer
