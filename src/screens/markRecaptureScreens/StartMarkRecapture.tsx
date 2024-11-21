import { Button, Heading, Text, View, VStack } from 'native-base'
import { CommonActions, useNavigation } from '@react-navigation/native'

export default function StartMarkRecapture({
  navigation,
}: {
  navigation: any
}) {
  const navigationTest = useNavigation() as any
  const handlePressBeginMarkRecapture = () => {
    navigation.navigateDeprecated('Mark Recapture')
  }
  const handlePressReturnToHomepage = () => {
    //temp
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Visit Setup' }],
      })
    )

    navigation.getParent().dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Trap Visit Form',
            state: {
              routes: [
                {
                  name: 'Visit Setup',
                },
              ],
            },
          },
        ],
      })
    )
    navigation.getParent().navigate('Home')
  }
  const handlePressQCData = () => {
    navigation.navigate('Quality Control')
  }

  return (
    <>
      <View flex={1} justifyContent='center' alignItems='center' bg='#FFF'>
        <VStack space={12} p='10'>
          <Heading textAlign='center' mb='10'>
            {'Are you ready to start mark recapture trial?'}
          </Heading>
          <Button
            bg='primary'
            rounded='xs'
            alignSelf='center'
            py='5'
            minWidth='50%'
            borderRadius='5'
            onPress={handlePressBeginMarkRecapture}
          >
            <Text fontWeight='bold' fontSize='lg' color='#FFF'>
              Begin Mark Recapture
            </Text>
          </Button>
          <Button
            bg='primary'
            rounded='xs'
            alignSelf='center'
            py='5'
            minWidth='50%'
            borderRadius='5'
            onPress={handlePressReturnToHomepage}
          >
            <Text fontWeight='bold' fontSize='lg' color='#FFF'>
              Return To Homepage
            </Text>
          </Button>
          <Button
            bg='primary'
            rounded='xs'
            alignSelf='center'
            py='5'
            minWidth='50%'
            borderRadius='5'
            onPress={handlePressQCData}
          >
            <Text fontWeight='bold' fontSize='lg' color='#FFF'>
              QC Data
            </Text>
          </Button>
        </VStack>
      </View>
    </>
  )
}
