import { Heading, Image, View, VStack } from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { useRef, useState } from 'react'
import {
  numOfFormSteps,
  resetNavigationSlice,
} from '../../../redux/reducers/formSlices/navigationSlice'
import {
  postTrapVisitFormSubmissions,
  saveTrapVisitSubmission,
} from '../../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { resetGeneticSamplesSlice } from '../../../redux/reducers/formSlices/addGeneticSamplesSlice'
import { resetMarksOrTagsSlice } from '../../../redux/reducers/formSlices/addMarksOrTagsSlice'
import { resetFishInputSlice } from '../../../redux/reducers/formSlices/fishInputSlice'
import { resetFishProcessingSlice } from '../../../redux/reducers/formSlices/fishProcessingSlice'
import { resetTrapPostProcessingSlice } from '../../../redux/reducers/formSlices/trapPostProcessingSlice'
import { resetTrapOperationsSlice } from '../../../redux/reducers/formSlices/trapOperationsSlice'
import { resetVisitSetupSlice } from '../../../redux/reducers/formSlices/visitSetupSlice'
import { resetPaperEntrySlice } from '../../../redux/reducers/formSlices/paperEntrySlice'
import { resetTabsSlice } from '../../../redux/reducers/formSlices/tabSlice'
import { flatten, uniq } from 'lodash'
import { TabStateI } from '../../../redux/reducers/formSlices/tabSlice'
import { saveTrapVisitInformation } from '../../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'

const mapStateToProps = (state: RootState) => {
  return {
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
    userCredentialsStore: state.userCredentials,
  }
}

const NoFishCaught = ({
  navigation,
  visitSetupState,
  visitSetupDefaultState,
  fishProcessingState,
  trapPostProcessingState,
  trapOperationsState,
  dropdownsState,
  connectivityState,
  paperEntryState,
  tabState,
  userCredentialsStore,
}: {
  navigation: any
  visitSetupState: any
  visitSetupDefaultState: any
  fishProcessingState: any
  trapPostProcessingState: any
  trapOperationsState: any
  dropdownsState: any
  connectivityState: any
  paperEntryState: any
  tabState: TabStateI
  userCredentialsStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const hasSubmittedRef = useRef(false)

  const handleSubmit = () => {
    if (hasSubmittedRef.current) return // If already submitted, return early
    try {
      saveTrapVisits()
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
        trapVisitTimeStart: new Date(),
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
          trapStatusAtEndValues.indexOf(`Restart Trap`.toLowerCase())
        ),
        totalRevolutions: null,
        rpmAtStart: calculateRpmAvg([startRpm1, startRpm2, startRpm3]),
        // rpmAtEnd: calculateRpmAvg([endRpm1, endRpm2, endRpm3]),
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
              trapOperationsState[id].values.waterTurbidity || null,
            measureValueText:
              trapOperationsState[id].values?.waterTurbidity?.toString() || '',
            measureUnit: 25,
          },
        ],
        trapCoordinates: {
          xCoord: trapPostProcessingState?.[id]?.values?.trapLatitude || null,
          yCoord: trapPostProcessingState?.[id]?.values?.trapLongitude || null,
          datum: null,
          projection: null,
        },
        inHalfConeConfiguration:
          trapOperationsState[id].values.coneSetting === 'half' ? true : false,
        debrisVolumeGal: trapPostProcessingState?.[id]?.values?.debrisVolume
          ? parseInt(trapPostProcessingState?.[id]?.values?.debrisVolume)
          : null,
        qcCompleted: null,
        qcCompletedAt: null,
        comments: paperEntryState[id]
          ? paperEntryState[id].values.comments
          : null,
        createdBy: userCredentialsStore.id,
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
  return (
    <>
      <View
        flex={1}
        justifyContent='center'
        alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={12} p='10'>
          <Image
            alignSelf='center'
            source={require('../../../../assets/checkmark_outline.png')}
            alt='Warning Icon'
            size='2xl'
            color='themeGrey'
          />
          <Heading textAlign='center'>
            {
              'Looks like there are no fish in the RST today. \n Please reset the trap.'
            }
          </Heading>
        </VStack>
      </View>
      <NavButtons navigation={navigation} handleSubmit={handleSubmit} />
    </>
  )
}

export default connect(mapStateToProps)(NoFishCaught)
