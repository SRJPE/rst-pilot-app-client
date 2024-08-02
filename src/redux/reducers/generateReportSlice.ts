import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'

const uninitializedStatus = 'uninitialized'
const pendingStatus = 'pending'
const fulfilledStatus = 'fulfilled'
const rejectedStatus = 'rejected'

export interface ProgramI {
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

export interface PersonnelI {
  id: number
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  agencyId?: number
  role?: string
  orcidId?: string
  createdAt?: Date
  updatedAt?: Date
}

// interface InitialStateI {
//   program: ProgramI
//   personnelLead: PersonnelI
//   fundingAgency: {}
// }

interface APIResponseI {
  data: any
}

const initialState: any = {
  status: uninitializedStatus,
  program: {},
  personnelLead: {},
  fundingAgency: {},
}

// Async actions API calls
export const getBiWeeklyPassageSummary = createAsyncThunk(
  'generateReportsSlice/getBiWeeklyPassageSummary',
  async (programId: string | number) => {
    const response: APIResponseI = await api.get(
      `program/biWeeklyPassageSummary${programId}`
    )
    return response.data
  }
)

export const generateReportsSlice = createSlice({
  name: 'generateReports',
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [getBiWeeklyPassageSummary.pending.type]: (state, action) => {
      state.status = pendingStatus
    },

    [getBiWeeklyPassageSummary.fulfilled.type]: (state, action) => {
      state.status = fulfilledStatus
      state.program = action.payload.program
      state.personnelLead = action.payload.personnelLead
      state.fundingAgency = action.payload.fundingAgency
    },

    [getBiWeeklyPassageSummary.rejected.type]: (state, action) => {
      state.status = rejectedStatus
    },
  },
})

export default generateReportsSlice.reducer
