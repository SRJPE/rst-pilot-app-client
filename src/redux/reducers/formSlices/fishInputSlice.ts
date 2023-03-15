import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { reformatBatchCountData } from '../../../utils/utils'

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

    addForkLengthToBatchStore: (state, action) => {
      const forkLengthsCopy = cloneDeep(
        state.batchCharacteristics.forkLengths
      ) || {
        ...state.batchCharacteristics.forkLengths,
      }
      const fishEntry = {
        forkLength: action.payload.forkLength,
        lifeStage: action.payload.lifeStage,
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
      state.batchCharacteristics.forkLengths = forkLengthsCopy
    },

    removeLastForkLengthEntered: (state) => {
      const forkLengthsCopy = cloneDeep(
        state.batchCharacteristics.forkLengths
      ) as any
      if (Object.keys(forkLengthsCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(forkLengthsCopy))
        delete forkLengthsCopy[largestId]
      }
      state.batchCharacteristics.forkLengths = forkLengthsCopy
    },

    updateSingleForkLengthCount: (state, action) => {
      const forkLengthsState: any = cloneDeep(
        state.batchCharacteristics.forkLengths
      )
      const { forkLength } = action.payload

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
      state.batchCharacteristics.forkLengths = forkLengthsState
    },

    saveBatchCount: (state) => {
      let fishStoreCopy = cloneDeep(state.fishStore)
      const forkLengthsCopy = cloneDeep(state.batchCharacteristics.forkLengths)
      const reformatedBatchCountData = reformatBatchCountData(forkLengthsCopy)

      for (let key in reformatedBatchCountData) {
        for (let innerKey in reformatedBatchCountData[key]) {
          const batchCountEntry = {
            species: state.batchCharacteristics.species,
            numFishCaught: reformatedBatchCountData[key][innerKey], //updated
            forkLength: key, //updated
            run: 'not recorded', //updated
            weight: null,
            lifeStage:
              state.batchCharacteristics.species === 'Chinook salmon'
                ? innerKey
                : 'not recorded', //updated
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
      }

      state.fishStore = fishStoreCopy
      state.batchCharacteristics = {
        species: '',
        adiposeClipped: false,
        dead: false,
        existingMark: '',
        forkLengths: {},
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
      console.log('🚀 ~ fishStoreCopy[id]', fishStoreCopy)
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
  removeLastForkLengthEntered,
  saveBatchCount,
  updateSingleForkLengthCount,
  addForkLengthToBatchStore,
} = saveFishSlice.actions

export default saveFishSlice.reducer
