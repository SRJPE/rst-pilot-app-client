import { KeyboardAvoidingView, Text, View, VStack } from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'

export default function ReleaseDataEntry({ navigation }: { navigation: any }) {
  return (
    <>
      <View flex={1} bg='themeGrey'>
        <VStack space={8} p='10'></VStack>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}
