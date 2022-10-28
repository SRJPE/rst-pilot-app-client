import { Text, View } from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'

export default function EndTrapping({ navigation }: { navigation: any }) {
  return (
    <>
      <View
        flex={1}
        justifyContent='center'
        alignItems='center'
        borderColor='themeGrey'
        borderWidth='15'
      >
        <Text fontSize='lg'>End Trapping Placeholder</Text>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}
