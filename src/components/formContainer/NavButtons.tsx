import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch, connect } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/formSlices/navigationSlice'
import { Ionicons } from '@expo/vector-icons'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { isEqual } from 'lodash'
import { StackActions } from '@react-navigation/native'

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
  function useDeepCompareMemoize(value: any) {
    const ref = useRef()

    if (!isEqual(value, ref.current)) {
      ref.current = value
    }

    return ref.current
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

    navigation.dispatch(StackActions.replace(destination))
    dispatch({
      type: updateActiveStep,
      payload: payload,
    })
  }

  const navigateFlowRightButton = (values: any) => {
    //this is now kind of redundant with the implementation of the loading screen
    switch (activePage) {
      case 'Visit Setup':
        navigateHelper('Trap Operations')
        break
      case 'Trap Operations':
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
        break
      case 'Fish Processing':
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
        break
      case 'Fish Input':
        navigateHelper('Trap Post-Processing')
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
      case 'Incomplete Sections':
        navigateHelper('Start Mark Recapture')
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
        console.log('HIT DEFAULT, SHOULD NOT HAPPEN')
        break
    }
  }

  const navigateFlowLeftButton = () => {
    switch (activePage) {
      case 'Trap Operations':
        // if (isPaperEntryStore) navigateHelper('Paper Entry')
        navigateHelper('Visit Setup')
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
      case 'Fish Input':
        navigateHelper('Fish Processing')
        break
      case 'Paper Entry':
        navigateHelper('Visit Setup')
        break
      case 'Started Trapping':
        navigateHelper('Trap Operations')
        break
      case 'Trap Post-Processing':
        navigateHelper('Fish Input')
        break
      case 'Fish Holding':
        navigateHelper('Trap Post-Processing')
        break
      case 'Incomplete Sections':
        if (checkWillBeHoldingFishForMarkRecapture()) {
          navigateHelper('Fish Holding')
        } else {
          navigateHelper('Trap Post-Processing')
        }
        break
      default:
        console.log('HIT DEFAULT, SHOULD NOT HAPPEN')
        break
    }
  }

  const handleRightButton = () => {
    //if handleSubmit truthy, submit form to save to redux
    if (handleSubmit) {
      handleSubmit('right')
      showSlideAlert(dispatch)
    }

    if (!shouldProceedToLoadingScreen) {
      navigateFlowRightButton(values)
    }
  }

  const handleLeftButton = () => {
    //navigate back to home screen from visit setup screen
    if (activePage === 'Visit Setup') {
      navigation.navigate('Home')
      navigation.reset({
        index: 0,
        routes: [{ name: 'Visit Setup' }],
      })
      return
    }

    // if function truthy, submit form to save to redux
    if (handleSubmit) {
      //do not submit when going back from incomplete sections page (prevents early submission errors)
      if (activePage !== 'Incomplete Sections') {
        handleSubmit('left')
        return
      } else {
        navigateFlowLeftButton()
        return
      }
    }

    if (!shouldProceedToLoadingScreen) {
      navigateFlowLeftButton()
      return
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
    return buttonText
  }

  const rightDisabledBool = useMemo(() => {
    if (activePage === 'Incomplete Sections') {
      // if form is complete, then do not disable button
      return !isFormComplete
    } else if (
      activePage === 'High Flows' ||
      activePage === 'Non Functional Trap' ||
      activePage === 'No Fish Caught'
    ) {
      return true
    } else if (activePage === 'Fish Input') {
      return !(values?.length >= 1)
    } else {
      return (
        (touched && Object.keys(touched).length === 0) ||
        (errors && Object.keys(errors).length > 0)
      )
    }
  }, [useDeepCompareMemoize(touched), useDeepCompareMemoize(errors)])

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
          isDisabled={rightDisabledBool}
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
    tabSlice: state.tabSlice,
    visitSetupSlice: state.visitSetup,
    fishProcessingSlice: state.fishProcessing,
    reduxState: state,
  }
}

export default connect(mapStateToProps)(NavButtons)
