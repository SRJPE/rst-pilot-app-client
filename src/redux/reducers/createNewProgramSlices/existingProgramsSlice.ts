import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { RootState } from '../store'
import { cloneDeep } from 'lodash'
import api from '../../../api/axiosConfig'
import { updateAllCrewMembersFromExisting } from './crewMembersSlice'
import { updateAllEfficiencyTrialProtocolsFromExisting } from './efficiencyTrialProtocolsSlice'
import { updateAllPermitInformationFromExisting } from './permitInformationSlice'
import { updateAllTrappingProtocolsFromExisting } from './trappingProtocolsSlice'
import { updateAllTrappingSitesFromExisting } from './trappingSitesSlice'
import { updateAllMultipleTrapFromExisting } from './multipleTrapsSlice'

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

interface ProgramMetaDataSubmissionI {
  programName: string
  streamName: string
  personnelLead: number
  fundingAgency: number
  efficiencyProtocolsDocumentLink?: string
  trappingProtocolsDocumentLink?: string
  createdAt: Date
  updatedAt: Date
}
interface TrappingSitesSubmissionI {
  trapName: string
  dataRecorderId: number
  dataRecorderAgencyId: number
  siteName: string
  coneSizeFt: number
  xCoord: number
  yCoord: number
  releaseSiteName: string
  releaseSiteXCoord: number
  releaseSiteYCoord: number
  coordinateSystem?: string
  projection?: string
  datum?: string
  gageNumber: number
  gageAgency: number
  comments?: string
  createdAt: Date
  updatedAt: Date
}

interface CrewMembersSubmissionI {
  firstName: string
  lastName: string
  email: string
  phone: string
  agencyId: number
  role: string
  orcidId: string
  createdAt: Date
  updatedAt: Date
}
interface EfficiencyTrialProtocolsSubmissionI {
  hatcheryName: string
  streamName: string
  agreementId?: string
  agreementStartDate: Date
  agreementEndDate: Date
  renewalDate: Date
  frequencyOfFishCollection?: number | null
  quantityOfFish: number
  hatcheryFileLink?: string
}
interface TrappingProtocolsSubmissionI {
  species: string
  lifeStage: number
  run: number
  numberMeasured: number
}
interface PermitInformationSubmissionI {
  streamName: string
  permit_file_link?: string
  permitStartDate: Date
  permitEndDate: Date
  flowThreshold: number
  temperatureThreshold: number
  frequencySamplingInclementWeather: number
  expectedTakeAndMortality: Array<{
    species: any
    listingUnit: number
    fishLifeStage: number
    allowedExpectedTake: number
    allowedMortalityCount: number
  }>
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
  allProgramContents: {},
  // status: uninitializedStatus,
  // submissionStatus: 'not-submitted',
}

// Async actions API calls
export const getAllProgramRelatedContent = createAsyncThunk(
  'existingProgramsSlice/getPrograms',
  async (personnelID: string | number, { dispatch }) => {
    const response: APIResponseI = await api.get(`program/${personnelID}`)
    const data = response.data
    console.log(
      '🚀 ~ file: existingProgramsSlice.ts:128 ~ response.data:',
      response.data
    )
    dispatch(updateAllCrewMembersFromExisting(data.personnel))
    dispatch(updateAllEfficiencyTrialProtocolsFromExisting(data.personnel))
    dispatch(updateAllPermitInformationFromExisting(data.permitInformation))
    dispatch(updateAllTrappingProtocolsFromExisting(data.fishMeasureProtocol))
    dispatch(updateAllTrappingSitesFromExisting(data.trappingSites))
    dispatch(updateAllMultipleTrapFromExisting(data.personnel))
    //hatchery info
    //program metaData
    return data
  }
)

export const existingProgramSlice = createSlice({
  name: 'existingProgram',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get cases
      .addCase(getAllProgramRelatedContent.pending.type, (state) => {
        state.status = pendingStatus
      })
      .addCase(
        getAllProgramRelatedContent.fulfilled.type,
        (state, action: any) => {
          state.status = fulfilledStatus
          state.allProgramContents = action.payload
        }
      )
      .addCase(getAllProgramRelatedContent.rejected.type, (state) => {
        state.status = rejectedStatus
      })
  },
})

export default existingProgramSlice.reducer
