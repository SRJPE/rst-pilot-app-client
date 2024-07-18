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
  markRecaptureSubmissions: MarkRecaptureSubmissionI[]
  previousMarkRecaptureSubmissions: MarkRecaptureSubmissionI[]
  markRecaptureReleaseCrewSubmissions: MarkRecaptureSubmissionI[]
  previousMarkRecaptureReleaseCrewSubmissions: MarkRecaptureSubmissionI[]
  markRecaptureReleaseMarksSubmissions: MarkRecaptureSubmissionI[]
  previousMarkRecaptureReleaseMarksSubmissions: MarkRecaptureSubmissionI[]
}

interface MarkRecaptureSubmissionI {
  id?: number
  programId?: number
  releasePurposeId?: number
  releaseSiteId?: number
  releasedAt?: Date
  markedAt?: Date
  markColor?: number
  markType?: number
  markPosition?: number
  marksArray?: any[]
  runHatcheryFish?: number
  hatcheryFishWeight?: number
  totalWildFishReleased?: number
  totalHatcheryFishReleased?: number
  totalWildFishDead?: number
  totalHatcheryFishDead?: number
}
interface APIResponseI {
  data: any
}

const initialState: InitialStateI = {
  submissionStatus: 'not-submitted',
  markRecaptureSubmissions: [],
  previousMarkRecaptureSubmissions: [],
  markRecaptureReleaseCrewSubmissions: [],
  previousMarkRecaptureReleaseCrewSubmissions: [],
  markRecaptureReleaseMarksSubmissions: [],
  previousMarkRecaptureReleaseMarksSubmissions: [],
}

export const postMarkRecaptureSubmissions = createAsyncThunk(
  'markRecapturePostBundler/postMarkRecaptureSubmissions',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState
      let payload: {
        markRecaptureResponse: any[]
        markRecaptureReleaseCrewResponse: any[]
        markRecaptureReleaseMarksResponse: any[]
      } = {
        markRecaptureResponse: [],
        markRecaptureReleaseCrewResponse: [],
        markRecaptureReleaseMarksResponse: [],
      }
      //get submissions
      const markRecaptureSubmissions =
        state.markRecaptureFormPostBundler.markRecaptureSubmissions

      await Promise.all(
        markRecaptureSubmissions.map(async (markRecaptureSubmission: any) => {
          const markRecaptureSubmissionCopy = cloneDeep(markRecaptureSubmission)
          console.log(
            '🚀 ~ hit... markRecaptureSubmissionCopy:',
            markRecaptureSubmissionCopy
          )
          // submit mark recapture (release trial)
          const apiResponse: APIResponseI = await api.post(
            'release/',
            markRecaptureSubmissionCopy
          )
          // get response from server
          const {
            createdReleaseResponse,
            createdReleaseCrewResponse,
            createdReleaseMarksResponse,
          } = apiResponse.data
          // save to payload
          payload.markRecaptureResponse.push(createdReleaseResponse)
          payload.markRecaptureReleaseCrewResponse.push(
            createdReleaseCrewResponse
          )
          payload.markRecaptureReleaseMarksResponse.push(
            createdReleaseMarksResponse
          )
        })
      )
      return payload
    } catch (error) {
      console.log('catch error')
    }
  }
)

export const markRecapturePostBundler = createSlice({
  name: 'markRecapturePostBundler',
  initialState: initialState,
  reducers: {
    saveMarkRecaptureSubmission: (state, action) => {
      state.markRecaptureSubmissions.push({ ...action.payload })
      state.submissionStatus = 'not-submitted'
    },
  },
  extraReducers: {
    [postMarkRecaptureSubmissions.pending.type]: (state, action) => {
      state.submissionStatus = 'submitting...'
    },

    [postMarkRecaptureSubmissions.fulfilled.type]: (state, action) => {
      const markRecapturePostResult = action.payload.markRecaptureResponse
      const markRecaptureReleaseCrewPostResult =
        action.payload.markRecaptureReleaseCrewResponse
      const markRecaptureReleaseMarksPostResult =
        action.payload.markRecaptureReleaseMarksResponse

      state.submissionStatus = 'submission-successful'
      state.previousMarkRecaptureSubmissions = [
        ...state.previousMarkRecaptureSubmissions,
        ...markRecapturePostResult,
      ]
      state.markRecaptureSubmissions = []

      state.previousMarkRecaptureReleaseCrewSubmissions = [
        ...state.previousMarkRecaptureReleaseCrewSubmissions,
        ...markRecaptureReleaseCrewPostResult,
      ]
      state.markRecaptureReleaseCrewSubmissions = []

      state.previousMarkRecaptureReleaseMarksSubmissions = [
        ...state.previousMarkRecaptureReleaseMarksSubmissions,
        ...markRecaptureReleaseMarksPostResult,
      ]
      state.markRecaptureReleaseMarksSubmissions = []

      console.log('successful mark Recap post processing: ', action.payload)
    },

    [postMarkRecaptureSubmissions.rejected.type]: (state, action) => {
      console.log('rejected mark Recap post processing: ', action.payload)
      state.submissionStatus = 'submission-failed'
    },
  },
})

export const { saveMarkRecaptureSubmission } = markRecapturePostBundler.actions

export default markRecapturePostBundler.reducer
