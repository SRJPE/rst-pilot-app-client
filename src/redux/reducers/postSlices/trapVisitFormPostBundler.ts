import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../../../api/axiosConfig'
import { RootState } from '../../store'
import { getSubstring } from '../../../utils/utils'
import { PURGE } from 'redux-persist'
import { showSlideAlert } from '../slideAlertSlice'
import { generateErrorMessage } from '../../../utils/helpers/helperFunctions'
import { AxiosError } from 'axios'
import { getVisitSetupDefaults } from '../visitSetupDefaults'

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
  qcCatchRawDeletions: any[]
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
  qcCatchRawDeletions: [],
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

      // Build promise tracker sequentially and execute each submission with per-item try/catch
      for (const trapSubmission of trapVisitSubmissions) {
        const uuid = trapSubmission.trapVisitUid
        const linkedCatchRawSubmissions = catchRawSubmissions.filter(
          catchSubmission => catchSubmission.uid === uuid
        )

        try {
          const response: any = await api.post('trap-visit/', trapSubmission)
          let trapId = response?.data?.createdTrapVisitResponse?.id
          // Save to payload
          payload.trapVisitResponse.push(response.data)

          const bulkSubmissions = linkedCatchRawSubmissions.map(
            ({ uid, ...rest }: { uid: string }) => ({
              ...rest,
              trapVisitId: trapId,
            })
          )

          // send as one request of array of catch raw records
          const catchResponse = await api.post('catch-raw/', bulkSubmissions)

          // handle response
          if (catchResponse?.data) {
            payload.catchRawResponse = [
              ...payload.catchRawResponse,
              ...catchResponse.data,
            ]
          }
        } catch (error: any) {
          console.log(
            '🚀 ~ file: trapVisitFormPostBundler.ts ~ submission error:',
            error
          )

          const errorMessage = generateErrorMessage(
            error.code || 'Error during catch raw submission (ln 170)'
          )

          showSlideAlert(thunkAPI.dispatch, errorMessage, 'error', 5000)
          const { response } = error
          const errorDetail = response?.data?.detail
          if (!errorDetail?.includes('already exists')) {
            payload.failedTrapVisitSubmissions.push(
              trapVisitSubmissions.find(t => t.trapVisitUid === uuid)
            )
          }
        }
      }
    } catch (err) {
      console.log('error in fetchWithPostParams: BUNDLER', err)
    } finally {
      if (payload.catchRawResponse.length || payload.trapVisitResponse.length) {
        showSlideAlert(
          thunkAPI.dispatch,
          `${payload.trapVisitResponse.length} trap visit and ${payload.catchRawResponse.length} catch raw submissions saved`,
          'success',
          5000
        )
        await fetchWithPostParams(thunkAPI.dispatch, payload)
        const state = thunkAPI.getState() as any
        if (state?.userCredentials?.id) {
          thunkAPI.dispatch(getVisitSetupDefaults(state.userCredentials.id))
        }
      }
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
            delete payload?.createdTrapVisitResponse.id
            delete payload?.stagedForSubmission

            return api
              .put(`trap-visit/${id}`, {
                ...payload,
              })
              .catch((error: any) => {
                console.log(
                  '🚀 ~ file: trapVisitFormPostBundler.ts:223 ~ error:',
                  Object.entries(error)
                )

                const errorMessage = generateErrorMessage(
                  error.code || 'Error during post qc submission (ln 230)'
                )
                showSlideAlert(thunkAPI.dispatch, errorMessage, 'error', 5000)
              })
          }
        )

        const catchPromises = qcCatchRawSubmissions.map(
          (catchSubmission: any) => {
            return Promise.resolve()
              .then(() => {
                console.log('catchSubmission', catchSubmission)
                let id = catchSubmission.createdCatchRawResponse.id
                let payload = {
                  ...catchSubmission,
                  createdCatchRawResponse: {
                    ...catchSubmission.createdCatchRawResponse,
                    id: undefined, // or null
                  },
                  createdGeneticSamplingDataResponse: {
                    ...catchSubmission.createdGeneticSamplingDataResponse,
                    catchRawCreatedAt: undefined, // or null
                  },
                  createdFishConditionResponse: {
                    ...catchSubmission.createdFishConditionResponse,
                    catchRawCreatedAt: undefined, // or null
                  },
                }
                console.log('payload', payload)
                delete payload?.createdCatchRawResponse?.id
                delete payload?.stagedForSubmission

                console.log('hje;l;lop')
                return api.put(`catch-raw/${id}`, payload)
              })
              .catch(error => {
                console.log('error in catchPromises: ', error)
                return Promise.reject(error) // Ensures it can be handled properly in Promise.allSettled
              })
          }
        )

        const trapResults = await Promise.allSettled(trapPromises)
        const catchResults = await Promise.allSettled(catchPromises)
        const trapVisitResponse = []

        for (const result of trapResults as any) {
          if (result.status === 'fulfilled') {
            trapVisitResponse.push(result?.value?.data)
          } else {
            console.log('trap qc submission fail: ', result)
          }
        }

        const catchRawResponse = []

        for (const result of catchResults as any) {
          if (result.status === 'fulfilled') {
            catchRawResponse.push(result?.value?.data)
          } else {
            console.log('catch qc submission fail: ', result)
          }
        }

        showSlideAlert(
          thunkAPI.dispatch,
          `${trapVisitResponse.length} trap visit QC and ${catchRawResponse.length} catch QC submissions saved`,
          'success',
          5000
        )

        return {
          trapVisitResponse,
          catchRawResponse,
        }
      }
    } catch (error) {
      console.log('288 error in postQCSubmissions: ', error)
      showSlideAlert(
        thunkAPI.dispatch,
        'Connection issue during QC submission',
        'error',
        5000
      )
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
      const userPrograms = state.userCredentials.userPrograms

      if (
        state.connectivity.isConnected &&
        state.connectivity.isInternetReachable
      ) {
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
                  catchRaw?.createdCatchRawResponse?.id
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
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(
          '🚀 ~ file: trapVisitFormPostBundler.ts:349 ~ fetchPreviousTrapAndCatch error:',
          Object.entries(error)
        )
        const state = thunkAPI.getState() as RootState
        const connectivityState = state.connectivity
        const errorMessage = generateErrorMessage(
          error.code ||
            'Error fetching previous trap and catch records (ln 367)'
        )
        const connectionError =
          !connectivityState.isConnected &&
          error.message.includes('network connection')
        {
          connectionError &&
            showSlideAlert(
              thunkAPI.dispatch,
              errorMessage,
              connectionError ? 'warning' : 'error',
              5000
            )
        }
        thunkAPI.rejectWithValue({
          previousTrapVisits: [],
          previousCatchRaw: [],
        })
      }
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
      if (!fetchPayload) {
        return
      }
      const { previousTrapVisits, previousCatchRaw } = fetchPayload || {}

      const fetchedTrapUids = previousTrapVisits.map(
        (trap: any) => trap.createdTrapVisitResponse.trapVisitUid
      )
      const postedTrapUids = trapVisitResponse.map(
        (trap: any) => trap.createdTrapVisitResponse.trapVisitUid
      )

      const fetchedCatchRawIds = previousCatchRaw.map(
        (catchRaw: any) => catchRaw?.createdCatchRawResponse?.id
      )

      const postedCatchRawIds = catchRawResponse.map(
        (catchRaw: any) => catchRaw?.createdCatchRawResponse?.id
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
            response?.createdCatchRawResponse?.id
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
    console.log(
      '🚀 ~ file: trapVisitFormPostBundler.ts:430 ~ fetchWithPostParams ~ error:',
      error
    )
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
                envMeasure.measureValueNumeric =
                  submission['Temperature'].y || null
                envMeasure.measureValueText =
                  submission['Temperature'].y || null
              }

              if (envMeasure.measureName === 'water turbidity') {
                envMeasure.measureValueNumeric =
                  submission['Turbidity'].y || null
                envMeasure.measureValueText = submission['Turbidity'].y || null
              }
            }
          )
        }

        if (trapVisitToQC?.createdTrapVisitResponse) {
          //trap visit record data
          console.log(`submission['Counter'].y`, submission['Counter'].y)
          trapVisitToQC.createdTrapVisitResponse.totalRevolutions =
            submission['Counter'].y || null
          trapVisitToQC.createdTrapVisitResponse.debrisVolumeGal =
            submission['Debris'].y || null
          trapVisitToQC.createdTrapVisitResponse.rpmAtStart =
            submission['RPM At Start'].y || null
          trapVisitToQC.createdTrapVisitResponse.rpmAtEnd =
            submission['RPM At End'].y || null
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
              envMeasure.measureValueNumeric =
                submission['Temperature'].y || null
              envMeasure.measureValueText = submission['Temperature'].y || null
            }

            if (envMeasure.measureName === 'water turbidity') {
              envMeasure.measureValueNumeric = submission['Turbidity'].y || null
              envMeasure.measureValueText = submission['Turbidity'].y || null
            }
          }
        )

        //trap visit record data
        qcTrapVisit.createdTrapVisitResponse.totalRevolutions =
          submission['Counter'].y || null
        qcTrapVisit.createdTrapVisitResponse.debrisVolumeGal =
          submission['Debris'].y || null
        qcTrapVisit.createdTrapVisitResponse.rpmAtStart =
          submission['RPM At Start'].y || null
        qcTrapVisit.createdTrapVisitResponse.rpmAtEnd =
          submission['RPM At End'].y || null

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
          switch (submission?.fieldName) {
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
              console.log('mark type: ', submission.value)
              // if (catchRawToQC.createdExistingMarksResponse) {
              //   catchRawToQC.createdExistingMarksResponse[0].markTypeId =
              //     submission.value
              // } else {
              //   catchRawToQC.createdExistingMarksResponse = [
              //     {
              //       markTypeId: submission.value,
              //       markColorId: null,
              //       markPositionId: null,
              //     },
              //   ]
              // }
              break
            case 'Mark Color':
              // if (catchRawToQC.createdExistingMarksResponse) {
              //   catchRawToQC.createdExistingMarksResponse[0].markColorId =
              //     submission.value
              // } else {
              //   catchRawToQC.createdExistingMarksResponse = [
              //     {
              //       markColorId: submission.value,
              //       markTypeId: null,
              //       markPositionId: null,
              //     },
              //   ]
              // }
              break
            case 'Mark Position':
              // if (catchRawToQC.createdExistingMarksResponse) {
              //   catchRawToQC.createdExistingMarksResponse[0].markPositionId =
              //     submission.value
              // } else {
              //   catchRawToQC.createdExistingMarksResponse = [
              //     {
              //       markPositionId: submission.value,
              //       markTypeId: null,
              //       markColorId: null,
              //     },
              //   ]
              // }
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

          if (submission?.isFullObject) {
            catchRawToQC.createdCatchRawResponse = {
              ...catchRawToQC.createdCatchRawResponse,
              ...submission.value,
            }
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

        qcCatchRaw.createdCatchRawResponse.qcCompleted = true
        qcCatchRaw.createdCatchRawResponse.qcTime = new Date().toISOString()
        qcCatchRaw.createdCatchRawResponse.qcCompletedBy = userId

        for (const submission of submissions) {
          switch (submission?.fieldName) {
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
              // if (qcCatchRaw.createdExistingMarksResponse) {
              //   qcCatchRaw.createdExistingMarksResponse[0].markTypeId =
              //     submission.value
              // } else {
              //   qcCatchRaw.createdExistingMarksResponse = [
              //     {
              //       markTypeId: submission.value,
              //       markColorId: null,
              //       markPositionId: null,
              //     },
              //   ]
              // }
              break
            case 'Mark Color':
              // if (qcCatchRaw.createdExistingMarksResponse) {
              //   qcCatchRaw.createdExistingMarksResponse[0].markColorId =
              //     submission.value
              // } else {
              //   qcCatchRaw.createdExistingMarksResponse = [
              //     {
              //       markColorId: submission.value,
              //       markTypeId: null,
              //       markPositionId: null,
              //     },
              //   ]
              // }
              break
            case 'Mark Position':
              // if (qcCatchRaw.createdExistingMarksResponse) {
              //   qcCatchRaw.createdExistingMarksResponse[0].markPositionId =
              //     submission.value
              // } else {
              //   qcCatchRaw.createdExistingMarksResponse = [
              //     {
              //       markPositionId: submission.value,
              //       markTypeId: null,
              //       markColorId: null,
              //     },
              //   ]
              // }
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
          if (submission?.isFullObject) {
            qcCatchRaw.createdCatchRawResponse = {
              ...qcCatchRaw.createdCatchRawResponse,
              ...submission.value,
            }
          }
        }

        state.qcCatchRawSubmissions = [
          ...state.qcCatchRawSubmissions.slice(0, qcCatchRawIdx),
          ...state.qcCatchRawSubmissions.slice(qcCatchRawIdx + 1),
        ]
        state.qcCatchRawSubmissions.push(qcCatchRaw)
      }
    },
    catchRawQCDeletion: (state, action) => {
      let { catchRawId } = action.payload

      state.qcCatchRawDeletions.push(catchRawId)
    },
    resetTrapVisitFormPostBundler: () => {
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
        const { previousTrapVisits, previousCatchRaw } = action.payload || {}
        state.previousTrapVisitSubmissions = previousTrapVisits || []
        state.previousCatchRawSubmissions = previousCatchRaw || []
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
  resetTrapVisitFormPostBundler,
  clearPendingTrapVisitSubs,
  clearPendingCatchRawSubs,
  addMissingFetchedRecords,
  catchRawQCDeletion,
  // addMissingFetchedTrapVisitSubs,
  // addMissingFetchedCatchRawSubs,
} = trapVisitPostBundler.actions

export default trapVisitPostBundler.reducer
