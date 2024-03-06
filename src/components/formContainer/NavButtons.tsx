import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch, connect } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/formSlices/navigationSlice'
import { Ionicons } from '@expo/vector-icons'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { useEffect, useState, useCallback } from 'react'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { debounce } from 'lodash'

const NavButtons = ({
  navigation,
  handleSubmit,
  errors,
  touched,
  values,
  isFormComplete,
  isPaperEntry,
  tabSlice,
  visitSetupSlice,
  fishProcessingSlice,
  reduxState,
  shouldProceedToLoadingScreen = false,
}: {
  navigation?: any
  handleSubmit?: any
  errors?: any
  touched?: any
  values?: any
  isFormComplete?: boolean
  isPaperEntry?: boolean
  tabSlice: TabStateI
  visitSetupSlice: any
  fishProcessingSlice: any
  reduxState: RootState
  shouldProceedToLoadingScreen?: boolean
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  const previousPage = navigationState.steps[activeStep - 1]?.name
  const [isPaperEntryStore, setIsPaperEntryStore] = useState(false)

  useEffect(() => {
    setIsPaperEntryStore(checkIsPaperEntryStore())
  }, [tabSlice.activeTabId])

  const checkIsPaperEntryStore = () => {
    if (isPaperEntry != null) return isPaperEntry
    if (tabSlice.activeTabId) {
      if (visitSetupSlice[tabSlice.activeTabId]) {
        return visitSetupSlice[tabSlice.activeTabId].isPaperEntry
      } else {
        return visitSetupSlice['placeholderId'].isPaperEntry
      }
    }
    return false
  }

  const checkWillBeHoldingFishForMarkRecapture = () => {
    if (tabSlice.activeTabId) {
      const tabsContainHoldingTrue = Object.keys(tabSlice.tabs).some(
        (tabId) =>
          fishProcessingSlice?.[tabId]?.values
            ?.willBeHoldingFishForMarkRecapture
      )
      return tabsContainHoldingTrue
    }
    return false
  }

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
          navigateHelper('Paper Entry')
        } else {
          navigateHelper('Trap Operations')
        }
        break
      case 'Trap Operations':
        if (!isPaperEntryStore) {
          if (values?.trapStatus === 'trap not functioning') {
            navigateHelper('Non Functional Trap')
          } else if (
            values?.trapStatus === 'trap not in service - restart trapping'
          ) {
            navigateHelper('Started Trapping')
          } else if (values?.flowMeasure > 1000) {
            navigateHelper('High Flows')
          } else if (values?.waterTemperatureUnit === '°C') {
            if (values?.waterTemperature > 30) {
              navigateHelper('High Temperatures')
            } else {
              navigateHelper('Fish Processing')
            }
          } else if (values?.waterTemperatureUnit === '°F') {
            if (values?.waterTemperature > 86) {
              navigateHelper('High Temperatures')
            } else {
              navigateHelper('Fish Processing')
            }
          } else {
            navigateHelper('Fish Processing')
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
          } else {
            navigateHelper('Fish Input')
          }
        } else {
          navigateHelper('Trap Post-Processing')
        }
        break
      case 'Trap Post-Processing':
        if (checkWillBeHoldingFishForMarkRecapture()) {
          navigateHelper('Fish Holding')
        } else {
          navigateHelper('Incomplete Sections')
        }
        break
      case 'Fish Holding':
        navigateHelper('Incomplete Sections')
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
        navigateHelper('Trap Operations')
        break
      case 'Started Trapping':
        navigation.navigate('Home')
        break
      default:
        navigation.navigate('Trap Visit Form', {
          screen: navigationState.steps[activeStep + 1]?.name,
        })
        dispatch(updateActiveStep(navigationState.activeStep + 1))
        break
    }
  }

  const navigateFlowLeftButton = () => {
    switch (activePage) {
      case 'Trap Operations':
        if (isPaperEntryStore) navigateHelper('Paper Entry')
        break
      case 'High Flows':
        navigateHelper('Trap Operations')
        break
      case 'High Temperatures':
        navigateHelper('Trap Operations')
        break
      case 'Non Functional Trap':
        navigateHelper('Trap Operations')
        break
      case 'Fish Processing':
        navigateHelper('Trap Operations')
        break
      case 'No Fish Caught':
        navigateHelper('Fish Processing')
        break
      case 'Paper Entry':
        navigateHelper('Visit Setup')
        break
      case 'Started Trapping':
        navigateHelper('Trap Operations')
        break
      case 'Fish Holding':
        navigateHelper('Trap Post-Processing')
        break
      case 'Incomplete Sections':
        if (checkWillBeHoldingFishForMarkRecapture()) {
          navigateHelper('Fish Holding')
        }
        break
      default:
        break
    }
  }

  const handleRightButton = () => {
    if (handleSubmit) {
      handleSubmit()
      showSlideAlert(dispatch)
    }

    if (!shouldProceedToLoadingScreen) {
      // If proceeding to loading screen, do not navigate to next screen, instead navigate from loading screen
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
      //do not submit when going back from incomplete sections page (prevents early submission errors)
      if (activePage !== 'Incomplete Sections') {
        handleSubmit()
      }
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
    // if (isPaperEntryStore) {
    //   return false
    // }
    if (activePage === 'Incomplete Sections') {
      //if form is complete, then do not disable button
      return isFormComplete ? false : true
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
      case 'Started Trapping':
        buttonText = 'Home'
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
    // if (navigationState.previousPageWasIncompleteSections) {
    //   buttonText = 'Return to Incomplete Sections'
    // }
    return buttonText
  }
  const debouncedHandleRightButton = useCallback(
    debounce(handleRightButton, 500, {
      leading: true,
      trailing: false,
    }),
    [handleSubmit]
  )
  const debouncedHandleLeftButton = useCallback(
    debounce(handleLeftButton, 500, {
      leading: true,
      trailing: false,
    }),
    [handleSubmit]
  )
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
          onPress={debouncedHandleLeftButton}
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
          onPress={debouncedHandleRightButton}
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
    tabSlice: state.tabSlice,
    visitSetupSlice: state.visitSetup,
    fishProcessingSlice: state.fishProcessing,
    reduxState: state,
  }
}

export default connect(mapStateToProps)(NavButtons)
