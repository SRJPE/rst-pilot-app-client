import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch, connect } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/formSlices/navigationSlice'
import { Ionicons } from '@expo/vector-icons'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'

const NavButtons = ({
  navigation,
  handleSubmit,
  errors,
  touched,
  values,
  isFormComplete,
  isPaperEntry,
}: {
  navigation?: any
  handleSubmit?: any
  errors?: any
  touched?: any
  values?: any
  isFormComplete?: boolean
  isPaperEntry?: boolean
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  const reduxState = useSelector((state: any) => state)
  const isPaperEntryStore = reduxState.visitSetup.isPaperEntry

  const navigateHelper = (destination: string) => {
    const formSteps = Object.values(navigationState?.steps) as any
    let payload = null
    for (let i = 0; i < formSteps.length; i++) {
      if (formSteps[i].name === destination) {
        payload = i + 1
      }
    }

    navigation.navigate('Trap Visit Form', { screen: destination })
    dispatch({
      type: updateActiveStep,
      payload: payload,
    })
  }

  const navigateFlowRightButton = (values: any) => {
    switch (activePage) {
      case 'Visit Setup':
        if (isPaperEntry) {
          navigation.navigate('Trap Visit Form', { screen: 'Paper Entry' })
          dispatch({
            type: updateActiveStep,
            payload: 14,
          })
        }
        break
      case 'Trap Status':
        if (!isPaperEntryStore) {
          if (values?.trapStatus === 'trap not functioning') {
            navigateHelper('Non Functional Trap')
          } else if (values?.trapStatus === 'trap not in service') {
            navigateHelper('No Fish Caught')
          } else if (values?.flowMeasure > 1000) {
            navigateHelper('High Flows')
          } else if (values?.waterTemperatureUnit === '°C') {
            if (values?.waterTemperature > 30) {
              navigateHelper('High Temperatures')
            }
          } else if (values?.waterTemperatureUnit === '°F') {
            if (values?.waterTemperature > 86) {
              navigateHelper('High Temperatures')
            }
          }
        }

        break
      case 'Fish Processing':
        if (!isPaperEntryStore) {
          if (values?.fishProcessedResult === 'no fish caught') {
            navigateHelper('No Fish Caught')
          } else if (
            values?.fishProcessedResult ===
              'no catch data, fish left in live box' ||
            values?.fishProcessedResult === 'no catch data, fish released'
          ) {
            navigateHelper('Trap Post-Processing')
          }
        }
        break
      case 'High Flows':
        navigateHelper('End Trapping')
        break
      case 'High Temperatures':
        navigateHelper('Fish Processing')
        break
      case 'No Fish Caught':
        navigateHelper('Trap Post-Processing')
        break
      case 'Paper Entry':
        navigateHelper('Trap Status')
        break
      default:
        break
    }
  }

  const navigateFlowLeftButton = () => {
    switch (activePage) {
      case 'Trap Status':
        if (isPaperEntryStore) navigateHelper('Paper Entry')
        break
      case 'High Flows':
        navigateHelper('Trap Status')
        break
      case 'High Temperatures':
        navigateHelper('Trap Status')
        break
      case 'Non Functional Trap':
        navigateHelper('Trap Status')
        break
      case 'No Fish Caught':
        navigateHelper('Fish Processing')
        break
      case 'Paper Entry':
        navigateHelper('Visit Setup')
        break
      default:
        break
    }
  }

  const handleRightButton = () => {
    //if function truthy, submit form to check for errors and save to redux
    if (handleSubmit) {
      handleSubmit()
      showSlideAlert(dispatch)
    }

    if (activePage === 'Visit Setup' && isPaperEntry) {
      navigation.navigate('Trap Visit Form', { screen: 'Paper Entry' })
      dispatch({
        type: updateActiveStep,
        payload: 14,
      })
    } else {
      //navigate Right
      navigation.navigate('Trap Visit Form', {
        screen: navigationState.steps[activeStep + 1]?.name,
      })
      dispatch({
        type: updateActiveStep,
        payload: navigationState.activeStep + 1,
      })
      //navigate various flows (This seems to not be causing performance issues even though it is kind of redundant to place it here)
      navigateFlowRightButton(values)
    }
  }

  const handleLeftButton = () => {
    //navigate back to home screen from visit setup screen
    if (activePage === 'Visit Setup') {
      navigation.navigate('Home')
      return
    }
    //if function truthy, submit form to save to redux
    if (handleSubmit) {
      handleSubmit()
    }
    //navigate left
    navigation.navigate('Trap Visit Form', {
      screen: navigationState.steps[activeStep - 1]?.name,
    })
    dispatch({
      type: updateActiveStep,
      payload: navigationState.activeStep - 1,
    })
    //navigate various flows if needed (This seems to not be causing performance issues even though it is kind of redundant to place it here)
    navigateFlowLeftButton()
  }

  const disableRightButton = () => {
    //if paper entry then never disable the right button
    if (isPaperEntryStore) {
      return false
    }
    if (activePage === 'Incomplete Sections') {
      //if form is complete, then do not disable button
      // return isFormComplete ? false : true
      return isFormComplete ? false : false
    } else if (
      activePage === 'High Flows' ||
      activePage === 'Non Functional Trap' ||
      activePage === 'No Fish Caught'
    ) {
      return true
    } else if (activePage === 'Fish Input') {
      return values?.length < 1 ? true : false
    } else {
      //if current screen uses formik && if form has first NOT been touched
      // OR
      //if current screen uses formik && there are errors
      return (
        (touched && Object.keys(touched).length === 0) ||
        (errors && Object.keys(errors).length > 0)
      )
    }
  }

  const renderRightButtonText = (activePage: string) => {
    let buttonText
    switch (activePage) {
      case 'High Flows':
        buttonText = 'End Trapping'
        break
      case 'Non Functional Trap':
        buttonText = 'End Trapping'
        break
      case 'No Fish Caught':
        buttonText = 'End Trapping'
        break
      case 'High Temperatures':
        buttonText = 'Move on to Fish Processing'
        break
      case 'Incomplete Sections':
        buttonText = 'Save'
        break
      default:
        buttonText = 'Next'
        break
    }
    return buttonText
  }

  return (
    <Box bg='themeGrey' pb='12' pt='6' px='3' maxWidth='100%'>
      <HStack justifyContent='space-evenly'>
        <Button
          alignSelf='flex-start'
          bg='secondary'
          width='45%'
          height='20'
          shadow='5'
          leftIcon={
            activePage === 'Visit Setup' ? (
              <Icon as={Ionicons} name='home' size='lg' color='primary' />
            ) : (
              <></>
            )
          }
          onPress={handleLeftButton}
        >
          <Text fontSize='xl' fontWeight='bold' color='primary'>
            {activePage === 'Visit Setup' ? 'Return Home' : 'Back'}
          </Text>
        </Button>
        <Button
          alignSelf='flex-start'
          bg='primary'
          width='45%'
          height='20'
          shadow='5'
          isDisabled={disableRightButton()}
          onPress={handleRightButton}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            {renderRightButtonText(activePage)}
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    isFormComplete: state.navigation.isFormComplete,
  }
}

export default connect(mapStateToProps)(NavButtons)
