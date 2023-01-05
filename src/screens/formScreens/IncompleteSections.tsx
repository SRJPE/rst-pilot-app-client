import { useEffect } from 'react'
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
}) => {
  // console.log('🚀 ~ navigation', navigation)
  const dispatch = useDispatch<AppDispatch>()
  const stepsArray = Object.values(navigationState.steps).slice(
    0,
    numOfFormSteps - 1
  ) as Array<any>

  useEffect(() => {
    dispatch(checkIfFormIsComplete())
  }, [])

  const handleSubmit = () => {
    submitTrapVisit()
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

  const submitTrapVisit = () => {
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
    const {
      rpm1: startRpm1,
      rpm2: startRpm2,
      rpm3: startRpm3,
    } = trapOperationsState.values
    const {
      rpm1: endRpm1,
      rpm2: endRpm2,
      rpm3: endRpm3,
    } = trapPostProcessingState.values
    const selectedCrewNames: string[] = [...visitSetupState.values.crew] // ['james', 'steve']
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
          (obj: any) => selectedCrewNamesMap[`${obj.firstName} ${obj.lastName}`]
        )
        .map((obj: any) => obj.personnelId)
    )

    const trapVisitSubmission = {
      crew: selectedCrewIds,
      programId: 1,
      visitTypeId: null,
      trapLocationId: null,
      isPaperEntry: visitSetupState.isPaperEntry,
      trapVisitTimeStart: currentDateTime,
      trapVisitTimeEnd: null,
      fishProcessed: returnNullableTableId(
        fishProcessedValues.indexOf(
          fishProcessingState.values.fishProcessedResult
        )
      ),
      whyFishNotProcessed: returnNullableTableId(
        whyFishNotProcessedValues.indexOf(
          fishProcessingState.values.fishProcessedResult
        )
      ),
      sampleGearId: null,
      coneDepth: trapOperationsState.values.coneDepth
        ? parseInt(trapOperationsState.values.coneDepth)
        : null,
      trapInThalweg: null,
      trapFunctioning: returnNullableTableId(
        trapFunctioningValues.indexOf(trapOperationsState.values.trapStatus)
      ),
      whyTrapNotFunctioning: returnNullableTableId(
        whyTrapNotFunctioningValues.indexOf(
          trapOperationsState.values.reasonForNotFunc
        )
      ),
      trapStatusAtEnd: returnNullableTableId(
        trapStatusAtEndValues.indexOf(
          `${trapPostProcessingState.values.endingTrapStatus}`.toLowerCase()
        )
      ),
      totalRevolutions: trapOperationsState.values.totalRevolutions
        ? parseInt(trapOperationsState.values.totalRevolutions)
        : null,
      rpmAtStart:
        startRpm1 && startRpm2 && startRpm3
          ? (parseInt(startRpm1) + parseInt(startRpm2) + parseInt(startRpm3)) /
            3
          : null,
      rpmAtEnd:
        endRpm1 && endRpm2 && endRpm3
          ? (parseInt(endRpm1) + parseInt(endRpm2) + parseInt(endRpm3)) / 3
          : null,
      inHalfConeConfiguration:
        trapOperationsState.values.coneSetting === 'half' ? true : false,
      debrisVolumeGallons: trapPostProcessingState.values.debrisVolume
        ? parseInt(trapPostProcessingState.values.debrisVolume)
        : null,
      qcCompleted: null,
      qcCompletedAt: null,
      comments: paperEntryState.values.comments
        ? paperEntryState.values.comments
        : null,
    }

    dispatch(saveTrapVisitSubmission(trapVisitSubmission))
  }

  const saveCatchRawSubmission = () => {
    const currentDateTime = new Date()
    const lifeStageValues = returnDefinitionArray(
      dropdownsState.values.lifeStage
    )
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

    fishInputState.individualFish.forEach(
      (fishSubmissionData: IndividualFishValuesI) => {
        catchRawSubmissions.push({
          programId: 1,
          trapVisitId: null,
          taxonCode: returnTaxonCode(fishSubmissionData),
          captureRunClass: null,
          captureRunClassMethod: null,
          markType: null, // Check w/ Erin
          adiposeClipped: fishSubmissionData.adiposeClipped,
          dead: fishSubmissionData.dead,
          lifeStage: returnNullableTableId(
            lifeStageValues.indexOf(fishSubmissionData.lifeStage)
          ),
          forkLength:
            fishSubmissionData.forkLength != null
              ? parseInt(fishSubmissionData?.forkLength as any)
              : null,
          weight:
            fishSubmissionData?.weight != null
              ? parseInt(fishSubmissionData?.weight as any)
              : null,
          numFishCaught: fishSubmissionData?.numFishCaught,
          plusCount: fishSubmissionData?.plusCount,
          plusCountMethodology: fishSubmissionData?.plusCountMethod
            ? fishSubmissionData?.plusCountMethod
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
      }
    )

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
