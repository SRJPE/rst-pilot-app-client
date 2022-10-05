import { Button, Heading, Icon, Image, Text, View, VStack } from 'native-base'
import Ionicons from '@expo/vector-icons/Ionicons'
import NavButtons from '../../../components/formContainer/NavButtons'

export default function HighFlows() {
  const handlePressCallTeamLead = () => {
    console.log('🚀 ~ pressed')
  }
  const handlePressTakePhoto = () => {
    console.log('🚀  ~ pressed')
  }
  return (
    <View flex={1} justifyContent='center' alignItems='center'>
      <VStack space={10} p='10'>
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
        <Button
          rounded='xs'
          bg='primary'
          alignSelf='center'
          py='3'
          px='20'
          borderRadius='5'
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
      <NavButtons
      // navigation={navigation}
      // handleSubmit={handleSubmit}
      // errors={errors}
      // touched={touched}
      // validation={validateForm(values)}
      />
    </View>
  )
}
