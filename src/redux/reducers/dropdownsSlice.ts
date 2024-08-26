import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'

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
  taxon: any[]
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
  twoMostRecentReleaseMarks: any[]
  fundingAgency: any[]
  listingUnit: any[]
  frequency: any[]
  fishCondition: any[]
  programs: any[]
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
    twoMostRecentReleaseMarks: [],
    fundingAgency: [],
    listingUnit: [],
    frequency: [],
    fishCondition: [],
    programs: [],
  },
}

// Async actions API calls
export const getTrapVisitDropdownValues = createAsyncThunk(
  'dropdowns/getTrapVisitDropdownValues',
  async () => {
    const response: APIResponseI = await api.get('trap-visit/dropdowns')
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
      state.values[action.payload as keyof typeof state.values] = []
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
