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
}

interface MarkRecaptureSubmissionI {
  id: number
  programId?: number
  releasePurposeId?: number
  releaseSiteId?: number
  releasedAt?: Date
  markedAt?: Date
  markColor?: number
  markType?: number
  markPosition?: number
  runHatcheryFish?: number
  runHatcheryFishWeight?: number
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
}

export const postMarkRecaptureSubmissions = createAsyncThunk(
  'markRecapturePostBundler/markRecaptureSubmissions',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState
    let payload: {
      markRecaptureResponse: any[]
    } = {
      markRecaptureResponse: [],
    }

    const markRecaptureSubmissions =
      state.markRecaptureFormPostBundler.markRecaptureSubmissions

    await Promise.all(
      markRecaptureSubmissions.map(async (markRecaptureSubmission: any) => {
        console.log('hit inside of markRecap Promise')
      })
    )
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
      // const catchRawPostResult = action.payload.catchRawResponse
      state.submissionStatus = 'submission-successful'
      state.previousMarkRecaptureSubmissions = [
        ...state.previousMarkRecaptureSubmissions,
        ...markRecapturePostResult,
      ]
      state.markRecaptureSubmissions = []
      // state.previousCatchRawSubmissions = [
      //   ...state.previousCatchRawSubmissions,
      //   ...catchRawPostResult,
      // ]
      // state.catchRawSubmissions = []
      console.log('successful mark Recap post processing: ', action.payload)
    },

    [postMarkRecaptureSubmissions.rejected.type]: (state, action) => {
      state.submissionStatus = 'submission-failed'
    },
  },
})

export const { saveMarkRecaptureSubmission } = markRecapturePostBundler.actions

export default markRecapturePostBundler.reducer
