import { Box, HStack, Text, Button } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/navigationSlice'

export default function NavButtons({
  navigation,
  handleSubmit,
  errors,
  touched,
  values,
}: // validation,
{
  navigation?: any
  handleSubmit?: any
  errors?: any
  touched?: any
  values?: any
  // validation: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  const reduxState = useSelector((state: any) => state)

  const navigateFlow = (values: any) => {
    if (values?.trapStatus === 'Trap stopped functioning') {
      navigation.navigate('Trap Visit Form', {
        screen: 'Non Functional Trap',
      })
      dispatch({
        type: updateActiveStep,
        payload: 8,
      })
    } else if (values?.flowMeasure > 1000) {
      navigation.navigate('Trap Visit Form', { screen: 'High Flows' })
      dispatch({
        type: updateActiveStep,
        payload: 6,
      })
    } else if (values?.waterTemperature > 30) {
      navigation.navigate('Trap Visit Form', { screen: 'High Temperatures' })
      dispatch({
        type: updateActiveStep,
        payload: 7,
      })
    }
  }

  const handleRightButton = () => {
    // console.log('🚀 ~ handleRightButton ~ values', values)
    if (activeStep === 7) return
    navigateFlow(values)

    // console.log('🚀 ~ touched form Form', touched)
    // console.log('🚀 ~ errors from Form', errors)
    //submit form to check for errors
    handleSubmit()
    //if form has not been touched OR there are errors => return out, otherwise navigate
    if (Object.keys(touched).length === 0 || Object.keys(errors).length > 0) {
      return
    } else {
      navigation.navigate('Trap Visit Form', {
        screen: navigationState.steps[activeStep + 1]?.name,
      })
      dispatch({
        type: updateActiveStep,
        payload: navigationState.activeStep + 1,
      })
    }
  }

  const handleLeftButton = () => {
    // console.log('🚀 ~ handleLeftButton ~ validation', validation)
    handleSubmit()

    navigation.navigate('Trap Visit Form', {
      screen: navigationState.steps[activeStep - 1]?.name,
    })
    dispatch({
      type: updateActiveStep,
      payload: navigationState.activeStep - 1,
    })
  }

  const renderButtonText = (activePage: string) => {
    let buttonText
    if (activePage === 'HighFlows' || activePage === 'Non Functional Trap') {
      buttonText = 'End Trapping'
    } else if (activePage === 'High Temperatures') {
      buttonText = 'Move on to Fish Processing'
    } else {
      buttonText = 'Next'
    }
    return buttonText
  }

  const isDisabled = (activePage: string) => {
    return activePage === 'Visit Setup' ||
      activePage === 'High Flows' ||
      activePage === 'High Temperatures' ||
      activePage === 'Non Functional Trap'
      ? true
      : false
  }

  return (
    <Box bg='themeGrey' py='5' px='3' maxWidth='100%'>
      <HStack justifyContent='space-between'>
        <Button
          rounded='xs'
          bg='secondary'
          alignSelf='flex-start'
          py='3'
          width='30%'
          borderRadius='5'
          isDisabled={isDisabled(activePage)}
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
          py='3'
          width='10%'
          borderRadius='5'
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
          py='3'
          width='30%'
          borderRadius='5'
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
