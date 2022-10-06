import { Box, HStack, Text, Button } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/navigationSlice'
import { useEffect } from 'react'

export default function NavButtons({
  navigation,
  handleSubmit,
  errors,
  touched,
  values,
  validation,
}: {
  navigation?: any
  handleSubmit?: any
  errors?: any
  touched?: any
  values?: any
  validation?: any
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
          navigateHelper('Non Functional Trap', 8)
        } else if (values?.flowMeasure > 1000) {
          navigateHelper('High Flows', 6)
        } else if (values?.waterTemperature > 30) {
          navigateHelper('High Temperatures', 7)
        }
        break
      case 'Fish Processing':
        if (values?.fishProcessed === 'No fish were caught') {
          navigateHelper('No Fish Caught', 9)
        }
        break
      case 'High Flows':
        navigateHelper('End Trapping', 10)
        break
      case 'High Temperatures':
        navigateHelper('Fish Processing', 4)
        break
      default:
        console.log('default')
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
        console.log('default')
        break
    }
  }

  const handleRightButton = () => {
    //if function truthy, submit form to check for errors and save to redux
    if (handleSubmit) {
      handleSubmit()
    }
    //if form has not been touched OR there are errors => return out, otherwise navigate
    if (
      (touched && Object.keys(touched).length === 0) ||
      (errors && Object.keys(errors).length > 0)
    ) {
      return
    } else {
      navigation.navigate('Trap Visit Form', {
        screen: navigationState.steps[activeStep + 1]?.name,
      })
      dispatch({
        type: updateActiveStep,
        payload: navigationState.activeStep + 1,
      })
      //navigate various flows
      navigateFlowRightButton(values)
    }
  }

  const handleLeftButton = () => {
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
    //navigate various flows
    navigateFlowLeftButton()
  }

  const renderButtonText = (activePage: string) => {
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
    <Box bg='themeGrey' py='6' px='3' maxWidth='100%'>
      <HStack justifyContent='space-evenly'>
        <Button
          rounded='xs'
          bg='secondary'
          alignSelf='flex-start'
          width='1/3'
          borderRadius='5'
          shadow='5'
          isDisabled={activePage === 'Visit Setup'}
          onPress={handleLeftButton}
        >
          <Text fontSize='sm' fontWeight='bold' color='primary'>
            Back
          </Text>
        </Button>
        <Button
          rounded='xs'
          bg='primary'
          alignSelf='flex-start'
          // py='3'
          width='1/4'
          borderRadius='5'
          shadow='5'
          onPress={() => console.log('🚀 ~ reduxState', reduxState)}
        >
          <Text fontSize='sm' fontWeight='bold' color='white'>
            redux state
          </Text>
        </Button>
        <Button
          rounded='xs'
          bg='primary'
          alignSelf='flex-start'
          width='1/3'
          borderRadius='5'
          shadow='5'
          // isDisabled={}
          onPress={handleRightButton}
        >
          <Text fontSize='sm' fontWeight='bold' color='white'>
            {renderButtonText(activePage)}
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}
