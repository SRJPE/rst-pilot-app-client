import { Button, Heading, Image, Text, View, VStack } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function HighFlows() {
  const handlePressViewMonitoringProtocols = () => {
    console.log('🚀 ~ pressed')
  }

  return (
    <View flex={1} justifyContent='center' alignItems='center'>
      <VStack space={10} p='10'>
        <Heading textAlign='center'>
          {'Temperatures are high. Please process and \n release fish first. '}
        </Heading>
        <Image
          alignSelf='center'
          source={require('../../../../assets/warning.png')}
          alt='Warning Icon'
          size='2xl'
        />
        <Button
          rounded='xs'
          bg='primary'
          alignSelf='center'
          py='3'
          px='16'
          borderRadius='5'
          onPress={handlePressViewMonitoringProtocols}
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='#FFFFFF'
          >
            View Monitoring Protocols
          </Text>
        </Button>
      </VStack>
    </View>
  )
}
