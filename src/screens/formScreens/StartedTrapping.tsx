import React from 'react'
import { Heading, Image, View, VStack } from 'native-base'
import NavButtons from '../../components/formContainer/NavButtons'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { useRef, useState } from 'react'
import { resetNavigationSlice } from '../../redux/reducers/formSlices/navigationSlice'
import {
  postTrapVisitFormSubmissions,
  saveTrapVisitSubmission,
} from '../../redux/reducers/postSlices/trapVisitFormPostBundler'
import { resetGeneticSamplesSlice } from '../../redux/reducers/formSlices/addGeneticSamplesSlice'
import { resetMarksOrTagsSlice } from '../../redux/reducers/formSlices/addMarksOrTagsSlice'
import { resetFishInputSlice } from '../../redux/reducers/formSlices/fishInputSlice'
import { resetFishProcessingSlice } from '../../redux/reducers/formSlices/fishProcessingSlice'
import { resetTrapPostProcessingSlice } from '../../redux/reducers/formSlices/trapPostProcessingSlice'
import { resetTrapOperationsSlice } from '../../redux/reducers/formSlices/trapOperationsSlice'
import { resetVisitSetupSlice } from '../../redux/reducers/formSlices/visitSetupSlice'
import { resetPaperEntrySlice } from '../../redux/reducers/formSlices/paperEntrySlice'
import { resetTabsSlice } from '../../redux/reducers/formSlices/tabSlice'
import { resetBatchCountSlice } from '../../redux/reducers/formSlices/batchCountSlice'
import { flatten, uniq } from 'lodash'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { saveTrapVisitInformation } from '../../redux/reducers/markRecaptureSlices/releaseTrialDataEntrySlice'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import {
  returnDefinitionArray,
  calcAvgValue,
  returnNullableTableId,
  findTrapLocationIds,
} from '../../utils/utils'

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

const StartedTrapping = ({
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
        showSlideAlert(
          dispatch,
          'Trap visit successfully uploaded',
          'success',
          5000
        )
      } else {
        console.log('Connection issue during submission')
        showSlideAlert(
          dispatch,
          'Connection issue during trap visit submission',
          'error',
          5000
        )
      }
    } catch (error) {
      console.log('submit error: ', error)
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

    const tabIds = Object.keys(tabState.tabs)
    tabIds.forEach(id => {
      const waterTurbidityIsPresent =
        trapOperationsState?.[id].values.waterTurbidity !== '' &&
        trapOperationsState?.[id].values.waterTurbidity !== null

      const {
        rpm1: endRpm1,
        rpm2: endRpm2,
        rpm3: endRpm3,
      } = trapOperationsState?.[id].values // end rpm if restart bc no start

      const selectedCrewNames: string[] = [
        ...visitSetupState?.[id]?.values.crew,
      ] // ['james', 'steve']

      const selectedCrewIds =
        findCrewIdsFromSelectedCrewNames(selectedCrewNames)
      const trapVisitSubmission = {
        trapVisitUid: id,
        crew: selectedCrewIds,
        programId: visitSetupState?.[id]?.values.programId,
        visitTypeId: null,
        trapLocationId: visitSetupState?.[id]?.values.trapLocationId,
        isPaperEntry: visitSetupState?.[id].isPaperEntry,
        trapVisitTimeStart: trapOperationsState?.[id]?.values.trapVisitStopTime, // time from trap operations will BE START TIME bc they are restarting the trap
        // trapVisitTimeEnd: trapOperationsState?.[id]?.values.trapVisitStopTime,
        fishProcessed: returnNullableTableId(
          fishProcessedValues.indexOf('no fish caught')
        ),
        whyFishNotProcessed: returnNullableTableId(
          whyFishNotProcessedValues.indexOf('not recorded')
        ),
        sampleGearId: null,
        coneDepth: trapOperationsState?.[id]?.values.coneDepth
          ? parseFloat(trapOperationsState?.[id]?.values.coneDepth)
          : null,
        trapInThalweg:
          typeof trapOperationsState?.[id]?.values?.trapInThalweg === 'boolean'
            ? trapOperationsState?.[id]?.values?.trapInThalweg
            : null,
        trapFunctioning: returnNullableTableId(
          trapFunctioningValues.indexOf('trap not in service')
        ),
        whyTrapNotFunctioning: returnNullableTableId(
          whyTrapNotFunctioningValues.indexOf(
            trapOperationsState?.[id]?.values.reasonNotFunc
          )
        ),
        trapStatusAtEnd: returnNullableTableId(
          trapStatusAtEndValues.indexOf('restart trap')
        ),
        totalRevolutions: trapPostProcessingState?.[id]?.values.totalRevolutions
          ? parseFloat(trapPostProcessingState?.[id]?.values.totalRevolutions)
          : null,
        rpmAtEnd: calcAvgValue([endRpm1, endRpm2, endRpm3]),
        trapVisitEnvironmental: [
          {
            measureName: 'flow measure',
            measureValueNumeric: trapOperationsState?.[id]?.values.flowMeasure,
            measureValueText:
              trapOperationsState?.[id]?.values.flowMeasure?.toString(),
            measureUnit: 5,
          },
          {
            measureName: 'water temperature',
            measureValueNumeric:
              trapOperationsState?.[id]?.values.waterTemperature,
            measureValueText:
              trapOperationsState?.[id]?.values.waterTemperature?.toString(),
            measureUnit:
              trapOperationsState?.[id]?.values.waterTemperatureUnit === '°F'
                ? 1
                : 2,
          },
          {
            measureName: 'water turbidity',
            measureValueNumeric: waterTurbidityIsPresent
              ? trapOperationsState?.[id]?.values.waterTurbidity
              : trapOperationsState?.[id]?.values
                  ?.recordTurbidityInPostProcessing
              ? null
              : undefined,
            measureValueText: waterTurbidityIsPresent
              ? trapOperationsState?.[id]?.values.waterTurbidity?.toString()
              : trapOperationsState?.[id]?.values
                  ?.recordTurbidityInPostProcessing
              ? ''
              : 'undefined',
            measureUnit: 25,
          },
        ],
        trapCoordinates: {
          xCoord: trapPostProcessingState?.[id]?.values.trapLatitude,
          yCoord: trapPostProcessingState?.[id]?.values.trapLongitude,
          datum: null,
          projection: null,
        },
        inHalfConeConfiguration:
          trapOperationsState[id].values.coneSetting === 'half' ? true : false,
        debrisVolumeGal: trapPostProcessingState?.[id]?.values.debrisVolume
          ? parseFloat(trapPostProcessingState?.[id]?.values.debrisVolume)
          : null,
        qcCompleted: null,
        qcCompletedAt: null,
        comments: trapPostProcessingState?.[id]?.values.comments
          ? trapPostProcessingState?.[id]?.values.comments
          : null,
        createdBy: userCredentialsStore.id,
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
            source={require('../../../assets/checkmark_outline.png')}
            alt='Warning Icon'
            size='2xl'
            color='themeGrey'
          />
          <Heading textAlign='center'>
            {`Looks like you just dropped your cone to start trapping. 

              Save your restart trap information`}
          </Heading>
        </VStack>
      </View>
      <NavButtons navigation={navigation} handleSubmit={handleSubmit} />
    </>
  )
}

export default connect(mapStateToProps)(StartedTrapping)
