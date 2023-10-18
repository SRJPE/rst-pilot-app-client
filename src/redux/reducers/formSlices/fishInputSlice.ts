import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep, isEqual } from 'lodash'
import { reformatBatchCountData } from '../../../utils/utils'
import { ReleaseMarkI } from '../addAnotherMarkSlice'

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
  UID: string | null
  species: string
  forkLength: number | null
  run: string
  weight?: number | null
  fishCondition: string | null
  lifeStage: string
  adiposeClipped: boolean | null
  existingMarks: Array<ReleaseMarkI>
  dead: boolean | null
  willBeUsedInRecapture: boolean | null
  plusCountMethod: string // | number
  numFishCaught?: number | null
  plusCount?: boolean
}

export const individualFishInitialState = {
  UID: null,
  species: '',
  numFishCaught: null,
  forkLength: null,
  run: '',
  weight: null,
  fishCondition: '',
  lifeStage: '',
  adiposeClipped: false,
  existingMarks: [],
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
        existingMarks,
        forkLengths,
        fishCondition: fishConditionValue,
      } = action.payload
      let fishStoreCopy = cloneDeep(
        state[tabId] ? state[tabId].fishStore : state['placeholderId'].fishStore
      )

      interface FishEntry {
        forkLength: number
        lifeStage: string
        dead: boolean
        existingMark: boolean
        fishCondition: boolean
      }

      interface PreparedFishEntry {
        count: number
        fishEntryData: FishEntry
      }

      function organizeFishEntries(
        inputData: Record<string, FishEntry>
      ): PreparedFishEntry[] {
        const preparedFishEntries: PreparedFishEntry[] = []

        for (const value of Object.values(inputData)) {
          let foundMatch = false

          for (const entry of preparedFishEntries) {
            if (isEqual(entry.fishEntryData, value)) {
              entry.count++
              foundMatch = true
              break
            }
          }

          if (!foundMatch) {
            preparedFishEntries.push({
              count: 1,
              fishEntryData: cloneDeep(value),
            })
          }
        }

        return preparedFishEntries
      }
      const organizedFishEntriesResult = organizeFishEntries(forkLengths)

      for (const value of Object.values(organizedFishEntriesResult)) {
        const { forkLength, lifeStage, dead, existingMark, fishCondition } =
          value.fishEntryData
        const batchCountEntry = {
          species: species,
          numFishCaught: value.count,
          forkLength: forkLength,
          run: 'not recorded', //updated
          weight: null,
          lifeStage:
            species === 'Chinook salmon'
              ? lifeStage.toLowerCase()
              : 'not recorded', //updated
          adiposeClipped: adiposeClipped,
          existingMarks: existingMark ? existingMarks : [],
          dead: dead,
          fishCondition: fishCondition ? fishConditionValue : false,
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
      const { tabId, formValues, UID } = action.payload
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
      fishStoreCopy[id] = { ...formValues, UID, numFishCaught: 1 }

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
        UID: null,
        species,
        numFishCaught: count,
        forkLength: null,
        run,
        weight: null,
        fishCondition: null,
        lifeStage,
        adiposeClipped: null,
        existingMarks: [],
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
  saveBatchCount,
} = saveFishSlice.actions

export default saveFishSlice.reducer
