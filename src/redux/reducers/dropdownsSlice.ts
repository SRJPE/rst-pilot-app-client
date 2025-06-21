import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'
import { Taxon, ProgramTaxonAbbreviation } from '../../utils/interfaces'

// Constants
const uninitializedStatus = 'uninitialized'
const pendingStatus = 'pending'
const fulfilledStatus = 'fulfilled'
const rejectedStatus = 'rejected'

// Interfaces
interface InitialStateI {
  status: string
  values: ValuesI
}

interface ValuesI {
  trapFunctionality: any[]
  whyTrapNotFunctioning: any[]
  trapStatusAtEnd: any[]
  taxon: Taxon[]
  programTaxonAbbreviation: Record<string, unknown>
  fishProcessed: any[]
  whyFishNotProcessed: any[]
  lifeStage: any[]
  markType: any[]
  markColor: any[]
  bodyPart: any[]
  run: any[]
  releasePurpose: any[]
  coneDebrisVolume: any[]
  visitType: any[]
  lightCondition: any[]
  plusCountMethodology: any[]
  releaseMarks: any[]
  fundingAgency: any[]
  listingUnit: any[]
  frequency: any[]
  fishCondition: any[]
}

interface APIResponseI {
  data: any
}

// Initial State
const initialState: InitialStateI = {
  status: uninitializedStatus,
  values: {
    trapFunctionality: [],
    whyTrapNotFunctioning: [],
    trapStatusAtEnd: [],
    taxon: [],
    programTaxonAbbreviation: {},
    fishProcessed: [],
    whyFishNotProcessed: [],
    lifeStage: [],
    markType: [],
    markColor: [],
    bodyPart: [],
    run: [],
    releasePurpose: [],
    coneDebrisVolume: [],
    visitType: [],
    lightCondition: [],
    plusCountMethodology: [],
    releaseMarks: [],
    fundingAgency: [],
    listingUnit: [],
    frequency: [],
    fishCondition: [],
  },
}

// Async actions API calls
export const getTrapVisitDropdownValues = createAsyncThunk<any, string>(
  'dropdowns/getTrapVisitDropdownValues',
  async userId => {
    const response: APIResponseI = await api.get(
      `trap-visit/dropdowns/${userId}`
    )
    return response.data
  }
)

// @reduxjs/toolkit Slice - New & Recommended way of writing redux reducers
// allows us to:
// * write actions under reducers: {...}
// * write async actions under extraReducers: {...}

export const dropdownsSlice = createSlice({
  name: 'dropdowns',
  initialState: initialState,
  // Redux Toolkit allows us to write "mutating" logic in reducers
  reducers: {
    // Below is just an example, here we could pass 'markType' to 'clearValuesFromDropdown' from the UI and
    // 'markType' would be recognized as the action.payload below
    clearValuesFromDropdown: (state, action) => {
      // * This reducer isn't currently used in the app, but it could fail. All store values are initialized to empty arrays except for programTaxonAbbreviation, which is an empty object.
      console.log('🚀 ~ dropdownsSlice.ts:99 ~ action:', action)

      if (action.payload === 'programTaxonAbbreviation') {
        // If the action payload is 'programTaxonAbbreviation', we need to reset it to an empty object
        state.values.programTaxonAbbreviation = {}
        return
      }

      state.values[action.payload as keyof typeof state.values] = [] as any
    },
  },
  extraReducers: {
    // Add async and additional action types here, and handle loading state as needed
    [getTrapVisitDropdownValues.pending.type]: (state, action) => {
      state.status = pendingStatus
    },

    [getTrapVisitDropdownValues.fulfilled.type]: (state, action) => {
      state.status = fulfilledStatus
      state.values = action.payload
    },

    [getTrapVisitDropdownValues.rejected.type]: (state, action) => {
      state.status = rejectedStatus
    },
  },
})

export const { clearValuesFromDropdown } = dropdownsSlice.actions

export default dropdownsSlice.reducer
