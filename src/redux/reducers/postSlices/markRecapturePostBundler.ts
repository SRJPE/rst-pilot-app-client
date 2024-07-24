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
        failedMarkRecaptureSubmissions: any[]
      } = {
        markRecaptureResponse: [],
        markRecaptureReleaseCrewResponse: [],
        markRecaptureReleaseMarksResponse: [],
        failedMarkRecaptureSubmissions: [],
      }
      //get submissions
      const markRecaptureSubmissions = [
        ...state.markRecaptureFormPostBundler.markRecaptureSubmissions,
      ]

      // create array of promises to post mark recap objs
      const markRecapPromises = markRecaptureSubmissions.map(
        (submissionObj: any) => api.post('release/', submissionObj)
      )

      // run promise all settled which will return fulfilled or rejected promises
      const markRecapResults: any = await Promise.allSettled(markRecapPromises)

      try {
        // iterate over results
        for (const [index, result] of markRecapResults.entries()) {
          // Use the index here
          // if fulfilled, save to payload
          if (result.status === 'fulfilled') {
            const { createdReleaseResponse, createdReleaseMarksResponse } =
              result.value.data

            // save to payload
            payload.markRecaptureResponse = [
              ...payload.markRecaptureResponse,
              ...createdReleaseResponse,
            ]
            // payload.markRecaptureReleaseCrewResponse = [
            //   ...payload.markRecaptureReleaseCrewResponse,
            //   ...createdReleaseCrewResponse,
            // ]

            payload.markRecaptureReleaseMarksResponse = [
              ...payload.markRecaptureReleaseMarksResponse,
              ...createdReleaseMarksResponse,
            ]

            // if rejected, keep the non duplicates in the submissions for reattempts
          } else {
            const { response } = result
            const errorDetail = response?.data?.detail

            if (errorDetail && !errorDetail.includes('already exists')) {
              payload.failedMarkRecaptureSubmissions.push(
                markRecaptureSubmissions[index]
              )
            }
            // what is result in this case?
          }
        }

        return payload
      } catch (error) {
        console.log('error in iterate', error)
      }
    } catch (error: any) {
      console.log('mark recap error', error?.response?.data)
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
      if (action.payload) {
        try {
          const markRecapturePostResult = action?.payload.markRecaptureResponse

          const markRecaptureReleaseMarksPostResult =
            action.payload.markRecaptureReleaseMarksResponse

          const failedMarkRecaptureSubmissions =
            action.payload.failedMarkRecaptureSubmissions

          state.submissionStatus = 'submission-successful'
          state.previousMarkRecaptureSubmissions = [
            ...state.previousMarkRecaptureSubmissions,
            ...markRecapturePostResult,
          ]

          state.previousMarkRecaptureReleaseMarksSubmissions = [
            ...state.previousMarkRecaptureReleaseMarksSubmissions,
            ...markRecaptureReleaseMarksPostResult,
          ]

          state.markRecaptureSubmissions = [...failedMarkRecaptureSubmissions]
        } catch (error) {
          console.log('eror in fullfilled', error)
        }
      }
    },

    [postMarkRecaptureSubmissions.rejected.type]: (state, action) => {
      console.log('rejected mark Recap post processing: ', action.payload)
      state.submissionStatus = 'submission-failed'
    },
  },
})

export const { saveMarkRecaptureSubmission } = markRecapturePostBundler.actions

export default markRecapturePostBundler.reducer
