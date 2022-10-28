import { Button, Heading, Icon, Text, View, VStack } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import NavButtons from '../../../components/formContainer/NavButtons'

export default function NonFunctionalTrap({ navigation }: { navigation: any }) {
  const handlePressViewMonitoringProtocols = () => {
    console.log('🚀 ~ pressed')
  }
  const handlePressCallTeamLead = () => {
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
              'Please refer to monitoring protocols to \n safely handle the trap.'
            }
          </Heading>
          <Button
            rounded='xs'
            bg='primary'
            alignSelf='center'
            py='5'
            px='16'
            borderRadius='5'
            isDisabled={true}
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
          <Button
            rounded='xs'
            bg='primary'
            alignSelf='center'
            py='5'
            px='16'
            borderRadius='5'
            isDisabled={true}
            onPress={handlePressCallTeamLead}
            leftIcon={<Icon as={Ionicons} name='call' size='sm' />}
          >
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontWeight='bold'
              color='#FFFFFF'
            >
              Call Team Lead
            </Text>
          </Button>
        </VStack>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}
