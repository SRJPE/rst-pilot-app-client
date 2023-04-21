import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { uid } from 'uid'

interface InitialStateI {
  values: GeneticSampleValuesI[]
}

export interface GeneticSampleValuesI {
  UID: string
  sampleId: string
  mucusSwab: boolean
  finClip: boolean
  crewMemberCollectingSample: string
  comments?: string
}

const initialState: InitialStateI = {
  values: [],
}

export const addGeneticSamplesSlice = createSlice({
  name: 'addGeneticSamplesSlice',
  initialState: initialState,
  reducers: {
    resetGeneticSamplesSlice: () => initialState,
    saveGeneticSampleData: (state: any, action: any) => {
      let geneticSamplesCopy = cloneDeep(state.values)
      geneticSamplesCopy.push(action.payload)
      state.values = geneticSamplesCopy
    },
  },
})

export const { resetGeneticSamplesSlice, saveGeneticSampleData } =
  addGeneticSamplesSlice.actions

export default addGeneticSamplesSlice.reducer
