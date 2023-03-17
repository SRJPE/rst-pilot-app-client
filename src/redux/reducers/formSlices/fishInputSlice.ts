import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { reformatBatchCountData } from '../../../utils/utils'

interface InitialStateI {
  [tabGroupId: string]: FishInputStateI
}

interface FishInputStateI {
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
export interface BatchStoreI {
  [id: number]: singleBatchRawI
}
export interface singleBatchRawI {
  forkLength: number
  lifeStage: string
}

export interface batchCharacteristicsI {
  species: string
  adiposeClipped: boolean
  dead: boolean
  existingMark: string
  forkLengths?: BatchStoreI
}
export const batchCharacteristicsInitialState: batchCharacteristicsI = {
  species: '',
  adiposeClipped: false,
  dead: false,
  existingMark: '',
  forkLengths: {},
}

const initialState: InitialStateI = {
  placeholderId: {
    completed: false,
    modalOpen: false,
    batchCharacteristics: batchCharacteristicsInitialState,
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
      const { tabGroupId, speciesCaptured } = action.payload
      if (state[tabGroupId]) {
        state[tabGroupId].speciesCaptured = speciesCaptured
      } else {
        const payload = { ...initialState.placeholderId, speciesCaptured }
        state[tabGroupId] = payload
      }
    },

    saveBatchCharacteristics: (state, action) => {
      const { tabGroupId, species, adiposeClipped, dead, existingMark } =
        action.payload

      if (state[tabGroupId]) {
        state[tabGroupId].batchCharacteristics = {
          ...state[tabGroupId].batchCharacteristics,
          species,
          adiposeClipped,
          dead,
          existingMark,
        }
      } else {
        const payload = {
          ...initialState.placeholderId,
          batchCharacteristics: {
            ...batchCharacteristicsInitialState,
            species,
            adiposeClipped,
            dead,
            existingMark,
          },
        }
        state[tabGroupId] = payload
      }
    },

    addForkLengthToBatchStore: (state, action) => {
      const { tabGroupId, forkLength, lifeStage } = action.payload
      const forkLengthsCopy = cloneDeep(
        state[tabGroupId].batchCharacteristics.forkLengths
      ) || {
        ...state[tabGroupId].batchCharacteristics.forkLengths,
      }
      const fishEntry = {
        forkLength,
        lifeStage,
      } as any
      let id = null
      if (Object.keys(forkLengthsCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(forkLengthsCopy))
        id = largestId + 1
      } else {
        id = 0
      }
      forkLengthsCopy[id] = fishEntry
      state[tabGroupId].batchCharacteristics.forkLengths = forkLengthsCopy
    },

    removeLastForkLengthEntered: (state, action) => {
      const { tabGroupId } = action.payload
      const forkLengthsCopy = cloneDeep(
        state[tabGroupId].batchCharacteristics.forkLengths
      ) as any
      if (Object.keys(forkLengthsCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(forkLengthsCopy))
        delete forkLengthsCopy[largestId]
      }
      state[tabGroupId].batchCharacteristics.forkLengths = forkLengthsCopy
    },

    updateSingleForkLengthCount: (state, action) => {
      const { tabGroupId, forkLength } = action.payload

      const forkLengthsState: any = cloneDeep(
        state[tabGroupId].batchCharacteristics.forkLengths
      )

      /*
        AT A GIVEN FORK LENGTH...

        for each property in the forkLengthsState object besides the first two (FL & Count)
        store the life stage and count as a prop in a object
         delete all props with the same fork length
        create entries in the store to fill in the new values.
      */

      const lifeStagesToUpdate = {} as any
      for (let key in action.payload) {
        if (key === 'forkLength' || key === 'count') continue
        lifeStagesToUpdate[key] = Number(action.payload[key])
      }

      for (let key in forkLengthsState) {
        if (forkLengthsState[key].forkLength === Number(forkLength)) {
          delete forkLengthsState[key]
        }
      }

      for (let key in lifeStagesToUpdate) {
        let count = lifeStagesToUpdate[key]
        //iterate again
        while (count > 0) {
          const fishEntry = {
            forkLength: Number(forkLength),
            lifeStage: key,
          } as any
          let id = null
          if (Object.keys(forkLengthsState).length) {
            // @ts-ignore
            const largestId = Math.max(...Object.keys(forkLengthsState))
            id = largestId + 1
          } else {
            id = 0
          }
          forkLengthsState[id] = fishEntry
          count--
        }
      }
      state[tabGroupId].batchCharacteristics.forkLengths = forkLengthsState
    },

    saveBatchCount: (state, action) => {
      const { tabGroupId } = action.payload
      let fishStoreCopy = cloneDeep(state[tabGroupId].fishStore)
      const forkLengthsCopy = cloneDeep(
        state[tabGroupId].batchCharacteristics.forkLengths
      )
      const reformatedBatchCountData = reformatBatchCountData(forkLengthsCopy)

      for (let key in reformatedBatchCountData) {
        for (let innerKey in reformatedBatchCountData[key]) {
          const batchCountEntry = {
            species: state[tabGroupId].batchCharacteristics.species,
            numFishCaught: reformatedBatchCountData[key][innerKey], //updated
            forkLength: key, //updated
            run: 'not recorded', //updated
            weight: null,
            lifeStage:
              state[tabGroupId].batchCharacteristics.species ===
              'Chinook salmon'
                ? innerKey
                : 'not recorded', //updated
            adiposeClipped:
              state[tabGroupId].batchCharacteristics.adiposeClipped,
            existingMark: state[tabGroupId].batchCharacteristics.existingMark,
            dead: state[tabGroupId].batchCharacteristics.dead,
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

      state[tabGroupId].fishStore = fishStoreCopy
      state[tabGroupId].batchCharacteristics = {
        species: '',
        adiposeClipped: false,
        dead: false,
        existingMark: '',
        forkLengths: {},
      }
    },
    saveIndividualFish: (state, action) => {
      const { tabGroupId, formValues } = action.payload
      // if (state[tabGroupId]) {}
      let fishStoreCopy = cloneDeep(
        state[tabGroupId]
          ? state[tabGroupId].fishStore
          : state['placeholderId'].fishStore
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
      console.log('🚀 ~ fishStoreCopy[id]', fishStoreCopy)
      if (state[tabGroupId]) {
        state[tabGroupId].fishStore = fishStoreCopy
      } else {
        state[tabGroupId] = {
          ...initialState['placeholderId'],
          fishStore: fishStoreCopy,
        }
      }
    },
    savePlusCount: (state, action) => {
      const { tabGroupId, species, count, run, lifeStage, plusCountMethod } =
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

      let fishStoreCopy = cloneDeep(state[tabGroupId].fishStore)
      let id = null
      if (Object.keys(fishStoreCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(fishStoreCopy))
        id = largestId + 1
      } else {
        id = 0
      }

      fishStoreCopy[id] = plusCountEntry
      state[tabGroupId].fishStore = fishStoreCopy
    },
    updateFishEntry: (state, action) => {
      const tabGroupId = action.payload.tabGroupId
      const id = action.payload.id
      let fishStoreCopy = cloneDeep(state[tabGroupId].fishStore)
      let actionPayloadCopy = action.payload
      delete actionPayloadCopy.id
      delete actionPayloadCopy.tabGroupId
      fishStoreCopy[id] = actionPayloadCopy
      state[tabGroupId].fishStore = fishStoreCopy
    },
    deleteFishEntry: (state, action) => {
      const { tabGroupId, id } = action.payload
      let fishStoreCopy = cloneDeep(state[tabGroupId].fishStore)
      delete fishStoreCopy[id]
      state[tabGroupId].fishStore = fishStoreCopy
    },
    markFishInputCompleted: (state, action) => {
      const { tabGroupId, bool } = action.payload
      state[tabGroupId].completed = bool
    },
    markFishInputModalOpen: (state, action) => {
      const { tabGroupId, bool } = action.payload
      state[tabGroupId].modalOpen = bool
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
  removeLastForkLengthEntered,
  saveBatchCount,
  updateSingleForkLengthCount,
  addForkLengthToBatchStore,
} = saveFishSlice.actions

export default saveFishSlice.reducer
