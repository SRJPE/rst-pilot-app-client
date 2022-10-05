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
          console.log('inside')
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
    if ([6, 7, 8].includes(activeStep)) {
      //return to trap status flow if on warning screen
      navigateHelper('Trap Status', 2)
    } else if (activeStep === 9) {
      //return to Fish Processing if on no fish caught screen
      navigateHelper('Fish Processing', 4)
    }
  }

  const handleRightButton = () => {
    //if function truthy, submit form to check for errors and save to redux
    if (handleSubmit) {
      handleSubmit()
    }

    //navigate various flows
    navigateFlowRightButton(values)

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
    //if function truthy, submit form to save to redux
    if (handleSubmit) {
      handleSubmit()
    }
    if ([6, 7, 8].includes(activeStep)) {
      //return to trap status flow if on a warning screen
      navigateHelper('Trap Status', 2)
    } else if (activeStep === 9) {
      //return to Fish Processing if on no fish caught screen
      navigateHelper('Fish Processing', 4)
    } else {
      navigation.navigate('Trap Visit Form', {
        screen: navigationState.steps[activeStep - 1]?.name,
      })
      dispatch({
        type: updateActiveStep,
        payload: navigationState.activeStep - 1,
      })
    }
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

// //trap status  flow
// if (values?.trapStatus === 'Trap stopped functioning') {
//   navigateHelper('Non Functional Trap', 8)
// } else if (values?.flowMeasure > 1000) {
//   navigateHelper('High Flows', 6)
// } else if (values?.waterTemperature > 30) {
//   navigateHelper('High Temperatures', 7)
// }
// //fish processing flow
// else if (values?.fishProcessed === 'No fish were caught') {
//   console.log('inside')
//   navigateHelper('No Fish Caught', 9)
// }

// //if on Hgh Temp warning page, continue to fish processing
// else if (activeStep === 7) {
//   navigateHelper('Fish Processing', 4)
// }
// //if on High Flow warning page, continue to end trapping
// else if (activeStep === 6) {
//   navigateHelper('End Trapping', 10)
// }
// console.log('🚀 ~ navigateFlowRightButton ~ fishProcessed', values)
