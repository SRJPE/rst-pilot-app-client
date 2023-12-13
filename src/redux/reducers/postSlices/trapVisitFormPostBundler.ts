import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { RootState } from '../../store'
import { cloneDeep } from 'lodash'
import { getSubstring } from '../../../utils/utils'

interface InitialStateI {
  fetchStatus: 'initial-state' | 'fetch-failed' | 'fetch-successful'
  submissionStatus:
    | 'not-submitted'
    | 'submitting...'
    | 'submission-failed'
    | 'submission-successful'
  trapVisitSubmissions: TrapVisitSubmissionI[]
  previousTrapVisitSubmissions: TrapVisitSubmissionI[]
  catchRawSubmissions: CatchRawSubmissionI[]
  previousCatchRawSubmissions: CatchRawSubmissionI[]
  qcTrapVisitSubmissions: any[]
  qcCatchRawSubmissions: any[]
}

interface TrapVisitSubmissionI {
  trapVisitUid: string
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
  fetchStatus: 'initial-state',
  submissionStatus: 'not-submitted',
  trapVisitSubmissions: [],
  previousTrapVisitSubmissions: [],
  catchRawSubmissions: [],
  previousCatchRawSubmissions: [],
  qcTrapVisitSubmissions: [],
  qcCatchRawSubmissions: [],
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

export const fetchPreviousTrapAndCatch = createAsyncThunk(
  'trapVisitPostBundler/fetchPreviousTrapAndCatch',
  async (_, thunkAPI) => {
    const programIds = [1]
    // ^ hard coded value to be updated to user's program ids ^
    const previousTrapVisits: any[] = []
    const previousCatchRaw: any[] = []
    try {
      const state = thunkAPI.getState() as RootState
      await Promise.all(
        programIds.map(async programId => {
          const trapVisitResponse = await api.get(
            `trap-visit/program/${programId}`
          )
          const catchRawResponse = await api.get(
            `catch-raw/program/${programId}`
          )
          let trapVisits = trapVisitResponse.data
          let catchRaws = catchRawResponse.data

          const alreadyActiveQCTrapVisitIds: number[] =
            state.trapVisitFormPostBundler.qcTrapVisitSubmissions.map(
              trapVisit => {
                return trapVisit.createdTrapVisitResponse.id
              }
            )

          const previousTrapVisitsPayload: any[] = trapVisits.filter(
            (trapVisit: any) => {
              return !alreadyActiveQCTrapVisitIds.includes(
                trapVisit.createdTrapVisitResponse.id
              )
            }
          )

          const alreadyActiveQCCatchRawIds: number[] =
            state.trapVisitFormPostBundler.qcCatchRawSubmissions.map(
              catchRaw => {
                return catchRaw.createdCatchRawResponse.id
              }
            )

          const previousCatchRawPayload: any[] = catchRaws.filter(
            (catchRaw: any) => {
              return !alreadyActiveQCCatchRawIds.includes(
                catchRaw.createdCatchRawResponse.id
              )
            }
          )

          previousTrapVisits.push(...previousTrapVisitsPayload)
          previousCatchRaw.push(...previousCatchRawPayload)
        })
      )

      return {
        previousTrapVisits,
        previousCatchRaw,
      }
    } catch (err) {
      thunkAPI.rejectWithValue({
        previousTrapVisits: [],
        previousCatchRaw: [],
      })
    }
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
    trapVisitQCSubmission: (state, action) => {
      let { trapVisitId, submission } = action.payload
      let visitHasStartedQC = false
      let qcTrapVisitIdx = -1

      state.qcTrapVisitSubmissions.forEach((trapVisit: any, idx: number) => {
        if (trapVisit.createdTrapVisitResponse.id === trapVisitId) {
          visitHasStartedQC = true
          qcTrapVisitIdx = idx
        }
      })

      // if trap visit has not started QC
      if (!visitHasStartedQC && qcTrapVisitIdx === -1) {
        let trapVisitIdx = -1
        state.previousTrapVisitSubmissions.forEach((trapVisit: any, idx) => {
          if (trapVisit.createdTrapVisitResponse.id === trapVisitId) {
            trapVisitIdx = idx
          }
        })
        let trapVisitToQC: any =
          state.previousTrapVisitSubmissions[trapVisitIdx]

        //env data
        trapVisitToQC.createdTrapVisitEnvironmentalResponse.forEach(
          (envMeasure: any) => {
            if (envMeasure.measureName === 'water temperature') {
              envMeasure.measureValueNumeric = submission['Temperature'].y
              envMeasure.measureValueText = submission['Temperature'].y
            }

            if (envMeasure.measureName === 'water turbidity') {
              envMeasure.measureValueNumeric = submission['Turbidity'].y
              envMeasure.measureValueText = submission['Turbidity'].y
            }
          }
        )

        //trap visit record data
        trapVisitToQC.createdTrapVisitResponse.totalRevolutions =
          submission['Counter'].y
        trapVisitToQC.createdTrapVisitResponse.debrisVolumeLiters =
          submission['Debris'].y
        trapVisitToQC.createdTrapVisitResponse.rpmAtStart =
          submission['RPM At Start'].y
        trapVisitToQC.createdTrapVisitResponse.rpmAtEnd =
          submission['RPM At End'].y
        trapVisitToQC.createdTrapVisitResponse.qcCompleted = true
        trapVisitToQC.createdTrapVisitResponse.qcCompletedAt = new Date()

        state.previousTrapVisitSubmissions = [
          ...state.previousTrapVisitSubmissions.slice(0, trapVisitIdx),
          ...state.previousTrapVisitSubmissions.slice(trapVisitIdx + 1),
        ]
        state.qcTrapVisitSubmissions.push(trapVisitToQC)
      }
      // if trap visit has started QC
      else {
        let qcTrapVisit: any = state.qcTrapVisitSubmissions[qcTrapVisitIdx]

        // env data
        qcTrapVisit.createdTrapVisitEnvironmentalResponse.forEach(
          (envMeasure: any) => {
            if (envMeasure.measureName === 'water temperature') {
              envMeasure.measureValueNumeric = submission['Temperature'].y
              envMeasure.measureValueText = submission['Temperature'].y
            }

            if (envMeasure.measureName === 'water turbidity') {
              envMeasure.measureValueNumeric = submission['Turbidity'].y
              envMeasure.measureValueText = submission['Turbidity'].y
            }
          }
        )

        //trap visit record data
        qcTrapVisit.createdTrapVisitResponse.totalRevolutions =
          submission['Counter'].y
        qcTrapVisit.createdTrapVisitResponse.debrisVolumeLiters =
          submission['Debris'].y
        qcTrapVisit.createdTrapVisitResponse.rpmAtStart =
          submission['RPM At Start'].y
        qcTrapVisit.createdTrapVisitResponse.rpmAtEnd =
          submission['RPM At End'].y

        state.qcTrapVisitSubmissions = [
          ...state.qcTrapVisitSubmissions.slice(0, qcTrapVisitIdx),
          ...state.qcTrapVisitSubmissions.slice(qcTrapVisitIdx + 1),
        ]
        state.qcTrapVisitSubmissions.push(qcTrapVisit)
      }
    },
    catchRawQCSubmission: (state, action) => {
      let { catchRawId, submission } = action.payload
      let catchHasStartedQC = false
      let qcCatchRawIdx = -1
      const submissionKeys = Object.keys(submission)

      state.qcCatchRawSubmissions.forEach((catchRaw: any, idx: number) => {
        if (catchRaw.createdCatchRawResponse.id === catchRawId) {
          catchHasStartedQC = true
          qcCatchRawIdx = idx
        }
      })

      if (!catchHasStartedQC && qcCatchRawIdx === -1) {
        let catchRawIdx = -1
        state.previousCatchRawSubmissions.forEach((catchRaw: any, idx) => {
          if (catchRaw.createdCatchRawResponse.id === catchRawId) {
            catchRawIdx = idx
          }
        })
        let catchRawToQC: any = state.previousCatchRawSubmissions[catchRawIdx]

        if (submissionKeys.includes('Fork Length')) {
          catchRawToQC.createdCatchRawResponse.forkLength =
            submission['Fork Length'].y
        }

        if (submissionKeys.includes('Weight')) {
          catchRawToQC.createdCatchRawResponse.weight = submission['Weight'].y
        }

        catchRawToQC.createdCatchRawResponse.qcCompleted = true
        catchRawToQC.createdCatchRawResponse.qcTime = new Date()

        state.previousCatchRawSubmissions = [
          ...state.previousCatchRawSubmissions.slice(0, catchRawIdx),
          ...state.previousCatchRawSubmissions.slice(catchRawIdx + 1),
        ]
        state.qcCatchRawSubmissions.push(catchRawToQC)
      } else {
        let qcCatchRaw: any = state.qcCatchRawSubmissions[qcCatchRawIdx]

        if (submissionKeys.includes('Fork Length')) {
          qcCatchRaw.createdCatchRawResponse.forkLength =
            submission['Fork Length'].y
        }

        if (submissionKeys.includes('Weight')) {
          qcCatchRaw.createdCatchRawResponse.weight = submission['Weight'].y
        }

        state.qcCatchRawSubmissions = [
          ...state.qcCatchRawSubmissions.slice(0, qcCatchRawIdx),
          ...state.qcCatchRawSubmissions.slice(qcCatchRawIdx + 1),
        ]
        state.qcCatchRawSubmissions.push(qcCatchRaw)
      }
    },
  },
  extraReducers: {
    [postTrapVisitFormSubmissions.pending.type]: (state, action) => {
      state.submissionStatus = 'submitting...'
    },

    [postTrapVisitFormSubmissions.fulfilled.type]: (state, action) => {
      state.submissionStatus = 'submission-successful'
      console.log('successful post processing: ', action.payload)
    },

    [postTrapVisitFormSubmissions.rejected.type]: (state, action) => {
      let errorDetail: string = action.payload.error.data.detail
      let { failedTrapVisitSubmissions, failedCatchRawSubmissions } =
        action.payload
      if (errorDetail.includes('already exists')) {
        // if duplicate trap visit
        if (
          [
            'Key (program_id, trap_location_id, trap_visit_time_start)',
            'Key (trap_visit_uid)',
          ].includes(errorDetail)
        ) {
          let index = getIndexOfDuplicateTrapVisit({
            errorDetail,
            failedTrapVisitSubmissions,
          })
          state.trapVisitSubmissions.splice(index, 1)
        }
      }
      state.submissionStatus = 'submission-failed'
    },
    [fetchPreviousTrapAndCatch.fulfilled.type]: (state, action) => {
      const { previousTrapVisits, previousCatchRaw } = action.payload
      state.previousTrapVisitSubmissions = previousTrapVisits
      state.previousCatchRawSubmissions = previousCatchRaw
      state.fetchStatus = 'fetch-successful'
      console.log('successful QC fetch: ', action.payload)
    },
    [fetchPreviousTrapAndCatch.rejected.type]: (state, action) => {
      state.fetchStatus = 'fetch-failed'
    },
  },
})

export const {
  saveTrapVisitSubmission,
  saveCatchRawSubmissions,
  trapVisitQCSubmission,
  catchRawQCSubmission,
} = trapVisitPostBundler.actions

export default trapVisitPostBundler.reducer
