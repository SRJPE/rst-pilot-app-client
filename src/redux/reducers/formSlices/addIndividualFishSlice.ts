import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  values: IndividualFishValuesI
}

export interface IndividualFishValuesI {
  species: string
  forkLength: number
  run: string
  weight?: number | null
  lifeStage: string
  adiposeClipped: boolean
  existingMark: string
  dead: boolean
  willBeUsedInRecapture: boolean
}

const initialState: InitialStateI = {
  completed: false,
  values: {
    species: '',
    forkLength: 0,
    run: '',
    weight: null,
    lifeStage: '',
    adiposeClipped: false,
    existingMark: '',
    dead: false,
    willBeUsedInRecapture: false,
  },
}

export const addIndividualFishSlice = createSlice({
  name: 'addIndividualFishModal',
  initialState: initialState,
  reducers: {
    saveAddFishModalData: (state, action) => {
      state.values = action.payload
    },
    markAddFishModalCompleted: (state, action) => {
      state.completed = action.payload
    },
  },
})

export const { saveAddFishModalData, markAddFishModalCompleted } =
  addIndividualFishSlice.actions

export default addIndividualFishSlice.reducer
