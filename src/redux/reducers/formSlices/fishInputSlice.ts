import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'

interface InitialStateI {
  completed: boolean
  modalOpen: boolean
  batchCharacteristics: any
  speciesCaptured: Array<string>
  fishStore: FishStoreI
}

export interface FishStoreI {
  [id: number]: IndividualFishValuesI
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

export interface batchCharacteristicsI {
  lifeStage: string
  adiposeClipped: boolean
  dead: boolean
  existingMark: string
  forkLengths: number[]
}
export const batchCharacteristicsInitialState: batchCharacteristicsI = {
  lifeStage: '',
  adiposeClipped: false,
  dead: false,
  existingMark: '',
  forkLengths: [],
}

const initialState: InitialStateI = {
  completed: false,
  modalOpen: false,
  batchCharacteristics: batchCharacteristicsInitialState,
  speciesCaptured: [],
  fishStore: {},
}

export const saveFishSlice = createSlice({
  name: 'fishInput',
  initialState: initialState,
  reducers: {
    resetFishInputSlice: () => initialState,
    saveFishInput: (state, action) => {
      state.speciesCaptured = action.payload
    },
    saveBatchCharacteristics: (state, action) => {
      state.batchCharacteristics = action.payload
    },
    addForkLengthToBatchCount: (state, action) => {
      state.batchCharacteristics.forkLengths = [
        ...state.batchCharacteristics.forkLengths,
        action.payload,
      ]
    },
    removeLastForkLengthEntered: (state) => {
      state.batchCharacteristics.forkLengths.pop()
    },
    saveIndividualFish: (state, action) => {
      let fishStoreCopy = cloneDeep(state.fishStore)
      let id = null
      if (Object.keys(fishStoreCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(fishStoreCopy))
        id = largestId + 1
      } else {
        id = 0
      }
      fishStoreCopy[id] = { ...action.payload, numFishCaught: 1 }
      state.fishStore = fishStoreCopy
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

      let fishStoreCopy = cloneDeep(state.fishStore)
      let id = null
      if (Object.keys(fishStoreCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(fishStoreCopy))
        id = largestId + 1
      } else {
        id = 0
      }

      fishStoreCopy[id] = plusCountEntry
      state.fishStore = fishStoreCopy
    },
    updateFishEntry: (state, action) => {
      let fishStoreCopy = cloneDeep(state.fishStore)
      let id = action.payload?.id
      let actionPayloadCopy = action.payload
      delete actionPayloadCopy.id
      fishStoreCopy[id] = actionPayloadCopy
      state.fishStore = fishStoreCopy
    },
    deleteFishEntry: (state, action) => {
      let fishStoreCopy = cloneDeep(state.fishStore)
      delete fishStoreCopy[action.payload]
      state.fishStore = fishStoreCopy
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
  resetFishInputSlice,
  saveFishInput,
  saveIndividualFish,
  savePlusCount,
  updateFishEntry,
  deleteFishEntry,
  markFishInputCompleted,
  markFishInputModalOpen,
  saveBatchCharacteristics,
  addForkLengthToBatchCount,
  removeLastForkLengthEntered,
} = saveFishSlice.actions

export default saveFishSlice.reducer
