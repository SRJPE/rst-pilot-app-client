import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { RootState } from '../../store'
import { cloneDeep } from 'lodash'

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
  uid: string
  crew?: number[]
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
  debrisVolumeGallons?: number
  qcCompleted?: boolean
  qcCompletedAt?: Date
  comments?: string
}

interface CatchRawSubmissionI {
  uid: string
  id?: number
  programId?: number
  trapVisitId?: number
  taxonId?: number
  captureRunClass?: number
  captureRunClassMethod?: number
  markType?: number
  markedForRelease?: boolean
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
    let payload: {
      trapVisitResponse: any[]
      catchRawResponse: any[]
    } = {
      trapVisitResponse: [],
      catchRawResponse: [],
    }

    // getting submissions for trap / catch_raw
    const trapVisitSubmissions =
      state.trapVisitFormPostBundler.trapVisitSubmissions
    const catchRawSubmissions =
      state.trapVisitFormPostBundler.catchRawSubmissions

    // for each trap visit
    await Promise.all(
      trapVisitSubmissions.map(async (trapSubmission: any) => {
        console.log('hit inside of promise...')
        const uid = trapSubmission.uid
        const trapSubmissionCopy = cloneDeep(trapSubmission)
        delete trapSubmissionCopy['uid']
        console.log('hit... trapSubmissionCopy: ', trapSubmissionCopy)
        // submit trap visit
        const apiResponse: APIResponseI = await api.post(
          'trap-visit/',
          trapSubmissionCopy
        )
        // get response from server
        const { createdTrapVisitResponse, createdTrapVisitCrewResponse } =
          apiResponse.data
        // save to payload
        payload.trapVisitResponse.push(createdTrapVisitResponse)
        // get all linked catch raws for iteration of trap visit
        const linkedCatchRawSubmissions = catchRawSubmissions.filter(
          (catchSubmission: any) => catchSubmission.uid === uid
        )
        // submit all linked catch_raw's and give id from trap_visit response

        await Promise.all(
          linkedCatchRawSubmissions.map(async (catchSubmission: any) => {
            const catchSubmissionCopy = cloneDeep(catchSubmission)
            delete catchSubmissionCopy['uid']
            console.log('hit... catchSubmissionCopy: ', catchSubmissionCopy)
            const apiResponse: APIResponseI = await api.post('catch-raw/', {
              ...catchSubmissionCopy,
              trapVisitId: createdTrapVisitResponse.id,
            })

            const {
              createdCatchRawResponse,
              createdGeneticSamplingDataResponse,
              createdExistingMarksResponse,
            } = apiResponse.data

            payload.catchRawResponse.push({
              createdCatchRawResponse,
              createdGeneticSamplingDataResponse,
              createdExistingMarksResponse,
            })
          })
        )
      })
    )

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
      console.log('successful post processing: ', action.payload)
    },

    [postTrapVisitFormSubmissions.rejected.type]: (state, action) => {
      state.submissionStatus = 'submission-failed'
    },
  },
})

export const { saveTrapVisitSubmission, saveCatchRawSubmissions } =
  trapVisitPostBundler.actions

export default trapVisitPostBundler.reducer
