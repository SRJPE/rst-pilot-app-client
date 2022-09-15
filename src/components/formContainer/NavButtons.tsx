import { useCallback } from 'react'
import { Box, HStack, Text, Button } from 'native-base'
import { goForward, goBack } from '../../services/utils'
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native'

export default function NavButtons({ navigation }: { navigation: any }) {
  const route: RouteProp<ParamListBase, string> = useRoute()

  /* eslint-disable */
  // eslint-disable-next-line
  const currentPage = route?.params?.screen //?????
  /* eslint-enable */

  const handleBack = useCallback(() => {
    navigation.navigate('Trap Visit Form', { screen: goBack(currentPage) })
  }, [currentPage])
  const handleNext = useCallback(() => {
    navigation.navigate('Trap Visit Form', { screen: goForward(currentPage) })
  }, [currentPage])

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
