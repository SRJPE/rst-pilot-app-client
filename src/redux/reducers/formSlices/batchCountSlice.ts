import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep } from 'lodash'
import { ReleaseMarkI } from '../addAnotherMarkSlice'

export interface BatchStoreI {
  [id: number]: singleBatchRawI
}
export interface singleBatchRawI {
  forkLength: number | null
  lifeStage: string
  dead: boolean
  fishConditions: boolean
  existingMark: boolean
  species?: string
  uid?: string | null
  runDefinition?: string | null
  taxonCode?: string
}
export interface batchCharacteristicsI {
  species: string
  multiSpecies?: string[]
  adiposeClipped: boolean
  fishConditions: string[]
  existingMarks: Array<ReleaseMarkI>
  taxonCode?: string
}
export interface batchCountI {
  tabId: string | null
  batchCharacteristics: batchCharacteristicsI
  forkLengths?: BatchStoreI
}
export const initialState: batchCountI = {
  tabId: null,
  batchCharacteristics: {
    species: '',
    multiSpecies: [],
    adiposeClipped: false,
    fishConditions: [],
    existingMarks: [],
  },
  forkLengths: {},
}

// add a counter for generating incremental ids without scanning keys
;(initialState as any).nextForkId = 0

const getRun = (species: string, runValue: any) => {
  if (species === 'Chinook salmon') {
    return runValue ? runValue.toLowerCase() : 'not recorded'
  } else {
    return null
  }
}

const getLifeStage = (species: string, lifeStageValue: any) => {
  if (species === 'Chinook salmon' || species === 'Steelhead / rainbow trout') {
    return lifeStageValue ? lifeStageValue.toLowerCase() : 'not recorded'
  } else {
    return null
  }
}

export const batchCountSlice = createSlice({
  name: 'batchCount',
  initialState: initialState,
  reducers: {
    resetBatchCountSlice: () => initialState,
    saveBatchCharacteristics: (state, action) => {
      const {
        tabId,
        species,
        multiSpecies,
        adiposeClipped,
        fishConditions,
        taxonCode,
      } = action.payload
      const forkLengthsCopy = cloneDeep(state.forkLengths) as any
      state.tabId = tabId
      state.batchCharacteristics.species = species
      state.batchCharacteristics.multiSpecies = multiSpecies
      state.batchCharacteristics.taxonCode = taxonCode
      state.batchCharacteristics.adiposeClipped = adiposeClipped
      state.batchCharacteristics.fishConditions = fishConditions
      state.forkLengths = forkLengthsCopy
    },
    addMarkToBatchCountExistingMarks: (state, action) => {
      state.batchCharacteristics.existingMarks = [
        ...state.batchCharacteristics.existingMarks,
        action.payload,
      ]
    },
    removeMarkFromBatchCountExistingMarks: (state, action) => {
      state.batchCharacteristics.existingMarks = action.payload
    },
    addForkLengthToBatchStore: (state, action) => {
      // use an incremental id to avoid scanning keys and deep clones
      // @ts-ignore - we manage nextForkId on the slice
      const id = (state as any).nextForkId || 0
      ;(state as any).nextForkId = id + 1
      const {
        uid,
        species,
        forkLength,
        existingMark,
        adiposeClipped,
        fishConditions,
        runDefinition,
        lifeStage,
        dead,
        taxonCode,
      } = action.payload

      const fishEntry = {
        uid: uid || null,
        species: species || '',
        adiposeClipped: adiposeClipped,
        forkLength: forkLength,
        lifeStage: lifeStage,
        dead: dead,
        existingMark: existingMark,
        fishConditions: fishConditions,
        runDefinition: runDefinition,
        taxonCode: taxonCode,
      } as any
      if (action.payload.eggs !== null) {
        fishEntry.eggs = action.payload.eggs
      }
      if (action.payload.milting !== null) {
        fishEntry.milting = action.payload.milting
      }

      state.forkLengths = state.forkLengths || {}
      state.forkLengths[id] = fishEntry
    },
    // Bulk add many fork length entries in one operation (better for rapid input)
    addForkLengthsBulk: (state, action) => {
      const entries = action.payload as any[]
      if (!entries || !entries.length) return
      state.forkLengths = state.forkLengths || {}
      // @ts-ignore
      let nextId = (state as any).nextForkId || 0
      for (const entry of entries) {
        state.forkLengths[nextId] = entry
        nextId++
      }
      // @ts-ignore
      ;(state as any).nextForkId = nextId
    },
    addPlusCountToBatchStore: (state, action) => {
      const {
        tabId,
        species,
        count,
        run,
        lifeStage,
        plusCountMethod,
        dead,
        existingMarks,
        taxonCode,
      } = action.payload
      const forkLengthsCopy = cloneDeep(state.forkLengths) || {
        ...state.forkLengths,
      }

      const plusCountEntry = {
        tabId,
        UID: null,
        species,
        numFishCaught: count,
        forkLength: null,
        run: getRun(species, run),
        weight: null,
        fishConditions: false,
        lifeStage: getLifeStage(species, lifeStage),
        adiposeClipped: null,
        existingMarks: existingMarks?.length ? existingMarks : [],
        existingMark: existingMarks?.length ? true : false,
        dead,
        willBeUsedInRecapture: null,
        plusCountMethod,
        plusCount: true,
        taxonCode,
      }

      const id = (state as any).nextForkId || 0
      ;(state as any).nextForkId = id + 1
      forkLengthsCopy[id] = plusCountEntry
      state.forkLengths = forkLengthsCopy
    },
    removeForkLengthByUID: (state, action) => {
      const forkLengthsCopy = cloneDeep(state.forkLengths) as any

      const newForkLengthsArray = (
        Object.values(forkLengthsCopy) as singleBatchRawI[]
      ).filter(fishEntry => fishEntry.uid !== action.payload)

      const updatedForkLengthsObj = newForkLengthsArray.reduce<
        Record<number, any>
      >((acc, item, idx) => {
        acc[idx] = item
        return acc
      }, {} as Record<number, (typeof newForkLengthsArray)[0]>)

      state.forkLengths = updatedForkLengthsObj
    },
    removeLastForkLengthEntered: state => {
      const forkLengthsCopy = cloneDeep(state.forkLengths) as any
      if (Object.keys(forkLengthsCopy).length) {
        // @ts-ignore
        const largestId = Math.max(...Object.keys(forkLengthsCopy))
        delete forkLengthsCopy[largestId]
      }
      state.forkLengths = forkLengthsCopy
    },

    updateSingleForkLengthCount: (state, action) => {
      const forkLengthsState: any = cloneDeep(state.forkLengths)
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
      state.forkLengths = forkLengthsState
    },
  },
})

export const {
  resetBatchCountSlice,
  saveBatchCharacteristics,
  addMarkToBatchCountExistingMarks,
  removeMarkFromBatchCountExistingMarks,
  removeLastForkLengthEntered,
  removeForkLengthByUID,
  updateSingleForkLengthCount,
  addForkLengthToBatchStore,
  addPlusCountToBatchStore,
  addForkLengthsBulk,
} = batchCountSlice.actions

export default batchCountSlice.reducer
