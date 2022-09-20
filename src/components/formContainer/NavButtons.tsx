import { useCallback, useEffect } from 'react'
import { Box, HStack, Text, Button } from 'native-base'
import { goForward, goBack } from '../../services/utils'
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { updateActiveStep } from '../../redux/reducers/navigationSlice'

export default function NavButtons({ navigation }: { navigation: any }) {
  const route: RouteProp<ParamListBase, string> = useRoute()
  // @ts-ignore-next-line
  const currentPage = route?.params?.screen
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)

  const handleSave = () => {
    console.log('dev-saved')
  }

  const handleNext = useCallback(() => {
    handleSave()
    navigation.navigate('Trap Visit Form', { screen: goForward(currentPage) })
    dispatch({
      type: updateActiveStep,
      payload: navigationState.activeStep + 1,
    })
  }, [currentPage])

  const handleBack = useCallback(() => {
    navigation.navigate('Trap Visit Form', { screen: goBack(currentPage) })
    if (navigationState.activeStep !== 1)
      dispatch({
        type: updateActiveStep,
        payload: navigationState.activeStep - 1,
      })
  }, [currentPage])

  console.log('🚀 ~ NavButtons ~ navigationState', navigationState)

  return (
    <Box bg='themeGrey' py='5' px='3' maxWidth='100%'>
      <HStack justifyContent='space-between'>
        <Button
          rounded='xs'
          bg='secondary'
          alignSelf='flex-start'
          py='3'
          px='175'
          borderRadius='5'
          onPress={handleBack}
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
          px='175'
          borderRadius='5'
          onPress={handleNext}
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='white'
          >
            Next
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}
