import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Text,
  View,
  VStack,
} from 'native-base'
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
      <View flex={1} justifyContent='center' alignItems='center'>
        <VStack space={10} p='10'>
          <Heading textAlign='center'>
            {
              'Please refer to monitoring protocols to \n safely handle the trap.'
            }
          </Heading>
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
          <Button
            rounded='xs'
            bg='primary'
            alignSelf='center'
            py='3'
            px='16'
            borderRadius='5'
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
          <NavButtons
            navigation={navigation}
            // handleSubmit={handleSubmit}
            // errors={errors}
            // touched={touched}
            // validation={validateForm(values)}
          />
        </VStack>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}
