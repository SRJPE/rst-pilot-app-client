import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'

const uninitializedStatus = 'uninitialized'
const pendingStatus = 'pending'
const fulfilledStatus = 'fulfilled'
const rejectedStatus = 'rejected'

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

export const visitSetupDefaultsSlice = createSlice({
  name: 'visitSetupDefaults',
  initialState: initialState,
  reducers: {
  },
  extraReducers: {
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
