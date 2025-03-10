import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep, get, isEqual } from 'lodash'
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

interface FishEntry {
  forkLength: number
  lifeStage: string
  dead: boolean
  existingMark: boolean
  fishConditions: string[]
  runDefinition?: string
}

interface PreparedFishEntry {
  count: number
  fishEntryData: FishEntry
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
  fishConditions: Array<string | null>
  lifeStage: string
  adiposeClipped: boolean | null
  existingMarks: Array<ReleaseMarkI>
  dead: boolean | null
  willBeUsedInRecapture: boolean | null
  plusCountMethod: string // | number
  numFishCaught?: number | null
  plusCount?: boolean
  comments?: string | null
}

export const individualFishInitialState = {
  UID: null,
  species: '',
  numFishCaught: null,
  forkLength: null,
  run: '',
  weight: null,
  fishConditions: [],
  lifeStage: '',
  adiposeClipped: false,
  existingMarks: [],
  dead: false,
  willBeUsedInRecapture: false,
  plusCountMethod: '',
  plusCount: false,
  comments: null,
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
      const { tabId, batchCharacteristics, forkLengths } = action.payload
      const { species, adiposeClipped, existingMarks, fishConditions } =
        batchCharacteristics
      let fishStoreCopy = cloneDeep(
        state[tabId] ? state[tabId].fishStore : state['placeholderId'].fishStore
      )

      const organizedFishEntriesResult = organizeFishEntries(forkLengths)

      for (const value of Object.values(organizedFishEntriesResult)) {
        const {
          forkLength,
          lifeStage,
          dead,
          existingMark,
          fishConditions,
          runDefinition,
        } = value.fishEntryData

        let run = null
        let captureRunClassMethod = null
        if (species === 'Chinook salmon') {
          run = runDefinition || 'not recorded'
          // river model length at date
          captureRunClassMethod = runDefinition
            ? 'river model length at date'
            : 'not recorded'
        }

        const batchCountEntry = {
          species: species,
          numFishCaught: value.count,
          forkLength: forkLength,
          run,
          captureRunClassMethod,
          weight: null,
          lifeStage: getLifeStage(species, lifeStage),
          adiposeClipped: adiposeClipped,
          existingMarks: existingMark ? existingMarks : [],
          dead: dead,
          fishConditions: fishConditions,
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
      const {
        tabId,
        species,
        count,
        run,
        lifeStage,
        plusCountMethod,
        dead,
        comments,
      } = action.payload

      const plusCountEntry = {
        UID: null,
        species,
        numFishCaught: count,
        forkLength: null,
        run: getRun(species, run),
        weight: null,
        fishConditions: [],
        lifeStage: getLifeStage(species, lifeStage),
        adiposeClipped: null,
        existingMarks: [],
        dead,
        willBeUsedInRecapture: null,
        plusCountMethod,
        plusCount: true,
        comments: comments || null,
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
