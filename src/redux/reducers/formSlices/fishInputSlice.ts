import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  completed: boolean
  modalOpen: boolean
  values: FishInputValuesI
  individualFish: IndividualFishValuesI[]
}

export interface IndividualFishValuesI {
  species: string
  forkLength: number
  run: string
  weight?: number
  lifestage: string
  adiposeClipped: boolean
  existingMark: string
  dead: boolean
  willBeUsedInRecapture: boolean
}

export const individualFishInitialState = {
  species: '',
  forkLength: '',
  run: '',
  weight: '',
  lifestage: '',
  adiposeClipped: false,
  existingMark: '',
  dead: false,
  willBeUsedInRecapture: false,
}

export interface FishInputValuesI {
  speciesCaptured: Array<string>
}

const initialState: InitialStateI = {
  completed: false,
  modalOpen: false,
  values: {
    speciesCaptured: [],
  },
  individualFish: [],
}

export const saveFishSlice = createSlice({
  name: 'fishInput',
  initialState: initialState,
  reducers: {
    saveFishInput: (state, action) => {
      state.values = action.payload
    },
    saveIndividualFish: (state, action) => {
      let individualFishCopy = [...state.individualFish]
      individualFishCopy.push(action.payload)
      state.individualFish = individualFishCopy
    },
    markFishInputCompleted: (state, action) => {
      state.completed = action.payload
    },
    markFishInputModalOpen: (state, action) => {
      state.modalOpen = action.payload
    },
  },
})

export const { saveFishInput, saveIndividualFish, markFishInputCompleted, markFishInputModalOpen } =
  saveFishSlice.actions

export default saveFishSlice.reducer
