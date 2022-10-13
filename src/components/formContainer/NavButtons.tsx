import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/formSlices/navigationSlice'
import { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function NavButtons({
  navigation,
  handleSubmit,
  errors,
  touched,
  values,
}: {
  navigation?: any
  handleSubmit?: any
  errors?: any
  touched?: any
  values?: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  const reduxState = useSelector((state: any) => state)

  const navigateHelper = (destination: string, payload: number) => {
    navigation.navigate('Trap Visit Form', { screen: destination })
    dispatch({
      type: updateActiveStep,
      payload: payload,
    })
  }

  const navigateFlowRightButton = (values: any) => {
    switch (activePage) {
      case 'Trap Status':
        if (values?.trapStatus === 'Trap stopped functioning') {
          navigateHelper('Non Functional Trap', 9)
        } else if (values?.flowMeasure > 1000) {
          navigateHelper('High Flows', 7)
        } else if (values?.waterTemperature > 30) {
          navigateHelper('High Temperatures', 8)
        }
        break
      case 'Fish Processing':
        if (values?.fishProcessedResult === 'No fish were caught') {
          navigateHelper('No Fish Caught', 10)
        }
        break
      case 'High Flows':
        navigateHelper('End Trapping', 11)
        break
      case 'High Temperatures':
        navigateHelper('Fish Processing', 4)
        break
      default:
        console.log('default navigation')
        break
    }
  }

  const navigateFlowLeftButton = () => {
    switch (activePage) {
      case 'High Flows':
        navigateHelper('Trap Status', 2)
        break
      case 'High Temperatures':
        navigateHelper('Trap Status', 2)
        break
      case 'Non Functional Trap':
        navigateHelper('Trap Status', 2)
        break
      case 'No Fish Caught':
        navigateHelper('Fish Processing', 4)
        break
      default:
        console.log('default navigation')
        break
    }
  }

  const handleRightButton = () => {
    //if function truthy, submit form to check for errors and save to redux
    if (handleSubmit) {
      handleSubmit()
    }
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
    return (
      //**temp conditional for fish input**

      //if current screen uses formik && if form has first NOT been touched
      // OR
      //if current screen uses formik && there are errors
      (activePage !== 'Fish Input' &&
        touched &&
        Object.keys(touched).length === 0) ||
      (errors && Object.keys(errors).length > 0)
    )
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
      case 'High Temperatures':
        buttonText = 'Move on to Fish Processing'
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
          rounded='xs'
          borderRadius='5'
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
          height='20'
          rounded='xs'
          bg='primary'
          alignSelf='flex-start'
          width='5%'
          borderRadius='5'
          shadow='5'
          onPress={() => console.log('🚀 ~ reduxState', reduxState)}
        >
          <Text fontWeight='bold' color='white'>
            redux state
          </Text>
        </Button>
        <Button
          alignSelf='flex-start'
          bg='primary'
          width='45%'
          height='20'
          rounded='xs'
          borderRadius='5'
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
