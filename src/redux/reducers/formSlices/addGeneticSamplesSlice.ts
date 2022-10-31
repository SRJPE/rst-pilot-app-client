import { createSlice } from '@reduxjs/toolkit'
import { uid } from 'uid'

interface InitialStateI {
  values: GeneticSampleValuesI[]
}

export interface GeneticSampleValuesI {
  id: string
  sampleIdNumber: string
  mucusSwabCollected: boolean
  finClipCollected: boolean
  crewMemberCollectingSample: boolean
  comments?: string
}

const initialState: InitialStateI = {
  values: [],
}

export const addGeneticSamplesSlice = createSlice({
  name: 'addGeneticSamplesSlice',
  initialState: initialState,
  reducers: {
    saveGeneticSampleData: (state, action) => {
      state.values.push({ ...action.payload, id: uid() })
    },
  },
})

export const { saveGeneticSampleData } = addGeneticSamplesSlice.actions

export default addGeneticSamplesSlice.reducer
