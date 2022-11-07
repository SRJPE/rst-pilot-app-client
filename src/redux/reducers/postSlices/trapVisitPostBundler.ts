import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { connectionChanged } from '../connectivitySlice'

interface InitialStateI {
  submitted: boolean
  submissionStatus:
    | 'not-submitted'
    | 'submitting...'
    | 'submission-failed'
    | 'submission-successful'
  trapVisitSubmissions: TrapVisitSubmissionI[]
  previousTrapVisitSubmissions: TrapVisitSubmissionI[]
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

interface APIResponseI {
  data: any
}

const initialState: InitialStateI = {
  submitted: false,
  submissionStatus: 'not-submitted',
  trapVisitSubmissions: [],
  previousTrapVisitSubmissions: [],
}

// Async actions API calls
export const postTrapVisitSubmissions = createAsyncThunk(
  'trapVisitPostBundler/postTrapVisitSubmissions',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as InitialStateI
    const trapVisitSubmissions = state.trapVisitSubmissions
    const response: APIResponseI = await api.post(
      'trap-visit/',
      trapVisitSubmissions
    )
    return response.data
  }
)

export const trapVisitPostBundler = createSlice({
  name: 'trapVisitPostBundler',
  initialState: initialState,
  reducers: {
    saveTrapVisitSubmission: (state, action) => {
      state.trapVisitSubmissions.push({ ...action.payload })
      state.submitted = false
    },
  },
  extraReducers: {
    [postTrapVisitSubmissions.pending.type]: (state, action) => {
      state.submitted = false
      state.submissionStatus = 'submitting...'
    },

    [postTrapVisitSubmissions.fulfilled.type]: (state, action) => {
      const trapVisitPostResult = action.payload
      state.submitted = true
      state.submissionStatus = 'submission-successful'
      state.previousTrapVisitSubmissions = [
        ...state.previousTrapVisitSubmissions,
        ...(trapVisitPostResult as TrapVisitSubmissionI[]),
      ]
      state.trapVisitSubmissions = []
      console.log('successful post result: ', action.payload)
    },

    [postTrapVisitSubmissions.rejected.type]: (state, action) => {
      state.submitted = false
      state.submissionStatus = 'submission-failed'
    },
    [connectionChanged.type]: (state, action) => {
      if (
        action.payload.isConnected &&
        !state.submitted &&
        state.trapVisitSubmissions.length
      ) {
        try {
          ;(async () => {
            const trapVisitPostRequest: APIResponseI = await api.post(
              'trap-visit/',
              state.trapVisitSubmissions
            )
            const trapVisitPostResult = trapVisitPostRequest.data
            state.submitted = true
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

export const { saveTrapVisitSubmission } = trapVisitPostBundler.actions

export default trapVisitPostBundler.reducer
