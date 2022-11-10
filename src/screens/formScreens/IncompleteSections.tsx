import { useEffect } from 'react'
import { Heading, View, VStack } from 'native-base'
import { connect, useDispatch } from 'react-redux'

import { AppDispatch, RootState } from '../../redux/store'
import {
  checkIfFormIsComplete,
  resetNavigationSlice,
} from '../../redux/reducers/formSlices/navigationSlice'
import NavButtons from '../../components/formContainer/NavButtons'
import IncompleteSectionButton from '../../components/form/IncompleteSectionButton'
import {
  postTrapVisitSubmissions,
  saveTrapVisitSubmission,
} from '../../redux/reducers/postSlices/trapVisitPostBundler'
import { resetGeneticSamplesSlice } from '../../redux/reducers/formSlices/addGeneticSamplesSlice'
import { resetMarksOrTagsSlice } from '../../redux/reducers/formSlices/addMarksOrTagsSlice'
import { resetFishInputSlice } from '../../redux/reducers/formSlices/fishInputSlice'
import { resetFishProcessingSlice } from '../../redux/reducers/formSlices/fishProcessingSlice'
import { resetTrapPostProcessingSlice } from '../../redux/reducers/formSlices/trapPostProcessingSlice'
import { resetTrapStatusSlice } from '../../redux/reducers/formSlices/trapStatusSlice'
import { resetVisitSetupSlice } from '../../redux/reducers/formSlices/visitSetupSlice'

const mapStateToProps = (state: RootState) => {
  return {
    navigationState: state.navigation,
    visitSetupState: state.visitSetup,
    fishProcessingState: state.fishProcessing,
    trapPostProcessingState: state.trapPostProcessing,
    trapStatusState: state.trapStatus,
    dropdownsState: state.dropdowns,
    connectivityState: state.connectivity,
  }
}

const IncompleteSections = ({
  navigation,
  navigationState,
  visitSetupState,
  fishProcessingState,
  trapPostProcessingState,
  trapStatusState,
  dropdownsState,
  connectivityState,
}: {
  navigation: any
  navigationState: any
  visitSetupState: any
  fishProcessingState: any
  trapPostProcessingState: any
  trapStatusState: any
  dropdownsState: any
  connectivityState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const stepsArray = Object.values(navigationState.steps).slice(
    0,
    6
  ) as Array<any>

  useEffect(() => {
    dispatch(checkIfFormIsComplete())
  }, [])

  const handleSubmit = () => {
    submitTrapVisit()
    resetAllFormSlices()

    if (connectivityState.isConnected) {
      dispatch(postTrapVisitSubmissions())
    }
  }

  const resetAllFormSlices = () => {
    dispatch(resetNavigationSlice())
    dispatch(resetGeneticSamplesSlice())
    dispatch(resetMarksOrTagsSlice())
    dispatch(resetFishInputSlice())
    dispatch(resetFishProcessingSlice())
    dispatch(resetTrapPostProcessingSlice())
    dispatch(resetTrapStatusSlice())
    dispatch(resetVisitSetupSlice())
  }

  const submitTrapVisit = () => {
    const currentDateTime = new Date()
    const returnDefinitionArray = (dropdownsArray: any[]) => {
      return dropdownsArray.map((dropdownObj: any) => {
        return dropdownObj.definition
      })
    }
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
    } = trapStatusState.values
    const {
      rpm1: endRpm1,
      rpm2: endRpm2,
      rpm3: endRpm3,
    } = trapPostProcessingState.values

    const returnNullableTableId = (value: any) => {
      value == -1 ? null : value + 1
    }

    const trapVisitSubmission = {
      programId: 1,
      visitType: null,
      trapLocationId: null,
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
      coneDepth: parseInt(trapStatusState.values.coneDepth),
      trapInThalweg: null,
      trapFunctioning: returnNullableTableId(
        trapFunctioningValues.indexOf(trapStatusState.values.trapStatus)
      ),
      whyTrapNotFunctioning: returnNullableTableId(
        whyTrapNotFunctioningValues.indexOf(
          trapStatusState.values.reasonForNotFunc
        )
      ),
      trapStatusAtEnd: returnNullableTableId(
        trapStatusAtEndValues.indexOf(
          `${trapPostProcessingState.values.endingTrapStatus}`.toLowerCase()
        )
      ),
      totalRevolutions: parseInt(trapStatusState.values.totalRevolutions),
      rpmAtStart:
        (parseInt(startRpm1) + parseInt(startRpm2) + parseInt(startRpm3)) / 3,
      rpmAtEnd: (parseInt(endRpm1) + parseInt(endRpm2) + parseInt(endRpm3)) / 3,
      inHalfConeConfiguration:
        trapStatusState.values.coneSetting === 'half' ? true : false,
      debrisVolumeLiters: parseInt(trapPostProcessingState.values.debrisVolume),
      qcCompleted: null,
      qcCompletedAt: null,
      comments: null,
    }

    dispatch(saveTrapVisitSubmission(trapVisitSubmission))
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
