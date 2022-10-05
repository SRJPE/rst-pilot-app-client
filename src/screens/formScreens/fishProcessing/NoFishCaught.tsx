import { Button, Heading, Icon, Image, Text, View, VStack } from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'

export default function NoFishCaught({ navigation }: { navigation: any }) {
  return (
    <View flex={1} justifyContent='center' alignItems='center'>
      <VStack space={10} p='10'>
        <Image
          alignSelf='center'
          source={require('../../../assets/checkmark_outline.png')}
          alt='Warning Icon'
          size='2xl'
          color='themeGrey'
        />
        <Heading textAlign='center'>
          {
            'Looks like there are no fish in the RST today. \n Please reset the trap.'
          }
        </Heading>
        <NavButtons
          navigation={navigation}
          // handleSubmit={handleSubmit}
          // errors={errors}
          // touched={touched}
          // validation={validateForm(values)}
        />
      </VStack>
    </View>
  )
}
