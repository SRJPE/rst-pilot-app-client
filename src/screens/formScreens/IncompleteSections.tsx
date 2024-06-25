import { useEffect, useRef, useState } from 'react'
import { Heading, View, VStack } from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import navigationSlice, {
  checkIfFormIsComplete,
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
import { cloneDeep, flatten, uniq } from 'lodash'
import { uid } from 'uid'
import {
  setIncompleteSectionTouched,
  TabStateI,
} from '../../redux/reducers/formSlices/tabSlice'
import { saveTrapVisitInformation } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { DeviceEventEmitter } from 'react-native'
import { navigateHelper } from '../../utils/utils'

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
    paperEntryState: state.paperEntry,
    tabState: state.tabSlice,
    addGeneticSamplesState: state.addGeneticSamples,
    appliedMarksState: state.addMarksOrTags,
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
  paperEntryState,
  tabState,
  addGeneticSamplesState,
  appliedMarksState,
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
  paperEntryState: any
  tabState: TabStateI
  addGeneticSamplesState: any
  appliedMarksState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const stepsArray = Object.values(navigationState.steps).slice(
    0,
    numOfFormSteps - 1
  ) as Array<any>
  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasSubmittedRef = useRef(false)

  useEffect(() => {
    dispatch(setIncompleteSectionTouched(true))
  }, [])

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

    navigation.push('Loading...')

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
    dispatch(resetFishProcessingSlice())
    dispatch(resetTrapPostProcessingSlice())
    dispatch(resetTrapOperationsSlice())
    dispatch(resetVisitSetupSlice())
    dispatch(resetPaperEntrySlice())
    dispatch(resetTabsSlice())
  }

  const returnDefinitionArray = (dropdownsArray: any[]) => {
    return dropdownsArray.map((dropdownObj: any) => {
      return dropdownObj.definition
    })
  }

  const findTrapLocationIds = () => {
    let container = [] as any
    for (let tabId in visitSetupState) {
      if (tabId === 'placeholderId') continue
      container.push(visitSetupState[tabId].values.trapLocationId)
    }
    return container
  }

  const returnNullableTableId = (value: any) => (value == -1 ? null : value + 1)
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

    const filteredNames = uniq(
      allCrewObjects
        .filter(
          (obj: any) => selectedCrewNamesMap[`${obj.firstName} ${obj.lastName}`]
        )
        .map((obj: any) => obj.personnelId)
    )
    //if the array contains a single string, return the string in an array
    return filteredNames
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
    const calculateRpmAvg = (rpms: (string | null)[]) => {
      const validRpms = rpms.filter(n => n)
      if (!validRpms.length) {
        return null
      }
      const numericRpms = validRpms.map((str: any) => parseInt(str))
      let counter = 0
      numericRpms.forEach((num: number) => {
        counter += num
      })
      return counter / numericRpms.length
    }

    const tabIds = Object.keys(tabState.tabs)
    tabIds.forEach(id => {
      const {
        rpm1: startRpm1,
        rpm2: startRpm2,
        rpm3: startRpm3,
      } = trapOperationsState[id].values
      const {
        rpm1: endRpm1,
        rpm2: endRpm2,
        rpm3: endRpm3,
      } = trapPostProcessingState[id].values
      const selectedCrewNames: string[] = [...visitSetupState[id].values.crew] // ['james', 'steve']

      const selectedCrewIds =
        findCrewIdsFromSelectedCrewNames(selectedCrewNames)
      const trapVisitSubmission = {
        trapVisitUid: id,
        crew: selectedCrewIds,
        programId: visitSetupState[id].values.programId,
        visitTypeId: null,
        trapLocationId: visitSetupState[id].values.trapLocationId,
        isPaperEntry: visitSetupState[id].isPaperEntry,
        trapVisitTimeStart:
          trapPostProcessingState[id].values.trapVisitStartTime,
        trapVisitTimeEnd: trapOperationsState[id].values.trapVisitStopTime,
        fishProcessed: returnNullableTableId(
          fishProcessedValues.indexOf(
            fishProcessingState[id].values.fishProcessedResult
          )
        ),
        whyFishNotProcessed: returnNullableTableId(
          whyFishNotProcessedValues.indexOf(
            fishProcessingState[id].values.reasonForNotProcessing
          )
        ),
        sampleGearId: null,
        coneDepth: trapOperationsState[id].values.coneDepth
          ? parseInt(trapOperationsState[id].values.coneDepth)
          : null,
        trapInThalweg: null,
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
          ? parseInt(trapPostProcessingState[id].values.totalRevolutions)
          : null,
        rpmAtStart: calculateRpmAvg([startRpm1, startRpm2, startRpm3]),
        rpmAtEnd: calculateRpmAvg([endRpm1, endRpm2, endRpm3]),
        trapVisitEnvironmental: [
          {
            measureName: 'flow measure',
            measureValueNumeric: trapOperationsState[id].values.flowMeasure,
            measureValueText:
              trapOperationsState[id].values.flowMeasure?.toString(),
            measureUnit: 5,
          },
          {
            measureName: 'water temperature',
            measureValueNumeric:
              trapOperationsState[id].values.waterTemperature,
            measureValueText:
              trapOperationsState[id].values.waterTemperature?.toString(),
            measureUnit:
              trapOperationsState[id].values.waterTemperatureUnit === '°F'
                ? 1
                : 2,
          },
          {
            measureName: 'water turbidity',
            measureValueNumeric:
              trapOperationsState[id].values.waterTurbidity ||
              trapPostProcessingState[id].values.waterTurbidity ||
              null,
            measureValueText:
              trapOperationsState[id].values?.waterTurbidity?.toString() ||
              trapPostProcessingState[id].values?.waterTurbidity?.toString() ||
              '',
            measureUnit: 25,
          },
        ],
        trapCoordinates: {
          xCoord: trapPostProcessingState[id].values.trapLatitude,
          yCoord: trapPostProcessingState[id].values.trapLongitude,
          datum: null,
          projection: null,
        },
        inHalfConeConfiguration:
          trapOperationsState[id].values.coneSetting === 'half' ? true : false,
        debrisVolumeLiters: trapPostProcessingState[id].values.debrisVolume
          ? parseInt(trapPostProcessingState[id].values.debrisVolume)
          : null,
        qcCompleted: null,
        qcCompletedAt: null,
        comments: paperEntryState[id]
          ? paperEntryState[id].values.comments
          : null,
      }

      dispatch(saveTrapVisitSubmission(trapVisitSubmission))

      dispatch(
        saveTrapVisitInformation({
          crew: visitSetupState[tabIds[0]].values.crew,
          programId: visitSetupState[tabIds[0]].values.programId,
          trapLocationIds: findTrapLocationIds(),
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
    const markTypeValues = returnDefinitionArray(dropdownsState.values.markType)
    const markColorValues = returnDefinitionArray(
      dropdownsState.values.markColor
    )
    const bodyPartValues = returnDefinitionArray(dropdownsState.values.bodyPart)
    const returnTaxonCode = (fishSubmissionData: IndividualFishValuesI) => {
      let code = null
      dropdownsState.values.taxon.forEach((taxonValue: any) => {
        if (
          taxonValue.commonname
            .toLowerCase()
            .includes(fishSubmissionData.species.toLowerCase())
        ) {
          code = taxonValue.code
        }
      })
      return code
    }

    const catchRawSubmissions: any[] = []

    Object.keys(fishInputState).forEach(tabId => {
      if (tabId != 'placeholderId') {
        const fishStoreKeys = Object.keys(fishInputState[tabId].fishStore)
        const programId = Object.keys(visitSetupState).includes(tabId)
          ? visitSetupState[tabId].values.programId
          : 1

        fishStoreKeys.forEach(key => {
          const fishValue = fishInputState[tabId].fishStore[key]

          const filterAndPrepareData = (data: Array<any>) => {
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

            const filteredData = dataCopy.filter((obj: any) => {
              return obj.UID === fishValue.UID
            })

            return filteredData.map((obj: any) => {
              obj.crewMember = findCrewIdsFromSelectedCrewNames([
                obj.crewMember,
              ])
              return obj
            })
          }

          const findReleaseIdFromExistingMarks = () => {
            let releaseId = null
            fishValue.existingMarks.forEach((existingMark: any) => {
              if (existingMark.releaseId) {
                releaseId = existingMark.releaseId
              } else {
              }
            })
            return releaseId
          }

          const getRunClassMethod = (fishValue: any) => {
            if (fishValue.species === 'Chinook salmon') {
              return fishValue.run === 'not recorded' ? 5 : 6
            } else {
              return null
            }
          }

          catchRawSubmissions.push({
            uid: tabId,
            programId,
            trapVisitId: null,
            taxonCode: returnTaxonCode(fishValue),
            captureRunClass: returnNullableTableId(
              runValues.indexOf(fishValue.run)
            ),
            // defaults to "expert judgement" (id: 6) if run was selected from fish input dropdown
            captureRunClassMethod: getRunClassMethod(fishValue),
            // defaults to "none" (id: 1) if not selected
            markType: 1, // Check w/ Erin
            markedForRelease: fishValue.willBeUsedInRecapture,
            adiposeClipped: fishValue.adiposeClipped ? true : false,
            dead: fishValue.dead ? true : false,
            lifeStage: returnNullableTableId(
              lifeStageValues.indexOf(fishValue.lifeStage)
            ),
            forkLength:
              fishValue.forkLength != null
                ? parseInt(fishValue?.forkLength as any)
                : null,
            weight:
              fishValue?.weight != null
                ? parseInt(fishValue?.weight as any)
                : null,
            numFishCaught: fishValue?.numFishCaught,
            plusCount: fishValue?.plusCount ? true : false,
            plusCountMethodology: fishValue?.plusCountMethod
              ? returnNullableTableId(
                  plusCountMethodValues.indexOf(fishValue?.plusCountMethod)
                )
              : null,
            isRandom: null, // Check w/ Erin
            releaseId: findReleaseIdFromExistingMarks(),
            comments: null,
            createdBy: null,
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
              addGeneticSamplesState.values
            ),
            appliedMarks: filterAndPrepareData(appliedMarksState.values),
          })
        })
      }
    })

    if (catchRawSubmissions.length) {
      dispatch(saveCatchRawSubmissions(catchRawSubmissions))
    }
  }

  return (
    <>
      <View
        flex={1}
        bg='#fff'
        // justifyContent='center'
        // alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={10} p='15%'>
          <Heading textAlign='center'>
            {'Please fill out any incomplete sections  \n before moving on:'}
          </Heading>
          {stepsArray.map((step: any, idx: number) => {
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
        </VStack>
      </View>
      <NavButtons
        navigation={navigation}
        handleSubmit={emitSubmission}
        shouldProceedToLoadingScreen={true}
      />
    </>
  )
}

export default connect(mapStateToProps)(IncompleteSections)
