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
  forkLengths?: any
  lastEnteredForkLength: any
}
// export interface batchCountForkLengthsI {
//   forkLength: number | null
//   count: number | null
// }
// export const batchCountForkLengths: batchCountForkLengthsI = {
//   forkLength: null,
//   count: null,
// }
export const batchCharacteristicsInitialState: batchCharacteristicsI = {
  lifeStage: '',
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
      state.batchCharacteristics = { ...action.payload, forkLengths: [] }
    },
    addForkLengthToBatchCount: (state, action) => {
      //add fork length to batch count
      state.batchCharacteristics.forkLengths &&
        (state.batchCharacteristics.forkLengths[action.payload] === undefined
          ? (state.batchCharacteristics.forkLengths[action.payload] = 1)
          : state.batchCharacteristics.forkLengths[action.payload]++)
      //update lastEnteredForkLength
      state.batchCharacteristics.lastEnteredForkLength = action.payload
    },
    removeLastForkLengthEntered: (state) => {
      console.log('FORK LENGTHS: ', {
        ...state.batchCharacteristics.forkLengths,
      })
      console.log(
        'LAST ENTERED: ',
        state.batchCharacteristics.lastEnteredForkLength
      )

      if (
        state.batchCharacteristics.forkLengths[
          state.batchCharacteristics.lastEnteredForkLength
        ] === 1
      ) {
        delete state.batchCharacteristics.forkLengths[
          state.batchCharacteristics.lastEnteredForkLength
        ]
      } else {
        state.batchCharacteristics.forkLengths[
          state.batchCharacteristics.lastEnteredForkLength
        ]--
      }
    },
    removeForkLength: (state, action) => {
      console.log('VALUE :', action.payload)
    },
    saveBatchCount: (state, action) => {
      let fishStoreCopy = cloneDeep(state.fishStore)
      //look at each entry in the payload
      //for each entry in payload construct an individual fish entry
      action.payload.forEach((fishObject: any) => {
        const batchCountEntry = {
          species: 'BatchCount',
          numFishCaught: fishObject.count,
          forkLength: fishObject.forkLength,
          run: null,
          weight: null,
          lifeStage: state.batchCharacteristics.lifeStage,
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
      })

      state.fishStore = fishStoreCopy
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
  removeForkLength,
} = saveFishSlice.actions

export default saveFishSlice.reducer
