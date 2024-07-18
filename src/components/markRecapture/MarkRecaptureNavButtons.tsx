import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { Ionicons } from '@expo/vector-icons'
import {
  resetMarkRecapSlice,
  updateActiveMarkRecaptureStep,
} from '../../redux/reducers/markRecaptureSlices/markRecaptureNavigationSlice'
import { useRoute } from '@react-navigation/native'
import { reset } from '../../redux/reducers/postSlices/trapVisitFormPostBundler'

export default function MarkRecaptureNavButtons({
  navigation,
  handleSubmit,
  errors,
  touched,
  values,
  clearFormValues,
}: {
  navigation?: any
  handleSubmit?: any
  errors?: any
  touched?: any

  values?: any
  clearFormValues?: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector(
    (state: any) => state.markRecaptureNavigation
  )
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  // const activePage = useRoute()

  const handleRightButton = () => {
    //   //if function truthy, submit form to check for errors and save to redux
    if (handleSubmit) {
      handleSubmit()
    }
    //if Mark Recapture complete lear form values and go to QA and return

    if (activePage === 'Mark Recapture Complete') {
      clearFormValues && clearFormValues()
      navigation.navigate('Quality Control')
      navigation.reset({
        index: 0,
        routes: [{ name: 'Release Trial' }],
      })
      dispatch(resetMarkRecapSlice())
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
    //navigate back to home screen from visit setup screen or Mark Recapture Complete screen
    if (activePage === 'Release Trial') {
      navigation.navigate('Home')
      return
    }
    if (activePage === 'Mark Recapture Complete') {
      clearFormValues && clearFormValues()
      navigation.reset({
        index: 0,
        routes: [{ name: 'Release Trial' }],
      })
      navigation.navigate('Home')
      dispatch(resetMarkRecapSlice())
      return
    }

    //   //if function truthy, submit form to save to redux
    if (handleSubmit && activePage !== 'Release Data Entry') {
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
      case 'Release Data Entry':
        buttonText = 'Save'
        break
      default:
        buttonText = 'Next'
        break
    }
    return buttonText
  }
  const renderHomeButton =
    activePage === 'Release Trial' || activePage === 'Mark Recapture Complete'

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
            renderHomeButton ? (
              <Icon as={Ionicons} name='home' size='lg' color='primary' />
            ) : (
              <></>
            )
          }
          onPress={handleLeftButton}
        >
          <Text fontSize='xl' fontWeight='bold' color='primary'>
            {renderHomeButton ? 'Return Home' : 'Back'}
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
            {renderRightButtonText(activePage) as string}
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}
