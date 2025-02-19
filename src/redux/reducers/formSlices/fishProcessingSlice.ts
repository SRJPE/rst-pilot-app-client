import { createSlice } from '@reduxjs/toolkit'

export interface InitialStateI {
  [tabId: string]: FishProcessingStateI
}

interface FishProcessingStateI {
  completed: boolean
  values: fishProcessingValuesI
  errors: { [name: string]: any }
}

interface fishProcessingValuesI {
  fishProcessedResult: string
  reasonForNotProcessing: string
  willBeHoldingFishForMarkRecapture: boolean
}

const initialState: InitialStateI = {
  placeholderId: {
    completed: false,
    values: {
      fishProcessedResult: '',
      reasonForNotProcessing: '',
      willBeHoldingFishForMarkRecapture: false,
    },
    errors: {},
  },
}

export const fishProcessingSlice = createSlice({
  name: 'fishProcessing',
  initialState: initialState,
  reducers: {
    resetFishProcessingSlice: () => initialState,
    saveFishProcessing: (state, action) => {
      const { tabId, values, errors } = action.payload
      state[tabId] = { completed: true, values, errors }
    },
    markFishProcessingCompleted: (state, action) => {
      const { tabId, value } = action.payload
      state[tabId].completed = value
    },
  },
})

export const {
  resetFishProcessingSlice,
  saveFishProcessing,
  markFishProcessingCompleted,
} = fishProcessingSlice.actions

export default fishProcessingSlice.reducer

type FishProcessingResult = {
  tabId: string
  fishProcessingResult: any // Replace 'any' with the actual type if known
}
export const getAllTabProcessingResults = (
  fishProcessingSlice: InitialStateI
): FishProcessingResult[] =>
  Object.entries(fishProcessingSlice).map(resultEntry => ({
    tabId: resultEntry[0],
    fishProcessingResult: resultEntry[1]?.values?.fishProcessedResult,
  }))
