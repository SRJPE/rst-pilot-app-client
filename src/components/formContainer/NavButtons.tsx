import { useCallback, useEffect } from 'react'
import { Box, HStack, Text, Button } from 'native-base'
import { goForward, goBack } from '../../services/utils'
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/navigationSlice'

export default function NavButtons({
  navigation,
  handleSubmit,
}: {
  navigation: any
  handleSubmit: Function
}) {
  const route: RouteProp<ParamListBase, string> = useRoute()
  // @ts-ignore-next-line
  const currentPage = route?.params?.screen
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)

  const handleSave = () => {
    console.log('save-placeholder')

    handleSubmit()
  }

  const handleRightButton = useCallback(() => {
    if (currentPage === ' Non Functional Trap' || currentPage === 'HighFlows') {
      navigation.navigate('Trap Visit Form', { screen: 'End Trapping' })
      return
    }
    handleSave()
    navigation.navigate('Trap Visit Form', { screen: goForward(currentPage) })
    dispatch({
      type: updateActiveStep,
      payload: navigationState.activeStep + 1,
    })
  }, [currentPage])

  const handleLeftButton = useCallback(() => {
    navigation.navigate('Trap Visit Form', { screen: goBack(currentPage) })
    if (navigationState.activeStep !== 1)
      dispatch({
        type: updateActiveStep,
        payload: navigationState.activeStep - 1,
      })
  }, [currentPage])

  const renderButtonText = (currentPage: string) => {
    let buttonText
    if (currentPage === 'HighFlows' || currentPage === 'Non Functional Trap') {
      buttonText = 'End Trapping'
    } else if (currentPage === 'High Temperatures') {
      buttonText = 'Move on to Fish Processing'
    } else {
      buttonText = 'Next'
    }
    return buttonText
  }
  const isDisabled = (currentPage: string) => {
    return currentPage === 'Visit Setup' ||
      currentPage === 'High Flows' ||
      currentPage === 'High Temperatures' ||
      currentPage === 'Non Functional Trap'
      ? true
      : false
  }

  console.log('🚀 ~ NavButtons ~ currentPage', currentPage)
  console.log('🚀 ~ NavButtons ~ navigationState', navigationState)

  return (
    <Box bg='themeGrey' py='5' px='3' maxWidth='100%'>
      <HStack justifyContent='space-between'>
        <Button
          rounded='xs'
          bg='secondary'
          alignSelf='flex-start'
          py='3'
          px='125'
          borderRadius='5'
          isDisabled={isDisabled(currentPage)}
          onPress={handleLeftButton}
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='primary'
          >
            Back
          </Text>
        </Button>
        <Button
          rounded='xs'
          bg='primary'
          alignSelf='flex-start'
          py='3'
          px='125'
          borderRadius='5'
          onPress={handleRightButton}
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='white'
          >
            {renderButtonText(currentPage)}
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}
