import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

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
  lifeStage: string
  adiposeClipped: boolean
  existingMark: string
  dead: boolean
  willBeUsedInRecapture: boolean
  plusCountMethod: string
}

export const individualFishInitialState = {
  species: '',
  forkLength: '',
  run: '',
  weight: '',
  lifeStage: '',
  adiposeClipped: false,
  existingMark: '',
  dead: false,
  willBeUsedInRecapture: false,
  plusCountMethod: '',
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
      let individualFishCopy = cloneDeep(state.individualFish)
      individualFishCopy.push(action.payload)
      state.individualFish = individualFishCopy
    },
    savePlusCount: (state, action) => {
      //create fish objects according to plus count and add all to individualFish
      let count = action.payload.count
      const plusCountFormatted = [] as Array<any>
      for (let i = 0; i < count; i++) {
        plusCountFormatted.push({
          species: action.payload.species,
          forkLength: '',
          run: action.payload.run,
          weight: '',
          lifeStage: action.payload.lifeStage,
          adiposeClipped: false,
          existingMark: '',
          dead: false,
          willBeUsedInRecapture: false,
          plusCountMethod: action.payload.plusCountMethod,
        } as any)
      }
      let individualFishCopy = cloneDeep(state.individualFish)
      const combinedArrays = individualFishCopy.concat(plusCountFormatted)
      state.individualFish = combinedArrays
    },
    markFishInputCompleted: (state, action) => {
      state.completed = action.payload
    },
    markFishInputModalOpen: (state, action) => {
      state.modalOpen = action.payload
    },
  },
})

export const {
  saveFishInput,
  saveIndividualFish,
  savePlusCount,
  markFishInputCompleted,
  markFishInputModalOpen,
} = saveFishSlice.actions

export default saveFishSlice.reducer
