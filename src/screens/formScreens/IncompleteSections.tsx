import React, { useEffect, useRef, useState } from 'react'
import { Box, Divider, Heading, ScrollView, View, VStack } from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import navigationSlice, {
  checkIfFormIsComplete,
  markStepCompleted,
  numOfFormSteps,
  resetNavigationSlice,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import NavButtons from '../../components/formContainer/NavButtons'
import IncompleteSectionButton from '../../components/form/IncompleteSectionButton'
import {
  postTrapVisitFormSubmissions,
  saveCatchRawSubmissions,
  saveTrapVisitSubmission,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { resetGeneticSamplesSlice } from '../../redux/reducers/formSlices/addGeneticSamplesSlice'
import { resetMarksOrTagsSlice } from '../../redux/reducers/formSlices/addMarksOrTagsSlice'
import {
  IndividualFishValuesI,
  resetFishInputSlice,
} from '../../redux/reducers/formSlices/fishInputSlice'
import { resetFishProcessingSlice } from '../../redux/reducers/formSlices/fishProcessingSlice'
import { resetTrapPostProcessingSlice } from '../../redux/reducers/formSlices/trapPostProcessingSlice'
import { resetTrapOperationsSlice } from '../../redux/reducers/formSlices/trapOperationsSlice'
import { resetVisitSetupSlice } from '../../redux/reducers/formSlices/visitSetupSlice'
import { resetPaperEntrySlice } from '../../redux/reducers/formSlices/paperEntrySlice'
import { resetTabsSlice } from '../../redux/reducers/formSlices/tabSlice'
import { resetBatchCountSlice } from '../../redux/reducers/formSlices/batchCountSlice'
import { cloneDeep, find, flatten, keyBy, uniq } from 'lodash'
import {
  setIncompleteSectionTouched,
  TabStateI,
} from '../../redux/reducers/formSlices/tabSlice'
import { saveTrapVisitInformation } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { DeviceEventEmitter } from 'react-native'
import {
  combinePlusCounts,
  navigateHelper,
  returnDefinitionArray,
  getCrewValue,
  returnNullableTableId,
  calcAvgValue,
  mergePreserveNonNull,
  showFishInputButton,
  findTrapLocationIds,
  getDBValue,
} from '../../utils/utils'
import { StackActions } from '@react-navigation/native'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import ReviewValuesModal from '../../components/form/ReviewValuesModal'
import ReviewValuesButton from '../../components/form/ReviewValuesButton'
import CustomSelect from '@/src/components/Shared/CustomSelect'

const mapStateToProps = (state: RootState) => {
  return {
    navigationState: state.navigation,
    visitSetupState: state.visitSetup,
    visitSetupDefaultState: state.visitSetupDefaults,
    fishProcessingState: state.fishProcessing,
    trapPostProcessingState: state.trapPostProcessing,
    trapOperationsState: state.trapOperations,
    dropdownsState: state.dropdowns,
    connectivityState: state.connectivity,
    fishInputState: state.fishInput,
    tabState: state.tabSlice,
    addGeneticSamplesState: state.addGeneticSamples,
    appliedMarksState: state.addMarksOrTags,
    userCredentialsStore: state.userCredentials,
  }
}

const IncompleteSections = ({
  navigation,
  navigationState,
  visitSetupState,
  visitSetupDefaultState,
  fishProcessingState,
  trapPostProcessingState,
  trapOperationsState,
  dropdownsState,
  connectivityState,
  fishInputState,
  tabState,
  addGeneticSamplesState,
  appliedMarksState,
  userCredentialsStore,
}: {
  navigation: any
  navigationState: any
  visitSetupState: any
  visitSetupDefaultState: any
  fishProcessingState: any
  trapPostProcessingState: any
  trapOperationsState: any
  dropdownsState: any
  connectivityState: any
  fishInputState: any
  tabState: TabStateI
  addGeneticSamplesState: any
  appliedMarksState: any
  userCredentialsStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const stepsArray = Object.values(navigationState.steps).slice(
    0,
    numOfFormSteps - 1
  ) as Array<any>
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewValuesModalIsOpen, setReviewValuesModalIsOpen] = useState(
    false as boolean
  )
  const hasSubmittedRef = useRef(false)
  const [
    conditionalIncompleteSectionFields,
    setConditionalIncompleteSectionFields,
  ] = useState({} as any)
  const [
    conditionalIncompleteSectionValues,
    setConditionalIncompleteSectionValues,
  ] = useState({} as any)
  const [isValid, setIsValid] = useState(false)
  const tabIds = Object.keys(tabState?.tabs)

  useEffect(() => {
    dispatch(setIncompleteSectionTouched(true))

    // Sync navigation step completion from per-tab slice completed flags.
    // This handles the case where a user jumps directly to this screen without
    // visiting each section individually (nav slice never got markStepCompleted).
    const allTabIds = Object.keys(tabState.tabs)
    if (allTabIds.length > 0) {
      const allComplete = (sliceState: any) =>
        allTabIds.every(id => sliceState[id]?.completed)

      if (allComplete(visitSetupState))
        dispatch(markStepCompleted({ propName: 'visitSetup' }))
      if (allComplete(trapOperationsState))
        dispatch(markStepCompleted({ propName: 'trapOperations' }))
      if (allComplete(fishProcessingState))
        dispatch(markStepCompleted({ propName: 'fishProcessing' }))
      if (allComplete(fishInputState))
        dispatch(markStepCompleted({ propName: 'fishInput' }))
      if (allComplete(trapPostProcessingState))
        dispatch(markStepCompleted({ propName: 'trapPostProcessing' }))
    }

    dispatch(checkIfFormIsComplete())
  }, [])

  useEffect(() => {
    // if no conditional fields, then section is valid
    if (!Object.keys(conditionalIncompleteSectionValues).length) {
      setIsValid(true)
    } else if (Object.keys(conditionalIncompleteSectionValues).length > 0) {
      const isValid = Object.values(conditionalIncompleteSectionValues).every(
        value => value !== undefined && value !== null && value !== ''
      )
      setIsValid(isValid)
    }
  }, [conditionalIncompleteSectionFields, conditionalIncompleteSectionValues])

  const emitSubmission = () => {
    if (isSubmitting) return // If already submitting, return early

    setIsSubmitting(true) // Set submitting state to true
    const callback = () => {
      navigateHelper(
        'Start Mark Recapture',
        navigationState,
        navigation,
        dispatch,
        updateActiveStep
      )
      setIsSubmitting(false) // Reset submitting state after navigation
    }

    navigation.dispatch(StackActions.replace('Loading...'))

    setTimeout(() => {
      DeviceEventEmitter.emit('event.load', {
        process: () => handleSubmit(),
        callback,
      })
    }, 1000)
  }

  const handleSubmit = () => {
    if (hasSubmittedRef.current) return // If already submitted, return early
    try {
      saveTrapVisits()
      saveCatchRawSubmission()
      resetAllFormSlices()

      hasSubmittedRef.current = true // Set submitted state to true

      if (
        connectivityState.isConnected &&
        connectivityState.isInternetReachable
      ) {
        dispatch(postTrapVisitFormSubmissions())
      } else {
        console.log('Connection issue during submission')
        showSlideAlert(
          dispatch,
          'Connection issue during trap visit submission. Application will save data locally and attempt to submit later when connected.',
          'error',
          5000
        )
      }
    } catch (error) {
      console.log('submit error: ', error)
    } finally {
      setIsSubmitting(false) // Reset submitting state after handling submission
    }
  }

  const resetAllFormSlices = () => {
    dispatch(resetNavigationSlice())
    dispatch(resetGeneticSamplesSlice())
    dispatch(resetMarksOrTagsSlice())
    dispatch(resetFishInputSlice())
    dispatch(resetBatchCountSlice())
    dispatch(resetFishProcessingSlice())
    dispatch(resetTrapPostProcessingSlice())
    dispatch(resetTrapOperationsSlice())
    dispatch(resetVisitSetupSlice())
    dispatch(resetPaperEntrySlice())
    dispatch(resetTabsSlice())
  }

  useEffect(() => {
    const selectedProgramId = tabState?.activeTabId
      ? visitSetupState?.[tabState.activeTabId]?.values?.programId
      : null

    if (selectedProgramId) {
      const currentProgramInfo = find(
        visitSetupDefaultState.programs,
        (program: any) => program.id === selectedProgramId
      )

      if (currentProgramInfo?.programFormFields?.length) {
        const incompleteSectionFields =
          currentProgramInfo?.programFormFields.filter((formField: any) => {
            return formField?.formSection === 'Incomplete Sections'
          })

        const sectionFieldsObj = keyBy(incompleteSectionFields, 'fieldName')

        setConditionalIncompleteSectionFields(sectionFieldsObj)

        setConditionalIncompleteSectionValues(
          Object.keys(sectionFieldsObj).reduce<{ [key: string]: any }>(
            (obj, key) => {
              obj[key] = undefined
              return obj
            },
            {}
          )
        )
      } else {
        setConditionalIncompleteSectionFields({})
        setConditionalIncompleteSectionValues({})
      }
    }
  }, [visitSetupDefaultState.programs, tabState.activeTabId])

  const findCrewIdsFromSelectedCrewNames = (
    selectedCrewNames: Array<string>
  ) => {
    // ['james', 'steve']
    const allCrewObjects = flatten(visitSetupDefaultState.crewMembers) // [{..., name: 'james', programId: 1},]

    const selectedCrewNamesMap: any = selectedCrewNames.reduce(
      (acc, name: string) => ({
        ...acc,
        [name]: true,
      }),
      {}
    )

    const filteredCrewIds = uniq(
      allCrewObjects
        .filter(
          (obj: any) => selectedCrewNamesMap[`${obj.firstName} ${obj.lastName}`]
        )
        .map((obj: any) => Number(obj.personnelId))
    )
    //if the array contains a single string, return the string in an array
    return filteredCrewIds
  }

  // const getDBValue = (value: any, dropdownName: string) => {
  //   const dropdownValues = dropdownsState.values[dropdownName]

  //   const id = find(dropdownValues, { code: value })?.id || null
  //   return id
  // }

  const formatTrapVisitEnvironmentalValues = (
    values: any,
    programId: number
  ) => {
    const selectedProgramObj = find(
      visitSetupDefaultState.programs,
      (program: any) => program.id === programId
    )

    const programFormFields = selectedProgramObj.programFormFields

    const environmentalFieldsToIgnore = [
      'flowMeasure',
      'waterTemperature',
      'waterTurbidity',
    ]

    const def = programFormFields
      .filter(
        (obj: any) =>
          obj.isEnvironmentalField &&
          !environmentalFieldsToIgnore.includes(obj.fieldName)
      )
      .map((obj: any) => obj.fieldName)

    const formFieldsLookup = keyBy(programFormFields, 'fieldName')

    let baseEnvValues = [
      {
        measureName: 'flow measure',
        measureValueNumeric: values.flowMeasure
          ? Number(values.flowMeasure)
          : undefined,
        measureValueText: values.flowMeasure
          ? values.flowMeasure?.toString()
          : undefined,
        measureUnit: 5,
      },
      {
        measureName: 'water temperature',
        measureValueNumeric: values.waterTemperature
          ? Number(values.waterTemperature)
          : undefined,
        measureValueText: values.waterTemperature
          ? values.waterTemperature?.toString()
          : undefined,
        measureUnit: values.waterTemperatureUnit === '°F' ? 1 : 2,
      },
      {
        measureName: 'water turbidity',
        measureValueNumeric: values.waterTurbidityIsPresent
          ? values.waterTurbidity
          : values?.recordTurbidityInPostProcessing
            ? null
            : undefined,
        measureValueText: values.waterTurbidityIsPresent
          ? values.waterTurbidity?.toString()
          : values?.recordTurbidityInPostProcessing
            ? ''
            : undefined,
        measureUnit: 25,
      },
    ] as Array<any>

    def.forEach((field: string) => {
      if (values[field]) {
        if (formFieldsLookup[field].fieldType === 'dropdown') {
          baseEnvValues.push({
            measureName: formFieldsLookup[field].fieldName,
            measureValueNumeric: null,
            measureValueText: values[field]?.toString(),
            measureUnit: null,
          })
        } else {
          baseEnvValues.push({
            measureName: formFieldsLookup[field].fieldName,
            measureValueNumeric: Number(values[field]),
            measureValueText: values[field]?.toString(),
            measureUnit: formFieldsLookup[field].unitId || null,
          })
        }
      }
    })

    let meanFNU = null
    if (values.turbidity1 && values.turbidity2 && values.turbidity3) {
      meanFNU = calcAvgValue([
        values.turbidity1,
        values.turbidity2,
        values.turbidity3,
      ])
      baseEnvValues.push({
        measureName: 'meanFNU',
        measureValueNumeric: meanFNU,
        measureValueText: meanFNU?.toString(),
        measureUnit: 38, //fnu
      })
    }

    if (def.includes('riverDepth')) {
      baseEnvValues = baseEnvValues.concat(
        {
          measureName: 'riverLeft',
          measureValueNumeric: values.riverLeft,
          measureValueText: values.riverLeft?.toString(),
          measureUnit: 9,
        },
        {
          measureName: 'riverCenter',
          measureValueNumeric: values.riverCenter,
          measureValueText: values.riverCenter?.toString(),
          measureUnit: 9,
        },
        {
          measureName: 'riverRight',
          measureValueNumeric: values.riverRight,
          measureValueText: values.riverRight?.toString(),
          measureUnit: 9,
        }
      )
    }

    return baseEnvValues
  }

  const saveTrapVisits = () => {
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

    const tabIds = Object.keys(tabState.tabs)
    tabIds.forEach(id => {
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

      // // if PULL day, set trap visit time end to now
      // if (trapOperationsState?.[id]?.values?.gearStatus === 'P') {
      //   trapVisitTimeEnd = new Date()
      //   trapVisitTimeStart = new Date()
      // }

      const combinedOpsandPostProcessing = {
        ...trapOperationsState[id].values,
        ...trapPostProcessingState[id].values,
      }

      // if trapVisitTime , which is time for checking, set both to the same value
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

      const trapVisitSubmission = {
        trapVisitUid: id,
        // crew: selectedCrewIds,
        crew: getCrewValue({
          visitSetupValues: visitSetupState[id].values,
          visitSetupDefaultState,
          fieldCheckValue: conditionalIncompleteSectionValues['fieldCheck'],
        }),
        programId,
        visitTypeId: null,
        trapLocationId: visitSetupState[id].values.trapLocationId,
        isPaperEntry: visitSetupState[id].isPaperEntry,
        trapVisitTimeStart,
        trapVisitTimeEnd,
        fishProcessed: returnNullableTableId(
          fishProcessedValues.indexOf(
            trapOperationsState[id].values.gearStatus === 'S'
              ? 'no catch data, setting trap'
              : fishProcessingState[id].values.fishProcessedResult
          )
        ),
        whyFishNotProcessed: returnNullableTableId(
          whyFishNotProcessedValues.indexOf(
            trapOperationsState[id].values.gearStatus === 'S'
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
          trapFunctioningValues.indexOf(
            trapOperationsState[id].values.trapStatus
          )
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
        totalRevolutions: trapPostProcessingState[id].values.totalRevolutions
          ? parseFloat(trapPostProcessingState[id].values.totalRevolutions)
          : null,
        rpmAtStart: calcAvgValue([startRpm1, startRpm2, startRpm3]),
        rpmAtEnd: calcAvgValue([endRpm1, endRpm2, endRpm3]),
        trapVisitEnvironmental: formatTrapVisitEnvironmentalValues(
          mergePreserveNonNull(opsValues, postValues, {
            waterTurbidityIsPresent,
          }),
          programId
        ),
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

      dispatch(saveTrapVisitSubmission(trapVisitSubmission))

      dispatch(
        saveTrapVisitInformation({
          crew: visitSetupState[tabIds[0]].values.crew,
          programId: visitSetupState[tabIds[0]].values.programId,
          trapLocationIds: findTrapLocationIds(visitSetupState),
        })
      )
    })
  }

  const saveCatchRawSubmission = () => {
    const currentDateTime = new Date()
    const lifeStageValues = returnDefinitionArray(
      dropdownsState.values.lifeStage
    )
    const plusCountMethodValues = returnDefinitionArray(
      dropdownsState.values.plusCountMethodology
    )
    const runValues = returnDefinitionArray(dropdownsState.values.run)
    const runCodeMethodValues = returnDefinitionArray(
      dropdownsState.values.runCodeMethods
    )
    const markTypeValues = returnDefinitionArray(dropdownsState.values.markType)
    const markColorValues = returnDefinitionArray(
      dropdownsState.values.markColor
    )
    const bodyPartValues = returnDefinitionArray(dropdownsState.values.bodyPart)
    const fishConditionValues = returnDefinitionArray(
      dropdownsState.values.fishCondition
    )
    const returnTaxonCode = (fishSubmissionData: IndividualFishValuesI) =>
      dropdownsState.values.taxon.find((taxonValue: any) =>
        taxonValue.commonname
          .toLowerCase()
          .includes(fishSubmissionData.species.toLowerCase())
      )?.code ?? null

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
              obj.crewMember = findCrewIdsFromSelectedCrewNames([
                obj.crewMember,
              ])[0]
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
            // markType: 1, // Check w/ Erin
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
            isRandom: null, // Check w/ Erin
            comments: fishValue.comments != null ? fishValue?.comments : null,
            createdBy: userCredentialsStore.id,
            qcCompleted: null,
            qcCompletedBy: null,
            qcTime: null,
            qcComments: null,
            existingMarks: fishValue.existingMarks.map((markObj: any) => {
              //need to pick between body part and mark position, we go back and forth and its causing problems
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

    if (catchRawSubmissions.length) {
      const catchRawPlusCountCombined = combinePlusCounts(catchRawSubmissions)
      dispatch(saveCatchRawSubmissions(catchRawPlusCountCombined))
    }
  }

  const handleOpenReviewValuesModal = () => {
    setReviewValuesModalIsOpen(true)
  }

  const handleCloseReviewValuesModal = () => {
    setReviewValuesModalIsOpen(false)
  }

  // console.log('visitSetupState', visitSetupState)
  // console.log('tabState', tabState)
  const renderFishInputButton = showFishInputButton({
    fishProcessing: fishProcessingState,
    tabIds,
  })

  return (
    <>
      <ScrollView
        height={'800px'}
        flex={1}
        bg='#fff'
        // justifyContent='center'
        // alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={8} p='15%' height={'100%'} flex={1}>
          <Heading textAlign='center' padding={0}>
            {'Please fill out any incomplete sections  \n before moving on:'}
          </Heading>
          {stepsArray.map((step: any, idx: number) => {
            if (
              (step.name === 'Fish Input' && renderFishInputButton) ||
              step.name !== 'Fish Input'
            )
              return (
                <IncompleteSectionButton
                  name={step.name}
                  completed={step.completed}
                  navigation={navigation}
                  key={idx}
                  step={idx + 1}
                  tabState={tabState}
                />
              )
          })}
          <Divider />
          <ReviewValuesButton
            handleOpenReviewValuesModal={handleOpenReviewValuesModal}
          />
          {conditionalIncompleteSectionFields['fieldCheck'] && (
            <Box
              key={'index'} // Always add a key when mapping
              // flexBasis='100%' // Ensures 3 items per row (adjust for spacing)
              // minWidth='100%' // Prevents shrinking too much
              // maxWidth='100%' // Prevents growing beyond this size>
              // flexGrow={1}
              // mr={8} // Removes right margin from every 3rd item
              mb={100} // Adds bottom margin to each item
            >
              <CustomSelect
                camelName={'fieldCheck'}
                label={
                  conditionalIncompleteSectionFields['fieldCheck'].displayName
                }
                selectedValue={conditionalIncompleteSectionValues['fieldCheck']}
                placeholder='Select Field Check'
                onValueChange={(itemValue: string) => {
                  setConditionalIncompleteSectionValues((prevFields: any) => {
                    const updatedFields = cloneDeep(prevFields)
                    updatedFields['fieldCheck'] = itemValue
                    return updatedFields
                  }) // Update the state with the selected value
                }}
                selectOptions={
                  tabState?.activeTabId
                    ? visitSetupState?.[
                        tabState.activeTabId
                      ]?.values?.crew?.map((crewMember: any) => ({
                        label: crewMember,
                        value: crewMember,
                      }))
                    : []
                }
                // validationSchema={validationSchema}
                // onOpenCallback={onOpenCallback}
              />
            </Box>
          )}
        </VStack>
      </ScrollView>
      {reviewValuesModalIsOpen && (
        <ReviewValuesModal
          handleCloseReviewValuesModal={handleCloseReviewValuesModal}
          isOpen={reviewValuesModalIsOpen}
          formValues={{
            visitSetupState,
            trapOperationsState,
            fishProcessingState,
            fishInputState,
            trapPostProcessingState,
          }}
          tabState={tabState}
          visitSetupDefaultState={visitSetupDefaultState}
          fieldCheck={conditionalIncompleteSectionValues['fieldCheck']}
        />
      )}
      <NavButtons
        navigation={navigation}
        handleSubmit={emitSubmission}
        shouldProceedToLoadingScreen={true}
        isValid={isValid}
      />
    </>
  )
}

export default connect(mapStateToProps)(IncompleteSections)
