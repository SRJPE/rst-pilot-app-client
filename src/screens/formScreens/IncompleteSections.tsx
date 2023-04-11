import { useEffect, useState } from 'react'
import { Heading, View, VStack } from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  checkIfFormIsComplete,
  numOfFormSteps,
  resetNavigationSlice,
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
import { flatten, uniq } from 'lodash'
import { uid } from 'uid'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'

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
}) => {
  // console.log('🚀 ~ navigation', navigation)
  const dispatch = useDispatch<AppDispatch>()
  const [tempUID, setTempUID] = useState<string>(uid())
  const stepsArray = Object.values(navigationState.steps).slice(
    0,
    numOfFormSteps - 1
  ) as Array<any>

  useEffect(() => {
    dispatch(checkIfFormIsComplete())
  }, [])

  const handleSubmit = () => {
    saveTrapVisits()
    saveCatchRawSubmission()
    resetAllFormSlices()
    navigation.reset({
      index: 0,
      routes: [{ name: 'Visit Setup' }],
    })

    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: 'Visit Setup' }],
    //   })
    // )

    // navigation.navigate.popToTop()

    // navigation.dispatch(StackActions.popToTop())

    if (connectivityState.isConnected) {
      dispatch(postTrapVisitFormSubmissions())
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
  }

  const returnDefinitionArray = (dropdownsArray: any[]) => {
    return dropdownsArray.map((dropdownObj: any) => {
      return dropdownObj.definition
    })
  }

  const returnNullableTableId = (value: any) => (value == -1 ? null : value + 1)

  const saveTrapVisits = () => {
    const currentDateTime = new Date()
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
      const validRpms = rpms.filter((n) => n)
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
    tabIds.forEach((id) => {
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
      const selectedCrewNamesMap: Record<string, boolean> =
        selectedCrewNames.reduce(
          (acc: Record<string, boolean>, name: string) => ({
            ...acc,
            [name]: true,
          }),
          {}
        )
      const allCrewObjects = flatten(visitSetupDefaultState.crewMembers) // [{..., name: 'james', programId: 1},]
      const selectedCrewIds = uniq(
        allCrewObjects
          .filter(
            (obj: any) =>
              selectedCrewNamesMap[`${obj.firstName} ${obj.lastName}`]
          )
          .map((obj: any) => obj.personnelId)
      )
      const trapVisitSubmission = {
        uid: tempUID,
        crew: selectedCrewIds,
        programId: visitSetupState[id].values.programId,
        visitTypeId: null,
        trapLocationId: visitSetupState[id].values.trapLocationId,
        isPaperEntry: visitSetupState[id].isPaperEntry,
        trapVisitTimeStart: visitSetupState[id].isPaperEntry
          ? paperEntryState[id].values.startDate
          : trapPostProcessingState[id].values.trapVisitStartTime,
        trapVisitTimeEnd: visitSetupState[id].isPaperEntry
          ? paperEntryState[id].values.endDate
          : trapOperationsState[id].values.trapVisitStopTime,
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
        totalRevolutions: trapOperationsState[id].values.totalRevolutions
          ? parseInt(trapOperationsState[id].values.totalRevolutions)
          : null,
        rpmAtStart: calculateRpmAvg([startRpm1, startRpm2, startRpm3]),
        rpmAtEnd: calculateRpmAvg([endRpm1, endRpm2, endRpm3]),
        trapVisitEnvironmental: [
          {
            measureName: 'flow measure',
            measureValueNumeric: trapOperationsState[id].values.flowMeasure,
            measureValueText:
              trapOperationsState[id].values.flowMeasure.toString(),
            measureUnit: 5,
          },
          {
            measureName: 'water temperature',
            measureValueNumeric:
              trapOperationsState[id].values.waterTemperature,
            measureValueText:
              trapOperationsState[id].values.waterTemperature.toString(),
            measureUnit:
              trapOperationsState[id].values.waterTemperatureUnit === '°F'
                ? 1
                : 2,
          },
          {
            measureName: 'water turbidity',
            measureValueNumeric: trapOperationsState[id].values.waterTurbidity,
            measureValueText:
              trapOperationsState[id].values.waterTurbidity.toString(),
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

    Object.keys(fishInputState).forEach((tabGroupId) => {
      if (tabGroupId != 'placeholderId') {
        const fishStoreKeys = Object.keys(fishInputState[tabGroupId].fishStore)
        const activeTabId = Object.keys(tabState.tabs).filter((id) => {
          return tabState.tabs[id].groupId === tabGroupId
        })[0]
        const programId = visitSetupState[activeTabId]
          ? visitSetupState[activeTabId].values.programId
          : 1
        fishStoreKeys.forEach((key) => {
          const fishValue = fishInputState[tabGroupId].fishStore[key]
          catchRawSubmissions.push({
            uid: tempUID,
            programId,
            trapVisitId: null,
            taxonCode: returnTaxonCode(fishValue),
            captureRunClass: returnNullableTableId(
              runValues.indexOf(fishValue.run)
            ),
            // defaults to "expert judgement" (id: 6) if run was selected from fish input dropdown
            captureRunClassMethod: fishValue.run ? 6 : null,
            // defaults to "none" (id: 1) if not selected
            markType: 1, // Check w/ Erin
            markedForRelease: fishValue.willBeUsedInRecapture,
            adiposeClipped: fishValue.adiposeClipped,
            dead: fishValue.dead,
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
            plusCount: fishValue?.plusCount,
            plusCountMethodology: fishValue?.plusCountMethod
              ? returnNullableTableId(
                  plusCountMethodValues.indexOf(fishValue?.plusCountMethod)
                )
              : null,
            isRandom: null, // Check w/ Erin
            releaseId: null,
            comments: null,
            createdBy: null,
            createdAt: currentDateTime,
            updatedAt: null,
            qcCompleted: null,
            qcCompletedBy: null,
            qcTime: null,
            qcComments: null,
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
        justifyContent='center'
        // alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={10} p='10'>
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
              />
            )
          })}
        </VStack>
      </View>
      <NavButtons navigation={navigation} handleSubmit={() => handleSubmit()} />
    </>
  )
}

export default connect(mapStateToProps)(IncompleteSections)
