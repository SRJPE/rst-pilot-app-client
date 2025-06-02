import { Ionicons } from '@expo/vector-icons'
import { StackActions } from '@react-navigation/native'
import { FormikState } from 'formik'
import { isEqual } from 'lodash'
import { Box, Button, HStack, Icon, Text } from 'native-base'
import { useEffect, useMemo, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  checkIfFormIsComplete,
  resetNavigationSlice,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import { resetTabsSlice } from '../../redux/reducers/formSlices/tabSlice'
import { resetVisitSetupSlice } from '../../redux/reducers/formSlices/visitSetupSlice'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { fishProcessingSchema } from '../../utils/helpers/yupValidations'
import { getAllTabProcessingResults } from '../../redux/reducers/formSlices/fishProcessingSlice'

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
  // fishInput,
  reduxState,
  shouldProceedToLoadingScreen = false,
  isValid,
  resetForm,
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
  fishInput: any
  fishProcessingSlice: any
  reduxState: RootState
  shouldProceedToLoadingScreen?: boolean
  isValid?: boolean
  resetForm?: (nextState?: Partial<FormikState<any>> | undefined) => void
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  const previousPage = navigationState.steps[activeStep - 1]?.name
  const [isPaperEntryStore, setIsPaperEntryStore] = useState(false)

  const fishInput = useSelector((state: RootState) => state.fishInput)
  const fishProcessing = useSelector((state: RootState) => state.fishProcessing)
  useEffect(() => {
    setIsPaperEntryStore(checkIsPaperEntryStore())
    dispatch(checkIfFormIsComplete())
  }, [tabSlice.activeTabId])

  useEffect(() => {
    if (activePage === 'Incomplete Sections') {
      dispatch(checkIfFormIsComplete())
    }
  }, [activePage])

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
    const ref = useRef<any>(null)

    if (!isEqual(value, ref.current)) {
      ref.current = value
    }

    return ref.current
  }

  const checkWillBeHoldingFishForMarkRecapture = () => {
    if (tabSlice.activeTabId) {
      const tabsContainHoldingTrue = Object.keys(tabSlice.tabs).some(
        tabId =>
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
        } else {
          navigateHelper('Fish Processing')
        }
        break
      case 'Fish Processing':
        if (values?.fishProcessedResult === 'no fish caught') {
          navigateHelper('Trap Post-Processing')
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
        navigateHelper('Start Mark Recapture')
        break
      case 'High Temperatures':
        navigateHelper('Fish Processing')
        break
      case 'Non Functional Trap':
        navigateHelper('Fish Processing')
        break
      case 'No Fish Caught':
        navigateHelper('Start Mark Recapture')
        break
      case 'Paper Entry':
        navigateHelper('Trap Operations')
        break
      case 'Started Trapping':
        navigation?.navigate('Home')
        break
      default:
        console.log('HIT DEFAULT, SHOULD NOT HAPPEN')
        break
    }
  }

  const navigateFlowLeftButton = () => {
    console.log('activePage', activePage)
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
        if (values?.fishProcessedResult === 'no fish caught') {
          navigateHelper('Fish Processing')
        } else if (values?.fishProcessedResult.includes('no catch data')) {
          navigateHelper('Fish Processing')
        } else {
          navigateHelper('Fish Input')
        }
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
    }

    if (!shouldProceedToLoadingScreen) {
      navigateFlowRightButton(values)
    }
  }

  const handleLeftButton = () => {
    //navigate back to home screen from visit setup screen
    if (activePage === 'Visit Setup') {
      console.log('resetting form', resetForm)
      //If the left button the form is being reset to clear errors and input styles
      if (resetForm) resetForm()
      dispatch(resetNavigationSlice())
      dispatch(resetVisitSetupSlice())
      dispatch(resetTabsSlice())
      navigation.reset({
        index: 0,
        routes: [{ name: 'Visit Setup' }],
      })
      navigation.getParent()?.navigate('Home')
      return
    }

    if (
      activePage === 'No Fish Caught' ||
      activePage === 'High Flows' ||
      activePage === 'Started Trapping'
    ) {
      navigateFlowLeftButton()
      return
    }

    if (handleSubmit) {
      // if function truthy, submit form to save to redux
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
        buttonText = 'End Trap Visit'
        break
      case 'Non Functional Trap':
        buttonText = 'Move on to Fish Processing'
        break
      case 'No Fish Caught':
        buttonText = 'End Trap Visit'
        break
      case 'Started Trapping':
        buttonText = 'Save Trap Visit'
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
    switch (activePage) {
      case 'Visit Setup':
        // console.log('errors', errors)
        return false
      case 'Incomplete Sections':
        return !isFormComplete || !isValid
      case 'Non Functional Trap':
        return false
      case 'Fish Input':
        const allTabProcessingResults =
          getAllTabProcessingResults(fishProcessing)
        const fishInputTabValidity = allTabProcessingResults.map(result => {
          if (result.fishProcessingResult === 'processed fish') {
            return (
              Object.values(fishInput[result.tabId]?.fishStore || {}).length > 0
            )
          }

          return null
        })

        return fishInputTabValidity.includes(false)
      case 'Trap Operations':
        break
      case 'Fish Processing':
        break
      // return !fishProcessingSchema.isValidSync(values)
      default:
        break
    }

    if (typeof isValid === 'boolean') {
      return !isValid
    }
  }, [
    useDeepCompareMemoize(touched),
    useDeepCompareMemoize(errors),
    useDeepCompareMemoize(values),
    isValid,
    activePage,
    fishInput,
  ])

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
            ) : undefined
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
    fishInput: state.fishInput,
  }
}

export default connect(mapStateToProps)(NavButtons)
