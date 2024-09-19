import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { RootState } from '../../store'
import { cloneDeep } from 'lodash'
import { getSubstring } from '../../../utils/utils'
import { PURGE } from 'redux-persist'
import { showSlideAlert } from '../slideAlertSlice'

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
  debrisVolumeGal?: number
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
  taxonCode?: number
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

    try {
      const trapVisitSubmissions =
        state.trapVisitFormPostBundler.trapVisitSubmissions
      const catchRawSubmissions =
        state.trapVisitFormPostBundler.catchRawSubmissions

      const promiseTracker: {
        [key: string]: {
          trapPromise: Promise<any>
          linkedCatchRawSubmissions: any[]
        }
      } = {}

      trapVisitSubmissions.forEach(trapSubmission => {
        const uuid = trapSubmission.trapVisitUid
        const trapPromise = api.post('trap-visit/', trapSubmission)
        const linkedCatchRawSubmissions = catchRawSubmissions.filter(
          catchSubmission => catchSubmission.uid === uuid
        )

        promiseTracker[uuid] = {
          trapPromise,
          linkedCatchRawSubmissions,
        }
      })

      for (const uuid in promiseTracker) {
        const { trapPromise, linkedCatchRawSubmissions } = promiseTracker[uuid]

        await trapPromise
          .then(async (response: any) => {
            let trapId = response.data.createdTrapVisitResponse.id

            // Save to payload
            payload.trapVisitResponse.push(response.data)

            const catchPromises = linkedCatchRawSubmissions.map(
              ({ uid, ...rest }: { uid: string }) =>
                api.post('catch-raw/', {
                  ...rest,
                  trapVisitId: trapId,
                })
            )

            const catchResults = await Promise.allSettled(catchPromises)

            for (const result of catchResults) {
              if (result.status === 'fulfilled') {
                payload.catchRawResponse.push(result.value.data)
              } else {
                console.log('server processed catch fail: ', result)
                // handle failed catch-raw request
              }
            }
          })
          .catch((error: any) => {
            console.log('trap submission error: ', error)
            const { response } = error
            const errorDetail = response.data.detail
            if (!errorDetail.includes('already exists')) {
              payload.failedTrapVisitSubmissions.push(
                trapVisitSubmissions.find(
                  trapSubmission => trapSubmission.trapVisitUid === uuid
                )
              )
            }
          })
      }
    } catch (err) {
      console.log('error in fetchWithPostParams: ', err)
    } finally {
      await fetchWithPostParams(thunkAPI.dispatch, payload)
    }

    return payload
  }
)

export const postQCSubmissions = createAsyncThunk(
  'trapVisitPostBundler/postQCSubmissions',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState
      const qcTrapVisitSubmissions =
        state.trapVisitFormPostBundler.qcTrapVisitSubmissions
      const qcCatchRawSubmissions =
        state.trapVisitFormPostBundler.qcCatchRawSubmissions

      if (qcTrapVisitSubmissions.length || qcCatchRawSubmissions.length) {
        const trapPromises = qcTrapVisitSubmissions.map(
          (trapSubmission: any) => {
            let id = trapSubmission.createdTrapVisitResponse.id
            let payload = { ...trapSubmission }
            delete payload.createdTrapVisitResponse.id
            delete payload.stagedForSubmission

            return api.put(`trap-visit/${id}`, {
              ...payload,
            })
          }
        )

        const catchPromises = qcCatchRawSubmissions.map(
          (catchSubmission: any) => {
            let id = catchSubmission.createdCatchRawResponse.id
            let payload = { ...catchSubmission }
            delete payload.createdCatchRawResponse.id
            delete payload.stagedForSubmission

            return api.put(`catch-raw/${id}`, {
              ...payload,
            })
          }
        )

        const trapResults = await Promise.allSettled(trapPromises).catch(
          error => {
            console.log('trap qc submission error: ', error)
          }
        )

        const catchResults = await Promise.allSettled(catchPromises).catch(
          error => {
            console.log('catch qc submission error: ', error)
          }
        )

        const trapVisitResponse = []

        for (const result of trapResults as any) {
          if (result.status === 'fulfilled') {
            trapVisitResponse.push(result.value.data)
          } else {
            console.log('trap qc submission fail: ', result)
          }
        }

        const catchRawResponse = []

        for (const result of catchResults as any) {
          if (result.status === 'fulfilled') {
            catchRawResponse.push(result.value.data)
          } else {
            console.log('catch qc submission fail: ', result)
          }
        }

        showSlideAlert(thunkAPI.dispatch, 'QC submissions')

        return {
          trapVisitResponse,
          catchRawResponse,
        }
      }
    } catch (err) {
      console.log('error in postQCSubmissions: ', err)
    }
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
  let fetchResults = null
  try {
    fetchResults = await dispatch(fetchPreviousTrapAndCatch())

    if (fetchResults.meta.requestStatus === 'fulfilled') {
      const fetchPayload = fetchResults.payload
      const { previousTrapVisits, previousCatchRaw } = fetchPayload

      const fetchedTrapUids = previousTrapVisits.map(
        (trap: any) => trap.createdTrapVisitResponse.trapVisitUid
      )
      const postedTrapUids = trapVisitResponse.map(
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

      let missedTrapVisitRecords: any[] = []
      let missedCatchRawRecords: any[] = []

      // check trap visit
      // if fetch DOES NOT contain post results
      if (!doesFetchContainPost(fetchedTrapUids, postedTrapUids)) {
        missedTrapVisitRecords = trapVisitResponse.filter((response: any) => {
          return !fetchedTrapUids.includes(
            response.createdTrapVisitResponse.trapVisitUid
          )
        })
      }

      // check catch raw
      // if fetch DOES NOT contain post results
      if (!doesFetchContainPost(fetchedCatchRawIds, postedCatchRawIds)) {
        missedCatchRawRecords = catchRawResponse.filter((response: any) => {
          return !fetchedCatchRawIds.includes(
            response.createdCatchRawResponse.id
          )
        })
      }

      if (missedTrapVisitRecords.length || missedCatchRawRecords.length) {
        dispatch(
          addMissingFetchedRecords({
            missedTrapVisitRecords,
            missedCatchRawRecords,
          })
        )
      }
    }
  } catch (error) {
    console.log('error in fetchWithPostParams: ', error)
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
      let { trapVisitId, userId, submission } = action.payload
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
          trapVisitToQC.createdTrapVisitResponse.qcCompletedAt =
            new Date().toISOString()
          trapVisitToQC.createdTrapVisitResponse.qcCompletedBy = userId
        }

        trapVisitToQC['stagedForSubmission'] = true

        state.previousTrapVisitSubmissions = [
          ...state.previousTrapVisitSubmissions.slice(0, trapVisitIdx),
          ...state.previousTrapVisitSubmissions.slice(trapVisitIdx + 1),
        ]
        state.qcTrapVisitSubmissions.push(trapVisitToQC)
      }
      // if trap visit has started QC
      else {
        let qcTrapVisit: any = state.qcTrapVisitSubmissions[qcTrapVisitIdx]

        qcTrapVisit.createdTrapVisitResponse.qcCompletedBy = userId

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
      let { catchRawId, userId, submissions } = action.payload
      let catchHasStartedQC = false
      let qcCatchRawIdx = -1

      state.qcCatchRawSubmissions.forEach((catchRaw: any, idx: number) => {
        if (catchRaw.createdCatchRawResponse.id === catchRawId) {
          catchHasStartedQC = true
          qcCatchRawIdx = idx
        }
      })

      // if catch has not started QC
      if (!catchHasStartedQC && qcCatchRawIdx === -1) {
        let catchRawIdx = -1
        state.previousCatchRawSubmissions.forEach((catchRaw: any, idx) => {
          if (catchRaw.createdCatchRawResponse.id === catchRawId) {
            catchRawIdx = idx
          }
        })
        let catchRawToQC: any = state.previousCatchRawSubmissions[catchRawIdx]

        for (const submission of submissions) {
          switch (submission.fieldName) {
            case 'Species':
              catchRawToQC.createdCatchRawResponse.taxonCode = submission.value
              break
            case 'Run':
              catchRawToQC.createdCatchRawResponse.captureRunClass =
                submission.value
              break
            case 'Life Stage':
              catchRawToQC.createdCatchRawResponse.lifeStage = submission.value
              break
            case 'Fork Length':
              catchRawToQC.createdCatchRawResponse.forkLength = Number(
                submission.value
              )
              break
            case 'Mark Type':
              catchRawToQC.createdCatchRawResponse.markType = submission.value
              break
            case 'Mark Color':
              catchRawToQC.createdCatchRawResponse.markColor = submission.value
              break
            case 'Mark Position':
              catchRawToQC.createdCatchRawResponse.markPosition =
                submission.value
              break
            case 'Mortality':
              catchRawToQC.createdCatchRawResponse.dead = submission.value
              break
            case 'Weight':
              catchRawToQC.createdCatchRawResponse.weight = Number(
                submission.value
              )
              break
            case 'Adipose Clipped':
              catchRawToQC.createdCatchRawResponse.adiposeClipped =
                submission.value
              break
            case 'Plus Count':
              catchRawToQC.createdCatchRawResponse.numFishCaught = Number(
                submission.value
              )
              break
            case 'Release Site':
              catchRawToQC.releaseResponse.releaseSiteId = submission.value
              break
            case 'Release Date':
              catchRawToQC.createdCatchRawResponse.releaseDate =
                submission.value
              break
            case 'Number Recaptured':
              catchRawToQC.createdCatchRawResponse.numFishCaught = Number(
                submission.value
              )
              break
            case 'Wild Fish Released':
              catchRawToQC.releaseResponse.totalWildFishReleased = Number(
                submission.value
              )
              break
            case 'Hatchery Fish Released':
              catchRawToQC.releaseResponse.totalHatcheryFishReleased = Number(
                submission.value
              )
              break
            case 'Comments':
              catchRawToQC.createdCatchRawResponse.qcComments = submission.value
              break
            default:
              break
          }
        }

        catchRawToQC.createdCatchRawResponse.qcCompleted = true
        catchRawToQC.createdCatchRawResponse.qcTime = new Date().toISOString()
        catchRawToQC.createdCatchRawResponse.qcCompletedBy = userId

        catchRawToQC['stagedForSubmission'] = true

        state.previousCatchRawSubmissions = [
          ...state.previousCatchRawSubmissions.slice(0, catchRawIdx),
          ...state.previousCatchRawSubmissions.slice(catchRawIdx + 1),
        ]
        state.qcCatchRawSubmissions.push(catchRawToQC)
      }
      // if catch has started QC
      else {
        let qcCatchRaw: any = state.qcCatchRawSubmissions[qcCatchRawIdx]

        qcCatchRaw.createdCatchRawResponse.qcCompletedBy = userId

        for (const submission of submissions) {
          switch (submission.fieldName) {
            case 'Species':
              qcCatchRaw.createdCatchRawResponse.taxonCode = submission.value
              break
            case 'Run':
              qcCatchRaw.createdCatchRawResponse.captureRunClass =
                submission.value
              break
            case 'Life Stage':
              qcCatchRaw.createdCatchRawResponse.lifeStage = submission.value
              break
            case 'Fork Length':
              qcCatchRaw.createdCatchRawResponse.forkLength = submission.value
              break
            case 'Mark Type':
              qcCatchRaw.createdCatchRawResponse.markType = submission.value
              break
            case 'Mark Color':
              qcCatchRaw.createdCatchRawResponse.markColor = submission.value
              break
            case 'Mark Position':
              qcCatchRaw.createdCatchRawResponse.markPosition = submission.value
              break
            case 'Mortality':
              qcCatchRaw.createdCatchRawResponse.dead = submission.value
              break
            case 'Weight':
              qcCatchRaw.createdCatchRawResponse.weight = submission.value
              break
            case 'Adipose Clipped':
              qcCatchRaw.createdCatchRawResponse.adiposeClipped =
                submission.value
              break
            case 'Plus Count':
              qcCatchRaw.createdCatchRawResponse.numFishCaught = Number(
                submission.value
              )
              break
            case 'Release Site':
              qcCatchRaw.releaseResponse.releaseSiteId = submission.value
              break
            case 'Release Date':
              qcCatchRaw.createdCatchRawResponse.releaseDate = submission.value
              break
            case 'Number Recaptured':
              qcCatchRaw.createdCatchRawResponse.numFishCaught = Number(
                submission.value
              )
              break
            case 'Wild Fish Released':
              qcCatchRaw.releaseResponse.totalWildFishReleased = Number(
                submission.value
              )
              break
            case 'Hatchery Fish Released':
              qcCatchRaw.releaseResponse.totalHatcheryFishReleased = Number(
                submission.value
              )
              break
            case 'Comments':
              qcCatchRaw.createdCatchRawResponse.qcComments = submission.value
              break
            default:
              break
          }
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
    addMissingFetchedRecords: (state, action) => {
      const { missedTrapVisitRecords, missedCatchRawRecords } = action.payload
      let missedTrapFetchUids = missedTrapVisitRecords.map(
        (trapVisit: any) => trapVisit.createdTrapVisitResponse.trapVisitUid
      )

      if (missedTrapVisitRecords.length) {
        state.previousTrapVisitSubmissions.push(...missedTrapVisitRecords)
        state.trapVisitSubmissions = state.trapVisitSubmissions.filter(
          (trapVisit: any) => {
            return !missedTrapFetchUids.includes(trapVisit.trapVisitUid)
          }
        )
      }

      if (missedCatchRawRecords.length) {
        state.previousCatchRawSubmissions.push(...missedCatchRawRecords)
        state.catchRawSubmissions = state.catchRawSubmissions.filter(
          (catchRaw: any) => {
            return !missedTrapFetchUids.includes(catchRaw.uid)
          }
        )
      }
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

    builder.addCase(postQCSubmissions.fulfilled.type, (state, action: any) => {
      const { trapVisitResponse, catchRawResponse } = action.payload
      console.log('fufilled postQCSubmissions: ', action.payload)

      // remove all updated trap visit and catch raw in trapVisitResponse and catchRawResponse from qcTrapVisitSubmissions and qcCatchRawSubmissions
      if (trapVisitResponse.length) {
        state.qcTrapVisitSubmissions = state.qcTrapVisitSubmissions.filter(
          (qcTrapVisit: any) => {
            let trapVisitResponseIds = trapVisitResponse.map(
              (trapVisit: any) => trapVisit.createdTrapVisitResponse.id
            )
            return !trapVisitResponseIds.includes(
              qcTrapVisit.createdTrapVisitResponse.id
            )
          }
        )
      }

      if (catchRawResponse.length) {
        state.qcCatchRawSubmissions = state.qcCatchRawSubmissions.filter(
          (qcCatchRaw: any) => {
            let catchRawResponseIds = catchRawResponse.map(
              (catchRaw: any) => catchRaw.createdCatchRawResponse.id
            )
            return !catchRawResponseIds.includes(
              qcCatchRaw.createdCatchRawResponse.id
            )
          }
        )
      }

      if (trapVisitResponse.length) {
        state.previousTrapVisitSubmissions.push(...trapVisitResponse)
      }

      if (catchRawResponse.length) {
        state.previousCatchRawSubmissions.push(...catchRawResponse)
      }
    })

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
  addMissingFetchedRecords,
  // addMissingFetchedTrapVisitSubs,
  // addMissingFetchedCatchRawSubs,
} = trapVisitPostBundler.actions

export default trapVisitPostBundler.reducer
