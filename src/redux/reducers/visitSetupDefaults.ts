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
  programs: ProgramI[]
  trapLocations: TrapLocationI[]
  crewMembers: CrewMemberI[][]
}

interface ProgramI {
  id: number
  personnelId: number
  programId: number
  programName: string | null
  streamName: string | null
  personnelLead: number | null
  fundingAgency: number | null
  efficiencyProtocolsDocumentLink: string | null
  trappingProtocolsDocumentLink: string | null
  createdAt: string | null
  updatedAt: string | null
}

interface TrapLocationI {
  id: number
  trapName: string
  programId: number
  dataRecorderId: number
  dataRecorderAgencyId: number | null
  siteName: string
  coneSizeFt: string
  xCoord: string
  yCoord: string
  coordinateSystem: string | null
  projection: string | null
  datum: string | null
  gageNumber: string | null
  gageAgency: number
  comments: string | null
  createdAt: string | null
  updatedAt: string | null
}

interface CrewMemberI {
  id: number
  personnelId: number
  programId: number
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  agencyId: number | null
  role: string | null
  orcidId: string | null
  createdAt: string
  updatedAt: string
}

interface APIResponseI {
  data: any
}

// Initial State
const initialState: InitialStateI = {
  status: uninitializedStatus,
  programs: [],
  trapLocations: [],
  crewMembers: []
}

// Async actions API calls
export const getVisitSetupDefaults = createAsyncThunk(
  'visitSetupDefaults/getVisitSetupDefaults',
  async (personnelId: number) => {
    const response: APIResponseI = await api.get(
      `trap-visit/visit-setup/default/${personnelId}`
    )
    return response.data
  }
)

// @reduxjs/toolkit Slice - New & Recommended way of writing redux reducers
// allows us to:
// * write actions under reducers: {...}
// * write async actions under extraReducers: {...}

export const visitSetupDefaultsSlice = createSlice({
  name: 'visitSetupDefaults',
  initialState: initialState,
  // Redux Toolkit allows us to write "mutating" logic in reducers
  reducers: {
    // Below is just an example, here we could pass 'markType' to 'clearValuesFromDropdown' from the UI and
    // 'markType' would be recognized as the action.payload below
  },
  extraReducers: {
    // Add async and additional action types here, and handle loading state as needed
    [getVisitSetupDefaults.pending.type]: (state, action) => {
      state.status = pendingStatus
    },

    [getVisitSetupDefaults.fulfilled.type]: (state, action) => {
      state.status = fulfilledStatus
      state.programs = action.payload.programs
      state.trapLocations = action.payload.trapLocations
      state.crewMembers = action.payload.crewMembers
    },

    [getVisitSetupDefaults.rejected.type]: (state, action) => {
      state.status = rejectedStatus
    },
  },
})

export default visitSetupDefaultsSlice.reducer
