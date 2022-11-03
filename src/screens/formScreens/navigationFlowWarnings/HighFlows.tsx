import { Button, Heading, Icon, Image, Text, View, VStack } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import NavButtons from '../../../components/formContainer/NavButtons'

export default function HighFlows({ navigation }: { navigation: any }) {
  const handlePressCallTeamLead = () => {
    console.log('🚀 ~ pressed')
  }
  const handlePressTakePhoto = () => {
    console.log('🚀  ~ pressed')
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
              'Flow is high and unsafe. Please remove your \n trap from the water.'
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
          <Button
            rounded='xs'
            bg='primary'
            alignSelf='center'
            py='5'
            px='20'
            borderRadius='5'
            isDisabled={true}
            onPress={handlePressTakePhoto}
            leftIcon={<Icon as={Ionicons} name='camera' size='sm' />}
          >
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontWeight='bold'
              color='#FFFFFF'
            >
              Take Photo
            </Text>
          </Button>
        </VStack>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}
