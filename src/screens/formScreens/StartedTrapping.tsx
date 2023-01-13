import { Heading, Image, View, VStack } from 'native-base'
import NavButtons from '../../components/formContainer/NavButtons'

export default function StartedTrapping({ navigation }: { navigation: any }) {
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
          <Image
            alignSelf='center'
            source={require('../../../assets/checkmark_outline.png')}
            alt='Warning Icon'
            size='2xl'
            color='themeGrey'
          />
          <Heading textAlign='center'>
            {
              'Looks like you just dropped your cone to start trapping. Please check the trap every 24 hours while running.'
            }
          </Heading>
        </VStack>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}
