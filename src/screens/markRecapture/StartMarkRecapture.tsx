import { Button, Heading, Text, View, VStack } from 'native-base'

export default function StartMarkRecapture({
  navigation,
}: {
  navigation: any
}) {
  const handlePressBeginMarkRecapture = () => {
    navigation.navigate('Mark Recapture')
  }
  const handlePressReturnToHomepage = () => {
    navigation.navigate('Home')
  }
  const handlePressQCData = () => {
    console.log('🚀 ~ pressed')
    navigation.navigate('Data Quality Control')
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
            bg='secondary'
            rounded='xs'
            alignSelf='center'
            py='5'
            minWidth='50%'
            borderRadius='5'
            onPress={handlePressReturnToHomepage}
          >
            <Text fontWeight='bold' fontSize='lg' color='primary'>
              Return To Homepage
            </Text>
          </Button>
          <Button
            bg='secondary'
            rounded='xs'
            alignSelf='center'
            py='5'
            minWidth='50%'
            borderRadius='5'
            onPress={handlePressQCData}
          >
            <Text fontWeight='bold' fontSize='lg' color='primary'>
              QC Data
            </Text>
          </Button>
        </VStack>
      </View>
    </>
  )
}
