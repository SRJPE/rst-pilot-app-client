import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import {
  checkIfFormIsComplete,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'

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
  const stepsArray = Object.values(navigationState.steps).slice(0, 6)
  const isFormComplete = navigationState.isFormComplete
  // console.log('🚀 ~ isFormComplete', isFormComplete)

  // useEffect(() => {
  //   dispatch(checkIfFormIsComplete())
  // }, [])

  // const trapVisitIsIncomplete = false as boolean
  // const [trapVisitIsIncomplete, setTrapVisitIsIncomplete] = useState(
  //   true as boolean
  // )

  // useEffect(() => {
  //   console.log(
  //     'TEST',
  //     stepsArray.some((step: any) => {
  //       console.log('step: ', step.name, step.completed)
  //       step.completed === false
  //     })
  //   )
  //   //   console.log('🚀 ~ trapVisitIsIncomplete', trapVisitIsIncomplete)
  //   setTrapVisitIsIncomplete(
  //     //if any of the steps are not completed => return false
  //     !stepsArray.some((step: any) => {
  //       console.log('step: ', step.name, step.completed)
  //       step.completed === false
  //     })
  //   )
  // }, [stepsArray])

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
          navigateHelper('Non Functional Trap', 11)
        } else if (values?.flowMeasure > 1000) {
          navigateHelper('High Flows', 9)
        } else if (values?.waterTemperature > 30) {
          navigateHelper('High Temperatures', 10)
        }
        break
      case 'Fish Processing':
        if (values?.fishProcessedResult === 'No fish were caught') {
          navigateHelper('No Fish Caught', 12)
        }
        break
      case 'High Flows':
        navigateHelper('End Trapping', 9)
        break
      case 'High Temperatures':
        navigateHelper('Trap Pre-Processing', 3)
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
    if (activePage === 'Incomplete Sections') {
      //if form is complete, then do not disable button
      // return isFormComplete ? false : true
    } else {
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
