import { Button, Heading, Image, Text, View, VStack } from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'

export default function HighFlows({ navigation }: { navigation: any }) {
  const handlePressViewMonitoringProtocols = () => {
    console.log('🚀 ~ pressed')
  }

  return (
    <>
      <View
        flex={1}
        justifyContent='center'
        alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <VStack space={12} p='10'>
          <Heading textAlign='center'>
            {
              'Temperatures are high. Please process and \n release fish first. '
            }
          </Heading>
          <Image
            alignSelf='center'
            source={require('../../../assets/warning.png')}
            alt='Warning Icon'
            size='2xl'
          />
          <Button
            rounded='xs'
            bg='primary'
            alignSelf='center'
            py='5'
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
      <NavButtons navigation={navigation} />
    </>
  )
}
