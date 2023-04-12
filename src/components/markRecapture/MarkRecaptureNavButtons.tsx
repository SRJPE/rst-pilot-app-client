import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { Ionicons } from '@expo/vector-icons'
import { updateActiveMarkRecaptureStep } from '../../redux/reducers/markRecaptureSlices/markRecaptureNavigationSlice'

export default function MarkRecaptureNavButtons({
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
  const navigationState = useSelector(
    (state: any) => state.markRecaptureNavigation
  )
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  const reduxState = useSelector((state: any) => state)

  const handleRightButton = () => {
    //   //if function truthy, submit form to check for errors and save to redux
    if (handleSubmit) {
      handleSubmit()
    }
    //if Mark Recapture complete go to QA and return
    if (activePage === 'Mark Recapture Complete') {
      navigation.navigate('Data Quality Control')
      return
    }
    //navigate Right
    navigation.navigate('Mark Recapture', {
      screen: navigationState.steps[activeStep + 1]?.name,
    })
    dispatch({
      type: updateActiveMarkRecaptureStep,
      payload: navigationState.activeStep + 1,
    })
  }

  const handleLeftButton = () => {
    //   //navigate back to home screen from visit setup screen
    if (activePage === 'Release Trial') {
      navigation.navigate('Home')
      return
    }

    //   //if function truthy, submit form to save to redux
    if (handleSubmit) {
      handleSubmit()
    }
    //navigate left
    navigation.navigate('Mark Recapture', {
      screen: navigationState.steps[activeStep - 1]?.name,
    })
    dispatch({
      type: updateActiveMarkRecaptureStep,
      payload: navigationState.activeStep - 1,
    })
  }

  const disableRightButton = () => {
    return (
      //if current screen uses formik && if form has first NOT been touched
      // OR
      //if current screen uses formik && there are errors
      (touched && Object.keys(touched).length === 0) ||
      (errors && Object.keys(errors).length > 0)
    )
  }

  const renderRightButtonText = (activePage: string) => {
    let buttonText
    switch (activePage) {
      case 'Mark Recapture Complete':
        buttonText = 'QC Data'
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
            activePage === 'Release Trial' ? (
              <Icon as={Ionicons} name='home' size='lg' color='primary' />
            ) : (
              <></>
            )
          }
          onPress={handleLeftButton}
        >
          <Text fontSize='xl' fontWeight='bold' color='primary'>
            {activePage === 'Release Trial' ? 'Return Home' : 'Back'}
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
          // isDisabled={disableRightButton()}
          onPress={handleRightButton}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            {renderRightButtonText(activePage) as string}
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}
