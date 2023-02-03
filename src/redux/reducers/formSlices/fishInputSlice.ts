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
  willBeUsedInRecapture: boolean | null
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
  species: string
  adiposeClipped: boolean
  dead: boolean
  existingMark: string
  forkLengths?: any
  lastEnteredForkLength: any
}
export const batchCharacteristicsInitialState: batchCharacteristicsI = {
  species: '',
  adiposeClipped: false,
  dead: false,
  existingMark: '',
  forkLengths: {},
  lastEnteredForkLength: null,
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
      const { species, adiposeClipped, dead, existingMark } = action.payload
      const forkLengthsCopy = { ...state.batchCharacteristics.forkLengths }
      const lastEnteredForkLengthCopy =
        state.batchCharacteristics.lastEnteredForkLength

      state.batchCharacteristics = {
        species,
        adiposeClipped,
        dead,
        existingMark,
        forkLengths: forkLengthsCopy,
        lastEnteredForkLength: lastEnteredForkLengthCopy,
      }
    },
    addForkLengthToBatchCount: (state, action) => {
      const forkLengthsCopy = { ...state.batchCharacteristics.forkLengths }
      //add fork length to batch count
      state.batchCharacteristics.forkLengths &&
        (forkLengthsCopy[action.payload] === undefined
          ? (forkLengthsCopy[action.payload] = 1)
          : forkLengthsCopy[action.payload]++)
      //update lastEnteredForkLength
      state.batchCharacteristics.forkLengths = forkLengthsCopy
      state.batchCharacteristics.lastEnteredForkLength = action.payload
    },
    removeLastForkLengthEntered: (state) => {
      //this function is currently limited to remove the SINGLE last fork length entered.
      //possible refactor in the future to allow continuous removal of fork lengths

      const forkLengthsCopy = { ...state.batchCharacteristics.forkLengths }
      const lastEnteredForkLengthCopy =
        state.batchCharacteristics.lastEnteredForkLength

      if (!state.batchCharacteristics.lastEnteredForkLength) return

      if (forkLengthsCopy[lastEnteredForkLengthCopy] === 1) {
        delete forkLengthsCopy[lastEnteredForkLengthCopy]
      } else {
        forkLengthsCopy[lastEnteredForkLengthCopy]--
      }
      state.batchCharacteristics.forkLengths = forkLengthsCopy
      state.batchCharacteristics.lastEnteredForkLength = null
    },
    updateSingleForkLengthCount: (state, action) => {
      const forkLengthsCopy = { ...state.batchCharacteristics.forkLengths }
      if (action.payload.count < 1) {
        delete forkLengthsCopy[action.payload.forkLength]
      } else {
        forkLengthsCopy[action.payload.forkLength] = Number(
          action.payload.count
        )
      }
      state.batchCharacteristics.forkLengths = forkLengthsCopy
    },
    saveBatchCount: (state) => {
      let fishStoreCopy = cloneDeep(state.fishStore)
      const forkLengthsCopy = { ...state.batchCharacteristics.forkLengths }

      for (let key in forkLengthsCopy) {
        const batchCountEntry = {
          species: state.batchCharacteristics.species,
          numFishCaught: forkLengthsCopy[key],
          forkLength: Number(key),
          run: null,
          weight: null,
          lifeStage: null,
          adiposeClipped: state.batchCharacteristics.adiposeClipped,
          existingMark: state.batchCharacteristics.existingMark,
          dead: state.batchCharacteristics.dead,
          willBeUsedInRecapture: null,
          plusCountMethod: null,
          plusCount: false,
        } as any
        let id = null
        if (Object.keys(fishStoreCopy).length) {
          // @ts-ignore
          const largestId = Math.max(...Object.keys(fishStoreCopy))
          id = largestId + 1
        } else {
          id = 0
        }

        fishStoreCopy[id] = batchCountEntry
      }

      state.fishStore = fishStoreCopy
      state.batchCharacteristics = {
        species: '',
        adiposeClipped: false,
        dead: false,
        existingMark: '',
        forkLengths: {},
        lastEnteredForkLength: null,
      }
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
  saveBatchCount,
  updateSingleForkLengthCount,
} = saveFishSlice.actions

export default saveFishSlice.reducer
