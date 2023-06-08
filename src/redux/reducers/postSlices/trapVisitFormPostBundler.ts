import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { RootState } from '../../store'
import { cloneDeep } from 'lodash'
import { getSubstring } from '../../../utils/utils'

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
    const trapVisitSubmissions: any =
      state.trapVisitFormPostBundler.trapVisitSubmissions
    const catchRawSubmissions: any =
      state.trapVisitFormPostBundler.catchRawSubmissions

    try {
      // for each trap visit
      await Promise.all(
        trapVisitSubmissions.map(async (trapSubmission: any) => {
          const uid = trapSubmission.uid
          const trapSubmissionCopy = cloneDeep(trapSubmission)
          delete trapSubmissionCopy['uid']
          // submit trap visit
          const apiResponse: APIResponseI = await api.post(
            'trap-visit/',
            trapSubmissionCopy
          )
          // get response from server
          const {
            createdTrapVisitResponse,
            createdTrapVisitCrewResponse,
            createdTrapCoordinatesResponse,
            createdTrapVisitEnvironmentalResponse,
          } = apiResponse.data
          // save to payload
          payload.trapVisitResponse.push({
            createdTrapVisitResponse,
            createdTrapVisitCrewResponse,
            createdTrapCoordinatesResponse,
            createdTrapVisitEnvironmentalResponse,
          })
          // get all linked catch raws for iteration of trap visit
          const linkedCatchRawSubmissions = catchRawSubmissions.filter(
            (catchSubmission: any) => catchSubmission.uid === uid
          )
          // submit all linked catch_raw's and give id from trap_visit response

          await Promise.all(
            linkedCatchRawSubmissions.map(async (catchSubmission: any) => {
              const catchSubmissionCopy = cloneDeep(catchSubmission)
              delete catchSubmissionCopy['uid']
              const apiResponse: APIResponseI = await api.post('catch-raw/', {
                ...catchSubmissionCopy,
                trapVisitId: createdTrapVisitResponse.id,
              })

              const {
                createdCatchRawResponse,
                createdGeneticSamplingDataResponse,
                createdExistingMarksResponse,
                createdMarkAppliedResponse,
              } = apiResponse.data

              payload.catchRawResponse.push({
                createdCatchRawResponse,
                createdGeneticSamplingDataResponse,
                createdExistingMarksResponse,
                createdMarkAppliedResponse,
              })
            })
          )
        })
      )
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        error: error.response,
        failedTrapVisitSubmissions: trapVisitSubmissions,
        failedCatchRawSubmissions: catchRawSubmissions,
      })
    }

    return payload
  }
)

const getIndexOfDuplicateTrapVisit = ({
  errorDetail,
  failedTrapVisitSubmissions,
}: {
  errorDetail: string
  failedTrapVisitSubmissions: any[]
}) => {
  const errorDuplicateValues = getSubstring(
    errorDetail.slice(58),
    '(',
    ')'
  ).split(',')
  const programId = Number(errorDuplicateValues[0])
  const trapLocationId = Number(errorDuplicateValues[1])
  const trapVisitTimeStart = new Date(errorDuplicateValues[2])

  let index = -1
  
  failedTrapVisitSubmissions.forEach((submission, idx) => {
    const submissionTimeStart = new Date(submission.trapVisitTimeStart)
    if (
      submission.programId == programId &&
      submission.trapLocationId == trapLocationId &&
      submissionTimeStart.getTime() == trapVisitTimeStart.getTime()
    ) {
      index = idx
    }
  })

  return index
}

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
      let errorDetail: string = action.payload.error.data.detail
      let { failedTrapVisitSubmissions, failedCatchRawSubmissions } =
        action.payload
      if (errorDetail.includes('already exists')) {
        if (
          errorDetail.includes(
            'Key (program_id, trap_location_id, trap_visit_time_start)'
          )
        ) {
          let index = getIndexOfDuplicateTrapVisit({
            errorDetail,
            failedTrapVisitSubmissions,
          })
          state.previousTrapVisitSubmissions.push(state.trapVisitSubmissions[index])
          state.trapVisitSubmissions.splice(index, 1)
        }
      }
      state.submissionStatus = 'submission-failed'
    },
  },
})

export const { saveTrapVisitSubmission, saveCatchRawSubmissions } =
  trapVisitPostBundler.actions

export default trapVisitPostBundler.reducer
