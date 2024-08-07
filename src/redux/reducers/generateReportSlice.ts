import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axiosConfig'
import { RootState } from '../store'
import { cloneDeep } from 'lodash'

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
  submissionStatus: 'not-submitted',
  mostRecentReportFilePath: null,
  previousEmailSubmissions: [],
  emailValues: {
    emailSubject: 'testSubject',
    emailBody: 'test body',
    emailRecipients: ['bpintel@gmail.com'],
    // emailAttachments: [],
  },
  values: {
    program: {},
    personnelLead: {},
    fundingAgency: {},
  },
}

// Async actions API calls
export const getBiWeeklyPassageSummary = createAsyncThunk(
  'generateReportsSlice/getBiWeeklyPassageSummary',
  async (programId: string | number) => {
    const response: APIResponseI = await api.get(
      `program/biWeeklyPassageSummary/${programId}`
    )
    return response.data
  }
)
// export const postBiWeeklyPassageSummaryEmail = createAsyncThunk(
//   'generateReportsSlice/SendBiWeeklyPassageSummaryEmail',
//   async (emailParams: any) => {
//     const response: APIResponseI = await api.post(
//       `report/send-email`,
//       emailParams
//     )
//     return response.data
//   }
// )

export const postBiWeeklyPassageSummaryEmail = createAsyncThunk(
  'generateReportsSlice/postBiWeeklyPassageSummaryEmail',

  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState
    let payload: {
      biWeeklyPassageSummaryEmailResponse: any[]
    } = {
      biWeeklyPassageSummaryEmailResponse: [],
    }
    //get submissions
    const emailSubmissionValues = state.generateReports.emailValues
    const emailSubmissionValuesCopy = cloneDeep(emailSubmissionValues)
    console.log('🚀 ~ emailSubmissionValuesCopy:', emailSubmissionValuesCopy)
    const apiResponse: APIResponseI = await api.post(
      'report/email',
      emailSubmissionValuesCopy
    )
    // get response from server

    console.log('🚀 ~ apiResponse.data:', apiResponse.data)
    payload.biWeeklyPassageSummaryEmailResponse.push(apiResponse.data)

    return payload
  }
)

export const generateReportsSlice = createSlice({
  name: 'generateReports',
  initialState: initialState,
  reducers: {
    updateMostRecentReportFilePath: (state, action) => {
      state.mostRecentReportFilePath = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      //get cases
      .addCase(getBiWeeklyPassageSummary.pending.type, (state) => {
        state.status = pendingStatus
      })
      .addCase(
        getBiWeeklyPassageSummary.fulfilled.type,
        (state, action: any) => {
          state.status = fulfilledStatus
          state.values.program = action.payload.program[0]
          state.values.personnelLead = action.payload.personnelLead[0]
          state.values.fundingAgency = action.payload.fundingAgency[0]
        }
      )
      .addCase(getBiWeeklyPassageSummary.rejected.type, (state) => {
        state.status = rejectedStatus
      })
      //post cases
      .addCase(postBiWeeklyPassageSummaryEmail.pending.type, (state) => {
        state.submissionStatus = 'submitting...'
      })
      .addCase(
        postBiWeeklyPassageSummaryEmail.fulfilled.type,
        (state, action: any) => {
          const biWeeklyPassageSummaryEmailResponse = action.payload
          state.submissionStatus = 'submission-successful'
          state.emailResponses = [
            ...state.emailResponses,
            ...biWeeklyPassageSummaryEmailResponse,
          ]
        }
      )
      .addCase(postBiWeeklyPassageSummaryEmail.rejected.type, (state) => {
        state.submissionStatus = 'submission-failed'
      })
  },
})

export const { updateMostRecentReportFilePath } = generateReportsSlice.actions

export default generateReportsSlice.reducer
