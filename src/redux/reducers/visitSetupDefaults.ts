import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'

const uninitializedStatus = 'uninitialized'
const pendingStatus = 'pending'
const fulfilledStatus = 'fulfilled'
const rejectedStatus = 'rejected'

export interface InitialStateI {
  status: string
  programs: ProgramI[]
  trapLocations: TrapLocationI[]
  releaseSites: ReleaseSiteI[]
  crewMembers: CrewMemberI[][]
  trapVisitCrew: TrapVisitCrewI[]
  permitInfo: PermitInfoI[]
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
  project?: string | null
}
interface ReleaseSiteI {
  id: number
  releaseSiteCoordinateSystem: null
  releaseSiteDatum: null
  releaseSiteName: string | null
  releaseSiteProjection: null
  releaseSiteXCoord: string | null
  releaseSiteYCoord: string | null
  trapLocationsId: number
}

interface CrewMemberI {
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

interface TrapVisitCrewI {
  id: number
  personnelId: number
  trapVisitId: number
}

interface PermitInfoI {
  id: number
  permitId: string | null
  programId: number
  streamName: string
  permitStartDate: string | null
  permitEndDate: string | null
  flowThreshold: number | null
  temperatureThreshold: number | null
  frequencySamplingInclementWeather: number | null
  permit_file_link: string | null
  trapLocationsId: number | null
}

interface APIResponseI {
  data: any
}

const initialState: InitialStateI = {
  status: uninitializedStatus,
  programs: [],
  trapLocations: [],
  releaseSites: [],
  crewMembers: [],
  trapVisitCrew: [],
  permitInfo: [],
}

// Async actions API calls
export const getVisitSetupDefaults = createAsyncThunk(
  'visitSetupDefaults/getVisitSetupDefaults',
  async (personnelId: number) => {
    try {
      const response: APIResponseI = await api.get(
        `trap-visit/visit-setup/default/${personnelId}`
      )
      console.log('res', response.data)
      return response.data
    } catch (error: any) {
      console.log('err', error)
      throw error
    }
  }
)

export const visitSetupDefaultsSlice = createSlice({
  name: 'visitSetupDefaults',
  initialState: initialState,
  reducers: {
    resetVisitSetupDefaultSlice: () => {
      return initialState
    },
  },
  extraReducers: {
    [getVisitSetupDefaults.pending.type]: (state, action) => {
      state.status = pendingStatus
    },

    [getVisitSetupDefaults.fulfilled.type]: (state, action) => {
      state.status = fulfilledStatus
      state.programs = action.payload.programs
      state.trapLocations = action.payload.trapLocations
      state.releaseSites = action.payload.releaseSites
      state.crewMembers = action.payload.crewMembers
      state.trapVisitCrew = action.payload.trapVisitCrew
      state.permitInfo = action.payload.permitInfo
    },

    [getVisitSetupDefaults.rejected.type]: (state, action) => {
      state.status = rejectedStatus
    },
  },
})

export const { resetVisitSetupDefaultSlice } = visitSetupDefaultsSlice.actions

export default visitSetupDefaultsSlice.reducer
