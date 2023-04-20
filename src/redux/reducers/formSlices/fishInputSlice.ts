import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { reformatBatchCountData } from '../../../utils/utils'

interface InitialStateI {
  [tabId: string]: FishInputStateI
}

interface FishInputStateI {
  completed: boolean
  modalOpen: boolean
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

const initialState: InitialStateI = {
  placeholderId: {
    completed: false,
    modalOpen: false,
    speciesCaptured: [],
    fishStore: {},
  },
}

export const saveFishSlice = createSlice({
  name: 'fishInput',
  initialState: initialState,
  reducers: {
    resetFishInputSlice: () => initialState,
    saveFishInput: (state, action) => {
      const { tabId, speciesCaptured } = action.payload
      if (state[tabId]) {
        state[tabId].speciesCaptured = speciesCaptured
      } else {
        const payload = { ...initialState.placeholderId, speciesCaptured }
        state[tabId] = payload
      }
    },

    saveBatchCount: (state, action) => {
      const {
        tabId,
        species,
        adiposeClipped,
        dead,
        existingMark,
        forkLengths,
      } = action.payload
      let fishStoreCopy = cloneDeep(
        state[tabId] ? state[tabId].fishStore : state['placeholderId'].fishStore
      )

      const reformatedBatchCountData = reformatBatchCountData(forkLengths)

      for (let key in reformatedBatchCountData) {
        for (let innerKey in reformatedBatchCountData[key]) {
          const batchCountEntry = {
            species: species,
            numFishCaught: reformatedBatchCountData[key][innerKey], //updated
            forkLength: key, //updated
            run: 'not recorded', //updated
            weight: null,
            lifeStage: species === 'Chinook salmon' ? innerKey : 'not recorded', //updated
            adiposeClipped: adiposeClipped,
            existingMark: existingMark,
            dead: dead,
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
      }
      if (state[tabId]) {
        state[tabId].fishStore = fishStoreCopy
      } else {
        state[tabId] = {
          ...initialState['placeholderId'],
          fishStore: fishStoreCopy,
        }
      }
    },
    saveIndividualFish: (state, action) => {
      const { tabId, formValues } = action.payload
      // if (state[tabId]) {}
      let fishStoreCopy = cloneDeep(
        state[tabId] ? state[tabId].fishStore : state['placeholderId'].fishStore
      )
      let id = null
      if (Object.keys(fishStoreCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(fishStoreCopy))
        id = largestId + 1
      } else {
        id = 0
      }
      fishStoreCopy[id] = { ...formValues, numFishCaught: 1 }

      if (state[tabId]) {
        state[tabId].fishStore = fishStoreCopy
      } else {
        state[tabId] = {
          ...initialState['placeholderId'],
          fishStore: fishStoreCopy,
        }
      }
    },
    savePlusCount: (state, action) => {
      const { tabId, species, count, run, lifeStage, plusCountMethod } =
        action.payload

      const plusCountEntry = {
        species,
        numFishCaught: count,
        forkLength: null,
        run,
        weight: null,
        lifeStage,
        adiposeClipped: null,
        existingMark: '',
        dead: null,
        willBeUsedInRecapture: null,
        plusCountMethod,
        plusCount: true,
      } as IndividualFishValuesI

      let fishStoreCopy = cloneDeep(
        state[tabId] ? state[tabId].fishStore : state['placeholderId'].fishStore
      )
      let id = null
      if (Object.keys(fishStoreCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(fishStoreCopy))
        id = largestId + 1
      } else {
        id = 0
      }
      if (state[tabId]) {
        state[tabId].fishStore = fishStoreCopy
      } else {
        state[tabId] = {
          ...initialState['placeholderId'],
          fishStore: fishStoreCopy,
        }
      }

      fishStoreCopy[id] = plusCountEntry
      state[tabId].fishStore = fishStoreCopy
    },
    updateFishEntry: (state, action) => {
      const tabId = action.payload.tabId
      const id = action.payload.id
      let fishStoreCopy = cloneDeep(state[tabId].fishStore)
      let actionPayloadCopy = action.payload
      delete actionPayloadCopy.id
      delete actionPayloadCopy.tabId
      fishStoreCopy[id] = actionPayloadCopy
      state[tabId].fishStore = fishStoreCopy
    },
    deleteFishEntry: (state, action) => {
      const { tabId, id } = action.payload
      let fishStoreCopy = cloneDeep(state[tabId].fishStore)
      delete fishStoreCopy[id]
      state[tabId].fishStore = fishStoreCopy
    },
    markFishInputCompleted: (state, action) => {
      const { tabId, bool } = action.payload
      state[tabId].completed = bool
    },
    markFishInputModalOpen: (state, action) => {
      const { tabId, bool } = action.payload
      state[tabId].modalOpen = bool
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
  // saveBatchCharacteristics,
  // removeLastForkLengthEntered,
  saveBatchCount,
  // updateSingleForkLengthCount,
  // addForkLengthToBatchStore,
} = saveFishSlice.actions

export default saveFishSlice.reducer
