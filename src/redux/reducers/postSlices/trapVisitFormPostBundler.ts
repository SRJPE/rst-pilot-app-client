import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { RootState } from '../../store'
import { connectionChanged } from '../connectivitySlice'

interface InitialStateI {
  submissionStatus:
    | 'not-submitted'
    | 'submitting...'
    | 'submission-failed'
    | 'submission-successful'
  trapVisitSubmissions: TrapVisitSubmissionI[]
  previousTrapVisitSubmissions: TrapVisitSubmissionI[]
  catchRawSubmissions: CatchRawSubmissionI[]
  previousCatchRawSubmissions: CatchRawSubmissionI[]
}

interface TrapVisitSubmissionI {
  id?: number
  programId?: number
  visitTypeId?: number
  trapLocationId?: number
  trapVisitTimeStart?: Date
  trapVisitTimeEnd?: Date
  fishProcessed?: number
  whyFishNotProcessed?: number
  sampleGearId?: number
  coneDepth?: number
  trapInThalweg?: boolean
  trapFunctioning?: number
  whyTrapNotFunctioning?: number
  trapStatusAtEnd?: number
  totalRevolutions?: number
  rpmAtStart?: number
  rpmAtEnd?: number
  inHalfConeConfiguration?: boolean
  debrisVolumeLiters?: number
  qcCompleted?: boolean
  qcCompletedAt?: Date
  comments?: string
}

interface CatchRawSubmissionI {
  id?: number
  programId?: number
  trapVisitId?: number
  taxonId?: number
  captureRunClass?: number
  captureRunClassMethod?: number
  markType?: number
  adiposeClipped?: boolean
  lifeStage?: number
  forkLength?: number
  weight?: number
  numFishCaught?: number
  plusCount?: boolean
  plusCountMethodology?: number
  isRandom?: boolean
  comments?: string
  createdBy?: number
  createdAt?: Date
  updatedAt?: Date
  qcCompleted?: Date
  qcCompletedBy?: number
  qcTime?: Date
  qcComments?: string
}

interface APIResponseI {
  data: any
}

const initialState: InitialStateI = {
  submissionStatus: 'not-submitted',
  trapVisitSubmissions: [],
  previousTrapVisitSubmissions: [],
  catchRawSubmissions: [],
  previousCatchRawSubmissions: [],
}

// Async actions API calls
export const postTrapVisitFormSubmissions = createAsyncThunk(
  'trapVisitPostBundler/postTrapVisitFormSubmissions',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState
    let payload = {
      trapVisitResponse: [],
      catchRawResponse: [],
    }
    
    const trapVisitSubmissions =
      state.trapVisitFormPostBundler.trapVisitSubmissions
    if (trapVisitSubmissions.length) {
      const apiResponse: APIResponseI = await api.post(
        'trap-visit/',
        trapVisitSubmissions
      )
      payload.trapVisitResponse = apiResponse.data
    }

    const catchRawSubmissions =
      state.trapVisitFormPostBundler.catchRawSubmissions
    if (catchRawSubmissions.length) {
      const apiResponse: APIResponseI = await api.post(
        'catch-raw/',
        catchRawSubmissions
      )
      payload.catchRawResponse = apiResponse.data
    }

    return payload
  }
)

export const trapVisitPostBundler = createSlice({
  name: 'trapVisitPostBundler',
  initialState: initialState,
  reducers: {
    saveTrapVisitSubmission: (state, action) => {
      state.trapVisitSubmissions.push({ ...action.payload })
      state.submissionStatus = 'not-submitted'
    },
    saveCatchRawSubmissions: (state, action) => {
      state.catchRawSubmissions = [
        ...state.catchRawSubmissions,
        ...action.payload,
      ]
      state.submissionStatus = 'not-submitted'
    },
  },
  extraReducers: {
    [postTrapVisitFormSubmissions.pending.type]: (state, action) => {
      state.submissionStatus = 'submitting...'
    },

    [postTrapVisitFormSubmissions.fulfilled.type]: (state, action) => {
      const trapVisitPostResult = action.payload.trapVisitResponse
      const catchRawPostResult = action.payload.catchRawResponse
      state.submissionStatus = 'submission-successful'
      state.previousTrapVisitSubmissions = [
        ...state.previousTrapVisitSubmissions,
        ...trapVisitPostResult,
      ]
      state.trapVisitSubmissions = []
      state.previousCatchRawSubmissions = [
        ...state.previousCatchRawSubmissions,
        ...catchRawPostResult,
      ]
      state.catchRawSubmissions = []
      console.log('successful post result: ', action.payload)
    },

    [postTrapVisitFormSubmissions.rejected.type]: (state, action) => {
      state.submissionStatus = 'submission-failed'
    },
    [connectionChanged.type]: (state, action) => {
      if (
        action.payload.isConnected &&
        state.submissionStatus === 'not-submitted' &&
        state.trapVisitSubmissions.length
      ) {
        try {
          ;(async () => {
            const trapVisitPostRequest: APIResponseI = await api.post(
              'trap-visit/',
              state.trapVisitSubmissions
            )
            const trapVisitPostResult = trapVisitPostRequest.data
            state.submissionStatus = 'submission-successful'
            state.previousTrapVisitSubmissions = [
              ...state.previousTrapVisitSubmissions,
              ...(trapVisitPostResult as TrapVisitSubmissionI[]),
            ]
            state.trapVisitSubmissions = []
          })()
        } catch (e) {
          state.submissionStatus = 'submission-failed'
        }
      }
    },
  },
})

export const { saveTrapVisitSubmission, saveCatchRawSubmissions } =
  trapVisitPostBundler.actions

export default trapVisitPostBundler.reducer
