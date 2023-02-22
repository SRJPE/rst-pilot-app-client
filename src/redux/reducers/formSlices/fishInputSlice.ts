import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import {
  calculateLifeStage,
  reformatBatchCountData,
} from '../../../utils/utils'

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
  // timeCreated: any | null
  // index: number
}
export interface batchCharacteristicsI {
  species: string
  adiposeClipped: boolean
  dead: boolean
  existingMark: string
  forkLengths?: any
  forkLengthsTest?: BatchStoreI
  lastEnteredForkLength: any
}
export const batchCharacteristicsInitialState: batchCharacteristicsI = {
  species: '',
  adiposeClipped: false,
  dead: false,
  existingMark: '',
  forkLengths: {},
  forkLengthsTest: [],
  lastEnteredForkLength: null,
}

const testForkLengthsResultToSave = {
  10: [
    {
      lifeStage: 'lifeStage',
      count: 0,
      uid: '123456',
    },
    {
      lifeStage: 'lifeStage',
      count: 0,
      uid: '123456',
    },
  ],
  forkLengthNumberOption2: {},
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
    addForkLengthToBatchStore: (state, action) => {
      // const forkLengthTestCopy = cloneDeep(
      //   state.batchCharacteristics.forkLengthsTest
      // )
      const forkLengthTestCopy = {
        ...state.batchCharacteristics.forkLengthsTest,
      }
      console.log('🚀 ~ forkLengthTestCopy', forkLengthTestCopy)
      const fishEntry = {
        forkLength: action.payload.forkLength,
        lifeStage: action.payload.lifeStage,
      } as any
      let id = null
      if (Object.keys(forkLengthTestCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(forkLengthTestCopy))
        id = largestId + 1
      } else {
        id = 0
      }
      forkLengthTestCopy[id] = fishEntry
      console.log('🚀 ~ forkLengthTestCopy', forkLengthTestCopy)
      state.batchCharacteristics.forkLengthsTest = forkLengthTestCopy
    },
    removeLastForkLengthEntered: (state) => {
      const forkLengthsTestCopy = cloneDeep(
        state.batchCharacteristics.forkLengthsTest
      ) as any
      if (Object.keys(forkLengthsTestCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(forkLengthsTestCopy))
        console.log('🚀 ~ largestId', largestId)
        delete forkLengthsTestCopy[largestId]
      }
      console.log('🚀 ~ forkLengthsTestCopy', forkLengthsTestCopy)
      state.batchCharacteristics.forkLengthsTest = forkLengthsTestCopy

      //THIS IS CURRENTLY NOT UPDATING THE GRAPH OR TABLE
      //NESTED OBJECT CAUSES FAIL TO RERENDER>>>

      //this function is currently limited to remove the SINGLE last fork length entered.
      //possible refactor in the future to allow continuous removal of fork lengths

      // const forkLengthsCopy = { ...state.batchCharacteristics.forkLengths }
      // const lastEnteredForkLengthCopy =
      //   state.batchCharacteristics.lastEnteredForkLength

      // if (!state.batchCharacteristics.lastEnteredForkLength) return

      // if (forkLengthsCopy[lastEnteredForkLengthCopy] === 1) {
      //   delete forkLengthsCopy[lastEnteredForkLengthCopy]
      // } else {
      //   forkLengthsCopy[lastEnteredForkLengthCopy]--
      // }
      // state.batchCharacteristics.forkLengths = forkLengthsCopy
      // state.batchCharacteristics.lastEnteredForkLength = null
    },
    updateSingleForkLengthCount: (state, action) => {
      console.log('🚀 ~ action payload', action.payload)
      // const forkLengthsCopy = { ...state.batchCharacteristics.forkLengths }
      // if (action.payload.count < 1) {
      //   delete forkLengthsCopy[action.payload.forkLength]
      // } else {
      //   forkLengthsCopy[action.payload.forkLength] = Number(
      //     action.payload.count
      //   )
      // }
      // state.batchCharacteristics.forkLengths = forkLengthsCopy
    },
    saveBatchCount: (state) => {
      //makes a clone of the MAIN fish store OBJECT
      //makes a copy of the forkLengths SIMPLE OBJECT

      //for each key in the forkLengths object
      //create a batch count entry

      //create an id set to null
      //if the MAIN fish store in empty (is the first entry)
      //add a property at id with the batch count entry as a value
      //otherwise
      //find the next id possible and assign that to to be the value of id
      //add a property at id with the batch count entry as a value

      //reset the batchCountStores

      //INSTEAD DATA SHOULD BE CONVERTED TO THIS =>
      const TEST = {
        12: {
          'Yolk Sac Fry': 1,
        },
        14: {
          'Yolk Sac Fry': 2,
          Fry: 1,
        },
      }

      //makes a clone of the MAIN fish store OBJECT
      //makes a copy of the forkLengthsTest Indexed OBJECT
      let fishStoreCopy = cloneDeep(state.fishStore)
      const forkLengthsTestCopy = cloneDeep(
        state.batchCharacteristics.forkLengthsTest
      )

      console.log('🚀 ~ forkLengthsTestCopy', forkLengthsTestCopy)

      const TESTCHAT = reformatBatchCountData(forkLengthsTestCopy)
      console.log('🚀 ~ TESTCHAT', TESTCHAT)
      // const batchCountEntry = {
      //   species: state.batchCharacteristics.species,
      //   numFishCaught: null, //
      //   forkLength: null, //
      //   run: null,
      //   weight: null,
      //   lifeStage: null, //
      //   adiposeClipped: state.batchCharacteristics.adiposeClipped,
      //   existingMark: state.batchCharacteristics.existingMark,
      //   dead: state.batchCharacteristics.dead,
      //   willBeUsedInRecapture: null,
      //   plusCountMethod: null,
      //   plusCount: false,
      // } as any

      for (let key in TESTCHAT) {
        console.log('🚀 ~ Prop', key, TESTCHAT[key])
        for (let innerKey in TESTCHAT[key]) {
          console.log('🚀 ~ Prop Inside', innerKey, TESTCHAT[key][innerKey])

          // batchCountEntry.forkLength = key
          // batchCountEntry.lifeStage = innerKey
          // batchCountEntry.numFishCaught = TESTCHAT[key][innerKey]
          const batchCountEntry = {
            species: state.batchCharacteristics.species,
            numFishCaught: TESTCHAT[key][innerKey], //
            forkLength: key, //
            run: null,
            weight: null,
            lifeStage: innerKey, //
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

      // let fishStoreCopy = cloneDeep(state.fishStore)
      // const forkLengthsCopy = { ...state.batchCharacteristics.forkLengths }
      // console.log('🚀 ~ forkLengthsCopy', forkLengthsCopy)

      // for (let key in forkLengthsCopy) {
      //   const batchCountEntry = {
      //     species: state.batchCharacteristics.species,
      //     numFishCaught: forkLengthsCopy[key],
      //     forkLength: Number(key),
      //     run: null,
      //     weight: null,
      //     lifeStage: calculateLifeStage(Number(key)),
      //     adiposeClipped: state.batchCharacteristics.adiposeClipped,
      //     existingMark: state.batchCharacteristics.existingMark,
      //     dead: state.batchCharacteristics.dead,
      //     willBeUsedInRecapture: null,
      //     plusCountMethod: null,
      //     plusCount: false,
      //   } as any
      //   let id = null
      //   if (Object.keys(fishStoreCopy).length) {
      //     // @ts-ignore
      //     const largestId = Math.max(...Object.keys(fishStoreCopy))
      //     id = largestId + 1
      //   } else {
      //     id = 0
      //   }

      //   fishStoreCopy[id] = batchCountEntry
      // }

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
  addForkLengthToBatchCount,
  removeLastForkLengthEntered,
  saveBatchCount,
  updateSingleForkLengthCount,
  addForkLengthToBatchStore,
} = saveFishSlice.actions

export default saveFishSlice.reducer
