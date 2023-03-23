import { createSlice } from '@reduxjs/toolkit'

interface InitialStateI {
  [tabId: string]: FishHoldingStateI
}

interface FishHoldingStateI {
  completed: boolean
  values: FishHoldingValuesI
}

export interface FishHoldingValuesI {
  totalFishHolding: number | null
  selectedFishStore: SelectedFishStoreI
}

export interface SelectedFishStoreI {
  [id: number]: IndividualSelectedFishValuesI
}

export interface IndividualSelectedFishValuesI {
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

const initialState: InitialStateI = {
  placeholderId: {
    completed: false,
    values: {
      totalFishHolding: null,
      selectedFishStore: {},
    },
  },
}

export const fishHoldingSlice = createSlice({
  name: 'fishHolding',
  initialState: initialState,
  reducers: {
    resetFishHoldingSlice: () => initialState,
    saveFishHolding: (state, action) => {
      const { tabId, values } = action.payload
      if (state[tabId]) {
        state[tabId].values = values
      } else {
        state[tabId] = { ...state['placeholderId'], values }
      }
    },
    markFishHoldingCompleted: (state, action) => {
      const { tabId, completed } = action.payload
      if (state[tabId]) {
        state[tabId].completed = completed
      }
    },
  },
})

export const {
  resetFishHoldingSlice,
  saveFishHolding,
  markFishHoldingCompleted,
} = fishHoldingSlice.actions

export default fishHoldingSlice.reducer
