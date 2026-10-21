import { cloneDeep, find, flatten, uniq } from 'lodash'
import {
  combinePlusCounts,
  getCrewValue,
  returnNullableTableId,
  calcAvgValue,
  mergePreserveNonNull,
  returnDefinitionArray,
  getDBValue,
} from '../utils'
import { buildTrapVisitEnvironmentalForProgram } from './trapVisitEnvironmental'
import { resolveSubmissionTrapLocationId } from './deriveTrapLocationId'

/**
 * Pure builders for the trap-visit and catch-raw submission payloads -
 * extracted verbatim from IncompleteSections.tsx's saveTrapVisits()/
 * saveCatchRawSubmission() closures so the same construction logic can be
 * called from both the real submit path (IncompleteSections.tsx) and the
 * export-to-JSON path (ReviewValuesModal.tsx) without the two drifting apart.
 * No redux dispatch happens here - callers own that.
 *
 * Leaf module on purpose - no React/navigation imports, plain-node testable.
 */

/** Builds the exact `TrapVisitSubmissionI`-shaped object for one tab. */
export const buildTrapVisitSubmission = ({
  tabId,
  visitSetupState,
  visitSetupDefaultState,
  trapOperationsState,
  trapPostProcessingState,
  fishProcessingState,
  dropdownsState,
  userCredentialsStore,
  fieldCheckValue,
}: {
  tabId: string
  visitSetupState: any
  visitSetupDefaultState: any
  trapOperationsState: any
  trapPostProcessingState: any
  fishProcessingState: any
  dropdownsState: any
  userCredentialsStore: any
  fieldCheckValue: any
}) => {
  const id = tabId

  const trapFunctioningValues = returnDefinitionArray(
    dropdownsState.values.trapFunctionality
  )
  const whyTrapNotFunctioningValues = returnDefinitionArray(
    dropdownsState.values.whyTrapNotFunctioning
  )
  const fishProcessedValues = returnDefinitionArray(
    dropdownsState.values.fishProcessed
  )
  const whyFishNotProcessedValues = returnDefinitionArray(
    dropdownsState.values.whyFishNotProcessed
  )
  const trapStatusAtEndValues = returnDefinitionArray(
    dropdownsState.values.trapStatusAtEnd
  )

  const opsValues = trapOperationsState[id]?.values ?? {}
  const postValues = trapPostProcessingState[id]?.values ?? {}

  const waterTurbidityIsPresent =
    opsValues.waterTurbidity !== '' && opsValues.waterTurbidity !== null
  const { rpm1: startRpm1, rpm2: startRpm2, rpm3: startRpm3 } = opsValues
  const { rpm1: endRpm1, rpm2: endRpm2, rpm3: endRpm3 } = postValues

  const programId = visitSetupState[id].values.programId

  let trapVisitTimeEnd =
    trapOperationsState?.[id]?.values?.trapVisitStopTime || null

  let trapVisitTimeStart =
    trapPostProcessingState?.[id]?.values?.trapVisitStartTime || null

  const combinedOpsandPostProcessing = {
    ...trapOperationsState[id].values,
    ...trapPostProcessingState[id].values,
  }

  // if trapVisitTime, which is time for checking, set both to the same value
  if (combinedOpsandPostProcessing?.trapVisitTime) {
    trapVisitTimeEnd = combinedOpsandPostProcessing?.trapVisitTime
    trapVisitTimeStart = combinedOpsandPostProcessing?.trapVisitTime
  } else if (combinedOpsandPostProcessing?.sampleTime) {
    // if sample time, there is start (day before when trap was set) and sample time
    trapVisitTimeEnd = combinedOpsandPostProcessing?.startTime
    trapVisitTimeStart = combinedOpsandPostProcessing?.sampleTime
  } else if (combinedOpsandPostProcessing?.arrivalTime) {
    trapVisitTimeEnd = combinedOpsandPostProcessing?.arrivalTime
    trapVisitTimeStart = combinedOpsandPostProcessing?.arrivalTime
  }

  return {
    trapVisitUid: id,
    crew: getCrewValue({
      visitSetupValues: visitSetupState[id].values,
      visitSetupDefaultState,
      fieldCheckValue,
    }),
    programId,
    visitTypeId: null,
    trapLocationId: resolveSubmissionTrapLocationId({
      storedTrapLocationId: visitSetupState[id].values.trapLocationId,
      trapName: visitSetupState[id].values.trapName,
      trapSite: visitSetupState[id].values.trapSite,
      trapLocations: visitSetupDefaultState?.trapLocations,
    }),
    isPaperEntry: visitSetupState[id].isPaperEntry,
    trapVisitTimeStart,
    trapVisitTimeEnd,
    fishProcessed: returnNullableTableId(
      fishProcessedValues.indexOf(
        trapOperationsState[id].values.gearStatus === 'S'
          ? 'no catch data, setting trap'
          : combinedOpsandPostProcessing.conditionCode === '4'
            ? 'not recorded'
            : fishProcessingState[id].values.fishProcessedResult
      )
    ),
    whyFishNotProcessed: returnNullableTableId(
      whyFishNotProcessedValues.indexOf(
        trapOperationsState[id].values.gearStatus === 'S' ||
          combinedOpsandPostProcessing.conditionCode === '4'
          ? 'not recorded'
          : fishProcessingState?.[id]?.values?.reasonForNotProcessing
      )
    ),
    sampleGearId:
      find(
        visitSetupDefaultState?.trapLocations,
        (trapLocation: any) =>
          trapLocation.id === visitSetupState[id].values.trapLocationId
      )?.equipmentId || null,
    coneDepth: trapOperationsState[id].values.coneDepth
      ? parseFloat(trapOperationsState[id].values.coneDepth)
      : null,
    trapInThalweg:
      typeof trapOperationsState?.[id]?.values?.trapInThalweg === 'boolean'
        ? trapOperationsState?.[id]?.values?.trapInThalweg
        : null,
    trapFunctioning: returnNullableTableId(
      trapFunctioningValues.indexOf(trapOperationsState[id].values.trapStatus)
    ),
    whyTrapNotFunctioning: returnNullableTableId(
      whyTrapNotFunctioningValues.indexOf(
        trapOperationsState[id].values.reasonNotFunc
      )
    ),
    trapStatusAtEnd: returnNullableTableId(
      trapStatusAtEndValues.indexOf(
        `${trapPostProcessingState[id].values.endingTrapStatus}`.toLowerCase()
      )
    ),
    totalRevolutions:
      (trapPostProcessingState[id].values.totalRevolutions ??
      trapOperationsState[id].values.totalRevolutions)
        ? parseFloat(
            trapPostProcessingState[id].values.totalRevolutions ??
              trapOperationsState[id].values.totalRevolutions
          )
        : null,
    rpmAtStart: calcAvgValue([startRpm1, startRpm2, startRpm3]),
    rpmAtEnd: calcAvgValue([endRpm1, endRpm2, endRpm3]),
    trapVisitEnvironmental: buildTrapVisitEnvironmentalForProgram({
      values: mergePreserveNonNull(opsValues, postValues, {
        waterTurbidityIsPresent,
      }),
      // Legacy rows from Trap Operations only, matching the other paths.
      baseValues: mergePreserveNonNull(opsValues, {
        waterTurbidityIsPresent,
      }),
      programId,
      programs: visitSetupDefaultState.programs,
    }),
    trapCoordinates: {
      xCoord: trapPostProcessingState[id].values.trapLatitude,
      yCoord: trapPostProcessingState[id].values.trapLongitude,
      datum: null,
      projection: null,
    },
    inHalfConeConfiguration:
      trapOperationsState[id].values.coneSetting === 'half' ? true : false,
    debrisVolumeGal: trapPostProcessingState[id].values.debrisVolume
      ? parseFloat(trapPostProcessingState[id].values.debrisVolume)
      : null,
    qcCompleted: null,
    qcCompletedAt: null,
    comments: trapPostProcessingState[id].values.comments
      ? trapPostProcessingState[id].values.comments
      : null,
    createdBy: userCredentialsStore.id,
    // new form fields
    revCounter: combinedOpsandPostProcessing.revCounter || null,
    ysiNum: getDBValue(
      combinedOpsandPostProcessing.ysiNum,
      'ysiNum',
      dropdownsState
    ),
    gearStatus: getDBValue(
      combinedOpsandPostProcessing.gearStatus,
      'gearStatus',
      dropdownsState
    ),
    vegetationCode: getDBValue(
      combinedOpsandPostProcessing.vegetationCode,
      'vegetationCode',
      dropdownsState
    ),
    conditionCode: getDBValue(
      combinedOpsandPostProcessing.conditionCode,
      'conditionCode',
      dropdownsState
    ),
    tideCode: getDBValue(
      combinedOpsandPostProcessing.tideCode,
      'tideCode',
      dropdownsState
    ),
    flowDirection: getDBValue(
      combinedOpsandPostProcessing.flowDirection,
      'flowDirection',
      dropdownsState
    ),
    weatherCode: getDBValue(
      combinedOpsandPostProcessing.weatherCode,
      'weatherCode',
      dropdownsState
    ),
    substrate: getDBValue(
      combinedOpsandPostProcessing.substrate,
      'substrate',
      dropdownsState
    ),
    length: trapOperationsState[id].values.length
      ? parseFloat(trapOperationsState[id].values.length)
      : null,
    width: trapOperationsState[id].values.width
      ? parseFloat(trapOperationsState[id].values.width)
      : null,
    depth: trapOperationsState[id].values.depth
      ? parseFloat(trapOperationsState[id].values.depth)
      : null,
    samplingAltered:
      typeof combinedOpsandPostProcessing.samplingAltered === 'boolean'
        ? combinedOpsandPostProcessing.samplingAltered
        : null,
  }
}

const findCrewIdsFromSelectedCrewNames = (
  selectedCrewNames: Array<string>,
  visitSetupDefaultState: any
) => {
  const allCrewObjects = flatten(visitSetupDefaultState.crewMembers)

  const selectedCrewNamesMap: any = selectedCrewNames.reduce(
    (acc, name: string) => ({
      ...acc,
      [name]: true,
    }),
    {}
  )

  return uniq(
    allCrewObjects
      .filter(
        (obj: any) => selectedCrewNamesMap[`${obj.firstName} ${obj.lastName}`]
      )
      .map((obj: any) => Number(obj.personnelId))
  )
}

/**
 * Builds every `CatchRawSubmissionI` across ALL open tabs in one pass (not
 * per-tab) - mirrors the original closure exactly, since `combinePlusCounts`
 * is applied once across the full set before returning. Each record's `uid`
 * is the tabId it belongs to; callers filter by `uid` to get one tab's
 * records (same correlation trapVisitFormPostBundler.ts already uses).
 * Returns `[]` (not dispatched) when there's nothing to submit, matching the
 * original's `if (catchRawSubmissions.length)` guard.
 */
export const buildAllCatchRawSubmissions = ({
  fishInputState,
  visitSetupState,
  visitSetupDefaultState,
  dropdownsState,
  userCredentialsStore,
}: {
  fishInputState: any
  visitSetupState: any
  visitSetupDefaultState: any
  dropdownsState: any
  userCredentialsStore: any
}) => {
  const lifeStageValues = returnDefinitionArray(dropdownsState.values.lifeStage)
  const plusCountMethodValues = returnDefinitionArray(
    dropdownsState.values.plusCountMethodology
  )
  const runValues = returnDefinitionArray(dropdownsState.values.run)
  const runCodeMethodValues = returnDefinitionArray(
    dropdownsState.values.runCodeMethods
  )
  const markTypeValues = returnDefinitionArray(dropdownsState.values.markType)
  const markColorValues = returnDefinitionArray(dropdownsState.values.markColor)
  const bodyPartValues = returnDefinitionArray(dropdownsState.values.bodyPart)
  const fishConditionValues = returnDefinitionArray(
    dropdownsState.values.fishCondition
  )

  const catchRawSubmissions: any[] = []

  // skips the "Unused variable" warning
  let { _persist: _, ...fishInputStateClean } = fishInputState

  Object.keys(fishInputStateClean).forEach(tabId => {
    if (tabId != 'placeholderId') {
      const fishStoreKeys = Object.keys(fishInputState[tabId].fishStore)
      const programId = Object.keys(visitSetupState).includes(tabId)
        ? visitSetupState[tabId].values.programId
        : 1

      fishStoreKeys.forEach(key => {
        const fishValue = fishInputState[tabId].fishStore[key]

        const filterAndPrepareData = (data: Array<any>, hasUid: boolean) => {
          let dataCopy = cloneDeep(data)
          //before I filter the data I need to prepare the appliedMarks Array
          //if the data is NOT from genetic sample:
          if (dataCopy[0]?.finClip === undefined) {
            dataCopy = dataCopy.map((markObj: any) => {
              let markTypeId = markObj.markType
              let markPositionId = markObj.markPosition
              let markColorId = markObj.markColor
              delete markObj.markType
              delete markObj.markPosition
              delete markObj.markColor
              return {
                markTypeId: returnNullableTableId(
                  markTypeValues.indexOf(markTypeId)
                ),
                markColorId: returnNullableTableId(
                  markColorValues.indexOf(markColorId)
                ),
                markPositionId: returnNullableTableId(
                  bodyPartValues.indexOf(markPositionId)
                ),
                ...markObj,
              }
            })
          }

          let filteredData = dataCopy

          if (hasUid) {
            filteredData = dataCopy.filter((obj: any) => {
              return obj.UID === fishValue.UID
            })
          }

          return filteredData.map((obj: any) => {
            obj.crewMember = findCrewIdsFromSelectedCrewNames(
              [obj.crewMember],
              visitSetupDefaultState
            )[0]
            return obj
          })
        }

        const getRunClassMethod = (fishValue: any) => {
          if (fishValue.species === 'Chinook salmon') {
            if (fishValue.captureRunClassMethod) {
              return returnNullableTableId(
                runCodeMethodValues.indexOf(fishValue.captureRunClassMethod)
              )
            }
            return fishValue.run === 'not recorded'
              ? returnNullableTableId(
                  runCodeMethodValues.indexOf('not recorded')
                )
              : returnNullableTableId(
                  runCodeMethodValues.indexOf('expert judgement')
                )
          } else {
            return null
          }
        }
        const getCatchFishConditions = (fishConditionArray: string[]) => {
          if (Array.isArray(fishConditionArray)) {
            return fishConditionArray.map((fishCondition: string) => {
              return returnNullableTableId(
                fishConditionValues.indexOf(fishCondition)
              )
            })
          } else {
            return [
              returnNullableTableId(
                fishConditionValues.indexOf(fishConditionArray)
              ),
            ]
          }
        }

        catchRawSubmissions.push({
          uid: tabId,
          programId,
          trapVisitId: null,
          taxonCode: fishValue.taxonCode,
          captureRunClass: returnNullableTableId(
            runValues.indexOf(fishValue?.run?.toLowerCase() || '')
          ),
          // defaults to "expert judgement" (id: 6) if run was selected from fish input dropdown
          captureRunClassMethod: getRunClassMethod(fishValue),
          // defaults to "none" (id: 1) if not selected
          markedForRelease: fishValue.willBeUsedInRecapture,
          adiposeClipped: fishValue.adiposeClipped ? true : false,
          dead: fishValue.dead ? true : false,
          milting:
            typeof fishValue.milting === 'boolean' ? fishValue.milting : null,
          eggs: typeof fishValue.eggs === 'boolean' ? fishValue.eggs : null,
          fishCondition: fishValue.fishConditions.length
            ? getCatchFishConditions(fishValue.fishConditions)
            : null,
          lifeStage: returnNullableTableId(
            lifeStageValues.indexOf(fishValue?.lifeStage?.toLowerCase() || '')
          ),
          forkLength:
            fishValue.forkLength != null
              ? parseFloat(fishValue?.forkLength as any)
              : null,
          weight:
            fishValue?.weight != null
              ? parseFloat(fishValue?.weight as any)
              : null,
          numFishCaught: fishValue?.numFishCaught,
          plusCount: fishValue?.plusCount ? true : false,
          plusCountMethodology: fishValue?.plusCountMethod
            ? returnNullableTableId(
                plusCountMethodValues.indexOf(fishValue?.plusCountMethod)
              )
            : null,
          isRandom: null,
          comments: fishValue.comments != null ? fishValue?.comments : null,
          createdBy: userCredentialsStore.id,
          qcCompleted: null,
          qcCompletedBy: null,
          qcTime: null,
          qcComments: null,
          existingMarks: fishValue.existingMarks.map((markObj: any) => {
            return {
              releaseId:
                markObj.releaseId !== undefined ? markObj.releaseId : null,
              markTypeId: returnNullableTableId(
                markTypeValues.indexOf(markObj.markType)
              ),
              markColorId: returnNullableTableId(
                markColorValues.indexOf(markObj.markColor)
              ),
              markPositionId: returnNullableTableId(
                bodyPartValues.indexOf(markObj.markPosition)
              ),
            }
          }),
          geneticSamplingData: filterAndPrepareData(
            fishValue?.geneticSamples || [],
            false
          ),
          appliedMarks: filterAndPrepareData(
            fishValue?.appliedMarks || [],
            false
          ),
        })
      })
    }
  })

  return catchRawSubmissions.length
    ? combinePlusCounts(catchRawSubmissions)
    : []
}
