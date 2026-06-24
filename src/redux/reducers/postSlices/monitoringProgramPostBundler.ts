import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { RootState } from '../../store'
import { cloneDeep } from 'lodash'
import { MonitoringProgramSubmissionI } from '../../../screens/accountScreens/createNewProgram/CreateNewProgramHome'
import { generateErrorMessage } from '../../../utils/helpers/helperFunctions'
import { showSlideAlert } from '../slideAlertSlice'
import { postMonitoringProgramFilesToDB } from '../../../utils/hooks/useCacheDirectory'
import { updateUserPrograms } from '../userCredentialsSlice'

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

    try {
      // Process submissions sequentially to ensure per-item error handling
      for (const monitoringProgramSubmission of monitoringProgramSubmissions) {
        try {
          const monitoringProgramSubmissionCopy = cloneDeep(
            monitoringProgramSubmission
          )
          console.log(
            '🚀 ~ file: monitoringProgramPostBundler.ts ~ monitoringProgramSubmissionCopy:',
            monitoringProgramSubmissionCopy
          )

          // submit monitoring Program
          const apiResponse: APIResponseI = await api.post(
            'program/',
            monitoringProgramSubmissionCopy
          )
          // get response from server
          const userProgramResponse = await api.get(
            `program/personnel/${monitoringProgramSubmissionCopy.metaData.personnelLead}`
          )

          // save to payload
          payload.monitoringProgramResponse.push(apiResponse.data)
          const {
            createdProgramResponse: { id: createdProgramId } = {},
            createdHatcheryInfoResponse: { id: createdHatcheryInfoId } = {},
            createdPermitInformationResponse: {
              id: createdPermitInformationId,
            } = {},
          } = apiResponse.data || {}
          const isNonTestSave =
            createdPermitInformationId &&
            createdProgramId &&
            createdHatcheryInfoId

          if (isNonTestSave)
            postMonitoringProgramFilesToDB({
              createdProgramId,
              createdHatcheryInfoId,
              createdPermitInformationId,
            })

          thunkAPI.dispatch(updateUserPrograms(userProgramResponse.data))
        } catch (error: any) {
          console.log(
            '🚀 ~ file: monitoringProgramPostBundler.ts ~ submission error:',
            error
          )
          const errorMessage = generateErrorMessage(
            error?.code ||
              'An unknown error occurred during monitoring program submission (ln 67)'
          )
          showSlideAlert(thunkAPI.dispatch, errorMessage, 'error', 5000)
        }
      }
    } catch (error: any) {
      console.log(
        '🚀 ~ file: monitoringProgramPostBundler.ts:102 ~ error:',
        error
      )

      const errorMessage = generateErrorMessage(
        error?.code ||
          'An unknown error occurred during monitoring program submission (ln 67)'
      )
      showSlideAlert(thunkAPI.dispatch, errorMessage, 'error', 5000)
    }
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
