import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { RootState } from '../../store'
import { cloneDeep } from 'lodash'
import { getSubstring } from '../../../utils/utils'
import { PURGE } from 'redux-persist'

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
  createdBy?: number
  qcCompletedBy?: number
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
      failedTrapVisitSubmissions: any[]
      failedCatchRawSubmissions: any[]
    } = {
      trapVisitResponse: [],
      catchRawResponse: [],
      failedTrapVisitSubmissions: [],
      failedCatchRawSubmissions: [],
    }

    // getting submissions for trap / catch_raw
    const trapVisitSubmissions: any =
      state.trapVisitFormPostBundler.trapVisitSubmissions
    const catchRawSubmissions: any =
      state.trapVisitFormPostBundler.catchRawSubmissions

    // try {
    const promiseTracker: {
      [key: string]: {
        trapPromise: Promise<any>
        linkedCatchRawSubmissions: any[]
      }
    } = {
      // '028u208u02934u': {
      //   trap: trapPromise,
      //   linkedCatchRawSubmissions: []
      // },
    }

    trapVisitSubmissions.forEach((trapSubmission: any) => {
      const uuid = trapSubmission.trapVisitUid
      const trapPromise = api.post('trap-visit/', trapSubmission)
      const linkedCatchRawSubmissions = catchRawSubmissions.filter(
        (catchSubmission: any) => catchSubmission.uid === uuid
      )

      promiseTracker[uuid] = {
        trapPromise,
        linkedCatchRawSubmissions,
      } as any
    })

    // iterate through each uuid key in promiseTracker and await trap post, get back id, then await catches
    for (const uuid in promiseTracker) {
      const { trapPromise, linkedCatchRawSubmissions } = promiseTracker[uuid]

      trapPromise
        .then(async (response: any) => {
          console.log('trap promise response: ', response)
          let trapId = response.data.createdTrapVisitResponse.id
          const {
            createdTrapVisitResponse,
            createdTrapVisitCrewResponse,
            createdTrapCoordinatesResponse,
            createdTrapVisitEnvironmentalResponse,
          } = response.data
          // save to payload
          payload.trapVisitResponse.push({
            createdTrapVisitResponse,
            createdTrapVisitCrewResponse,
            createdTrapCoordinatesResponse,
            createdTrapVisitEnvironmentalResponse,
          })

          const catchPromises = linkedCatchRawSubmissions.map(
            ({ uid, ...rest }: any) =>
              api.post('catch-raw/', {
                ...rest,
                trapVisitId: trapId,
              })
          )

          const catchResults = await Promise.allSettled(catchPromises).catch(
            error => {
              console.log('catch submission error: ', error)
              const { response } = error
              const errorDetail = response.data.detail
              if (!errorDetail.includes('already exists')) {
                payload.failedCatchRawSubmissions.push(
                  catchRawSubmissions.find(
                    (catchSubmission: any) => catchSubmission.uid === uuid
                  )
                )
              }
            }
          )

          for (const result of catchResults as any) {
            if (result.status === 'fulfilled') {
              const {
                createdCatchRawResponse,
                createdGeneticSamplingDataResponse,
                createdExistingMarksResponse,
                createdMarkAppliedResponse,
              } = result.value.data

              payload.catchRawResponse.push({
                createdCatchRawResponse,
                createdGeneticSamplingDataResponse,
                createdExistingMarksResponse,
                createdMarkAppliedResponse,
              })
            } else {
              console.log('server processed catch fail: ', result)
              // handle failed catch-raw request
              // what is result in this case?
            }
          }
        })
        .catch((error: any) => {
          console.log('trap submission error: ', error)
          // handle failed trap submissions
          const { response } = error
          const errorDetail = response.data.detail
          if (!errorDetail.includes('already exists')) {
            payload.failedTrapVisitSubmissions.push(
              trapVisitSubmissions.find(
                (trapSubmission: any) => trapSubmission.trapVisitUid === uuid
              )
            )
          }
        })
    }

    try {
      await fetchWithPostParams(thunkAPI.dispatch, payload)
    } catch (err) {
      console.log('error in fetchWithPostParams: ', err)
    }
    return payload
  }
)

export const fetchPreviousTrapAndCatch = createAsyncThunk(
  'trapVisitPostBundler/fetchPreviousTrapAndCatch',
  async (_, thunkAPI) => {
    const previousTrapVisits: any[] = []
    const previousCatchRaw: any[] = []
    try {
      const state = thunkAPI.getState() as RootState
      const userPrograms = state.visitSetupDefaults.programs
      await Promise.all(
        userPrograms.map(async program => {
          const trapVisitResponse = await api.get(
            `trap-visit/program/${program.programId}`
          )
          const catchRawResponse = await api.get(
            `catch-raw/program/${program.programId}`
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

const fetchWithPostParams = async (dispatch: any, postResults: any) => {
  const { trapVisitResponse, catchRawResponse } = postResults

  if (trapVisitResponse.length) {
    const fetchResults = await dispatch(fetchPreviousTrapAndCatch())

    if (fetchResults.meta.requestStatus === 'fulfilled') {
      const fetchPayload = fetchResults.payload
      const { previousTrapVisits, previousCatchRaw } = fetchPayload
      console.log('fetchPayload: ', fetchPayload)

      const fetchedTrapIds = previousTrapVisits.map(
        (trap: any) => trap.createdTrapVisitResponse.trapVisitUid
      )
      const postedTrapIds = trapVisitResponse.map(
        (trap: any) => trap.createdTrapVisitResponse.trapVisitUid
      )

      const fetchedCatchRawIds = previousCatchRaw.map(
        (catchRaw: any) => catchRaw.createdCatchRawResponse.id
      )

      const postedCatchRawIds = catchRawResponse.map(
        (catchRaw: any) => catchRaw.createdCatchRawResponse.id
      )

      // check if every fetched values contain posted values
      const doesFetchContainPost = (arr: any, target: any) =>
        target.every((v: any) => arr.includes(v))

      // check trap visit
      // if fetch DOES NOT contain post results
      if (!doesFetchContainPost(fetchedTrapIds, postedTrapIds)) {
        const missedFetchIds = postedTrapIds.filter((id: number) => {
          return !fetchedTrapIds.includes(id)
        })
        dispatch(addMissingFetchedTrapVisitSubs({ missedFetchIds }))
      }
      // if fetch results DOES contain post results
      else {
        dispatch(clearPendingTrapVisitSubs())
      }

      // check catch raw
      // if fetch DOES NOT contain post results
      if (!doesFetchContainPost(fetchedCatchRawIds, postedCatchRawIds)) {
        const missedFetchIds = postedCatchRawIds.filter((id: number) => {
          return !fetchedCatchRawIds.includes(id)
        })
        dispatch(addMissingFetchedCatchRawSubs({ missedFetchIds }))
      }
      // if fetch results DOES contain post results
      else {
        dispatch(clearPendingCatchRawSubs())
      }
    }
  }
}

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
        if (trapVisit.createdTrapVisitResponse.trapVisitUid === trapVisitId) {
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

        if (trapVisitToQC?.createdTrapVisitEnvironmentalResponse) {
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
        }

        if (trapVisitToQC?.createdTrapVisitResponse) {
          //trap visit record data
          trapVisitToQC.createdTrapVisitResponse.totalRevolutions =
            submission['Counter'].y
          trapVisitToQC.createdTrapVisitResponse.debrisVolumeGal =
            submission['Debris'].y
          trapVisitToQC.createdTrapVisitResponse.rpmAtStart =
            submission['RPM At Start'].y
          trapVisitToQC.createdTrapVisitResponse.rpmAtEnd =
            submission['RPM At End'].y
          trapVisitToQC.createdTrapVisitResponse.qcCompleted = true
          trapVisitToQC.createdTrapVisitResponse.qcCompletedAt = new Date()
        }

        state.previousTrapVisitSubmissions = [
          ...state.previousTrapVisitSubmissions.slice(0, trapVisitIdx),
          ...state.previousTrapVisitSubmissions.slice(trapVisitIdx + 1),
        ]
        state.qcTrapVisitSubmissions.push(trapVisitToQC)
        console.log(
          'previousTrapVisitSubmissions in bundler',
          state.previousTrapVisitSubmissions.length
        )

        console.log(
          'qcTrapVisitSubmissions in bundler: ',
          state.qcTrapVisitSubmissions.length
        )
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
        qcTrapVisit.createdTrapVisitResponse.debrisVolumeGal =
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
    reset: () => {
      return initialState
    },
    clearPendingTrapVisitSubs: state => {
      state.trapVisitSubmissions = []
    },
    clearPendingCatchRawSubs: state => {
      state.catchRawSubmissions = []
    },
    addMissingFetchedTrapVisitSubs: (state, action) => {
      const { missedFetchIds } = action.payload
      const missedTrapVisits = state.trapVisitSubmissions.filter(
        (trapVisit: any) => {
          return missedFetchIds.includes(trapVisit.trapVisitUid)
        }
      )
      state.previousTrapVisitSubmissions.push(...missedTrapVisits)
      state.trapVisitSubmissions = state.trapVisitSubmissions.filter(
        (trapVisit: any) => {
          return !missedFetchIds.includes(trapVisit.trapVisitUid)
        }
      )
    },
    addMissingFetchedCatchRawSubs: (state, action) => {
      const { missedFetchIds } = action.payload
      const missedCatchRaws = state.catchRawSubmissions.filter(
        (catchRaw: any) => {
          return missedFetchIds.includes(catchRaw.id)
        }
      )
      state.previousCatchRawSubmissions.push(...missedCatchRaws)
      state.catchRawSubmissions = state.catchRawSubmissions.filter(
        (catchRaw: any) => {
          return !missedFetchIds.includes(catchRaw.uid)
        }
      )
    },
  },
  extraReducers: builder => {
    builder.addCase(PURGE, () => {
      return initialState
    })

    builder.addCase(
      postTrapVisitFormSubmissions.pending.type,
      (state, action) => {
        state.submissionStatus = 'submitting...'
      }
    )

    builder.addCase(
      postTrapVisitFormSubmissions.fulfilled.type,
      (state, action: any) => {
        const {
          failedTrapVisitSubmissions,
          failedCatchRawSubmissions,
          trapVisitResponse,
          catchRawResponse,
        } = action.payload

        state.submissionStatus = 'submission-successful'
        state.catchRawSubmissions = [...failedCatchRawSubmissions]
        state.trapVisitSubmissions = [...failedTrapVisitSubmissions]
      }
    )

    builder.addCase(
      fetchPreviousTrapAndCatch.fulfilled.type,
      (state, action: any) => {
        const { previousTrapVisits, previousCatchRaw } = action.payload
        state.previousTrapVisitSubmissions = previousTrapVisits
        state.previousCatchRawSubmissions = previousCatchRaw
        state.fetchStatus = 'fetch-successful'
      }
    )

    builder.addCase(
      fetchPreviousTrapAndCatch.rejected.type,
      (state, action) => {
        state.fetchStatus = 'fetch-failed'
      }
    )
  },
})

export const {
  saveTrapVisitSubmission,
  saveCatchRawSubmissions,
  trapVisitQCSubmission,
  catchRawQCSubmission,
  reset,
  clearPendingTrapVisitSubs,
  clearPendingCatchRawSubs,
  addMissingFetchedTrapVisitSubs,
  addMissingFetchedCatchRawSubs,
} = trapVisitPostBundler.actions

export default trapVisitPostBundler.reducer
