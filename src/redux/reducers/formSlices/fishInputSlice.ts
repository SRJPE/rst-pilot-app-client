import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

interface InitialStateI {
  completed: boolean
  modalOpen: boolean
  speciesCaptured: Array<string>
  individualFish: IndividualFishValuesI[]
}

export interface IndividualFishValuesI {
  species: string
  forkLength: number | null
  run: string
  weight?: number | null
  lifeStage: string
  adiposeClipped: boolean | null
  existingMark: string
  dead: boolean | null
  willBeUsedInRecapture: null
  plusCountMethod: string // | number
  numFishCaught?: number | null
  plusCount?: boolean
}

export const individualFishInitialState = {
  species: '',
  numFishCaught: null,
  forkLength: null,
  run: '',
  weight: null,
  lifeStage: '',
  adiposeClipped: false,
  existingMark: '',
  dead: false,
  willBeUsedInRecapture: false,
  plusCountMethod: '',
  plusCount: false,
}

export interface FishInputValuesI {
  speciesCaptured: Array<string>
}

const initialState: InitialStateI = {
  completed: false,
  modalOpen: false,
  speciesCaptured: [],
  individualFish: [],
}

export const saveFishSlice = createSlice({
  name: 'fishInput',
  initialState: initialState,
  reducers: {
    saveFishInput: (state, action) => {
      // let speciesCapturedCopy = cloneDeep(state.speciesCaptured)
      // speciesCapturedCopy.push(action.payload)
      // state.speciesCaptured = speciesCapturedCopy
      state.speciesCaptured = action.payload
    },
    saveIndividualFish: (state, action) => {
      let individualFishCopy = cloneDeep(state.individualFish)
      individualFishCopy.push({ ...action.payload, numFishCaught: 1 })
      state.individualFish = individualFishCopy
    },
    savePlusCount: (state, action) => {
      const plusCountEntry = {
        species: action.payload.species,
        numFishCaught: action.payload.count,
        forkLength: null,
        run: action.payload.run,
        weight: null,
        lifeStage: action.payload.lifeStage,
        adiposeClipped: null,
        existingMark: '',
        dead: null,
        willBeUsedInRecapture: null,
        plusCountMethod: action.payload.plusCountMethod,
        plusCount: true,
      } as IndividualFishValuesI

      let individualFishCopy = cloneDeep(state.individualFish)
      individualFishCopy.push(plusCountEntry)
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

export const {
  saveFishInput,
  saveIndividualFish,
  savePlusCount,
  markFishInputCompleted,
  markFishInputModalOpen,
} = saveFishSlice.actions

export default saveFishSlice.reducer
