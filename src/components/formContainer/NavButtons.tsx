import { useCallback, useEffect, useState } from 'react'
import { Box, HStack, Text, Button } from 'native-base'
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import {
  updateActiveStep,
  markStepCompleted,
} from '../../redux/reducers/navigationSlice'

export default function NavButtons({
  navigation,
  handleSubmit,
}: {
  navigation: any
  handleSubmit: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  // console.log('🚀 ~ NavButtons ~ activePage', activePage)

  const reduxState = useSelector((state: any) => state)

  const handleRightButton = () => {
    handleSubmit()
    // if (navigationState.activeStep === 2) {
    //   console.log('STEP 2')
    //   // navigateFlow(trapStatusState.values)
    // }
    navigation.navigate('Trap Visit Form', {
      screen: navigationState.steps[activeStep + 1]?.name,
    })

    //only make this dispatch if the navigation state needs to be updated

    dispatch({
      type: updateActiveStep,
      payload: navigationState.activeStep + 1,
    })
  }
  const handleLeftButton = () => {
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
    } else if (activePage === 'Trap Status') {
      buttonText = 'trap Status'
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
          // isDisabled={isDisabled(activePage)}
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
