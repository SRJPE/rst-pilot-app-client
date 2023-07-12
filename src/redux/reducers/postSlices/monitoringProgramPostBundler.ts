import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { RootState } from '../../store'
import { cloneDeep } from 'lodash'
import { MonitoringProgramSubmissionI } from '../../../screens/accountScreens/createNewProgram/CreateNewProgramHome'

interface InitialStateI {
  submissionStatus:
    | 'not-submitted'
    | 'submitting...'
    | 'submission-failed'
    | 'submission-successful'
  monitoringProgramSubmissions: MonitoringProgramSubmissionI[]
  previousMonitoringProgramSubmissions: MonitoringProgramSubmissionI[]
}

interface APIResponseI {
  data: any
}

const initialState: InitialStateI = {
  submissionStatus: 'not-submitted',
  monitoringProgramSubmissions: [],
  previousMonitoringProgramSubmissions: [],
}

export const postMonitoringProgramSubmissions = createAsyncThunk(
  'monitoringProgramPostBundler/postMonitoringProgramSubmissions',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState
    let payload: {
      monitoringProgramResponse: any[]
    } = {
      monitoringProgramResponse: [],
    }
    //get submissions
    const monitoringProgramSubmissions =
      state.monitoringProgramPostBundler.monitoringProgramSubmissions

    await Promise.all(
      monitoringProgramSubmissions.map(
        async (monitoringProgramSubmission: MonitoringProgramSubmissionI) => {
          const monitoringProgramSubmissionCopy = cloneDeep(
            monitoringProgramSubmission
          )
          console.log(
            '🚀 ~ hit... monitoringProgramSubmissionCopy:',
            monitoringProgramSubmissionCopy
          )
          // submit monitoring Program
          const apiResponse: APIResponseI = await api.post(
            'program/',
            monitoringProgramSubmissionCopy
          )
          // get response from server
          // save to payload
          payload.monitoringProgramResponse.push(apiResponse.data)
        }
      )
    )
    return payload
  }
)

export const monitoringProgramPostBundler = createSlice({
  name: 'monitoringProgramPostBundler',
  initialState: initialState,
  reducers: {
    saveMonitoringProgramSubmission: (state, action) => {
      state.monitoringProgramSubmissions.push({ ...action.payload })
      state.submissionStatus = 'not-submitted'
    },
  },
  extraReducers: {
    [postMonitoringProgramSubmissions.pending.type]: (state, action) => {
      state.submissionStatus = 'submitting...'
    },

    [postMonitoringProgramSubmissions.fulfilled.type]: (state, action) => {
      const monitoringProgramPostResult =
        action.payload.monitoringProgramResponse

      state.submissionStatus = 'submission-successful'
      state.previousMonitoringProgramSubmissions = [
        ...state.previousMonitoringProgramSubmissions,
        ...monitoringProgramPostResult,
      ]
      state.monitoringProgramSubmissions = []

      console.log(
        'successful monitoring program post processing: ',
        action.payload
      )
    },

    [postMonitoringProgramSubmissions.rejected.type]: (state, action) => {
      state.submissionStatus = 'submission-failed'
    },
  },
})

export const { saveMonitoringProgramSubmission } =
  monitoringProgramPostBundler.actions

export default monitoringProgramPostBundler.reducer
