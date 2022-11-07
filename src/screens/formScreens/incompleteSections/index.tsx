import { useEffect } from 'react'
import { Heading, View, VStack } from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { checkIfFormIsComplete } from '../../../redux/reducers/formSlices/navigationSlice'
import NavButtons from '../../../components/formContainer/NavButtons'
import IncompleteSectionButton from '../../../components/form/IncompleteSectionButton'
import { postTrapVisitSubmissions, saveTrapVisitSubmission } from '../../../redux/reducers/postSlices/trapVisitPostBundler'

const mapStateToProps = (state: RootState) => {
  return {
    navigationState: state.navigation,
    visitSetupState: state.visitSetup,
    fishProcessingState: state.fishProcessing,
    trapPreProcessingState: state.trapPreProcessing,
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
  trapPreProcessingState,
  trapPostProcessingState,
  trapStatusState,
  dropdownsState,
  connectivityState,
}: {
  navigation: any
  navigationState: any
  visitSetupState: any
  fishProcessingState: any
  trapPreProcessingState: any
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

  // HANDLE SUBMIT TRAP VISIT
  const submitTrapVisit = () => {
    const currentDateTime = new Date()
    const fishProcessedValues = dropdownsState.values.fishProcessed.map(
      (dropdownObj: any) => {
        return dropdownObj.definition
      }
    )
    const whyFishNotProcessedValues =
      dropdownsState.values.whyFishNotProcessed.map((dropdownObj: any) => {
        return dropdownObj.definition
      })
    const trapStatusAtEndValues = dropdownsState.values.trapStatusAtEnd.map(
      (dropdownObj: any) => {
        return dropdownObj.definition
      }
    )
    const {
      rpm1: startRpm1,
      rpm2: startRpm2,
      rpm3: startRpm3,
    } = trapPreProcessingState.values
    const {
      rpm1: endRpm1,
      rpm2: endRpm2,
      rpm3: endRpm3,
    } = trapPostProcessingState.values

    const trapVisitSubmission = {
      id: null,
      programId: 1,
      visitTypeId: null,
      trapLocationId: null,
      trapVisitTimeStart: currentDateTime,
      trapVisitTimeEnd: null,
      fishProcessed:
        fishProcessedValues.indexOf(
          fishProcessingState.values.fishProcessedResult
        ) + 1,
      whyFishNotProcessed:
        whyFishNotProcessedValues.indexOf(
          fishProcessingState.values.fishProcessedResult
        ) + 1,
      sampleGearId: null,
      coneDepth: trapPreProcessingState.values.coneDepth,
      trapInThalweg: null,
      trapFunctioning: trapStatusState.values.trapStatus,
      whyTrapNotFunctioning: trapStatusState.values.reasonForNotFunc,
      trapStatusAtEnd:
        trapStatusAtEndValues.indexOf(
          `${trapPostProcessingState.values.endingTrapStatus}`.toLowerCase()
        ) + 1,
      totalRevolutions: trapPreProcessingState.values.totalRevolutions,
      rpmAtStart: (startRpm1 + startRpm2 + startRpm3) / 3,
      rpmAtEnd: (endRpm1 + endRpm2 + endRpm3) / 3,
      inHalfConeConfiguration:
        trapPreProcessingState.values.coneSetting === 'half' ? true : false,
      debrisVolumeLiters: trapPostProcessingState.values.debrisVolume,
      qcCompleted: null,
      qcCompletedAt: null,
      comments: null,
    }

    dispatch(saveTrapVisitSubmission(trapVisitSubmission))

    if (connectivityState.isConnected) {
      dispatch(postTrapVisitSubmissions())
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
      <NavButtons
        navigation={navigation}
        handleSubmit={() => submitTrapVisit()}
      />
    </>
  )
}

export default connect(mapStateToProps)(IncompleteSections)
