import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { uid } from 'uid'

interface InitialStateI {
  values: GeneticSampleValuesI[]
}

export interface GeneticSampleValuesI {
  id: string
  sampleIdNumber: string
  mucusSwabCollected: boolean
  finClipCollected: boolean
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
      // console.log('🚀 ~ payload Genetic!!!', action.payload)
      // state.values.push({ ...action.payload, id: uid() })
      let geneticSamplesCopy = cloneDeep(state.values)
      geneticSamplesCopy.push({ ...action.payload, id: uid() })
      state.values = geneticSamplesCopy
    },
  },
})

export const { resetGeneticSamplesSlice, saveGeneticSampleData } =
  addGeneticSamplesSlice.actions

export default addGeneticSamplesSlice.reducer
