import { KeyboardAvoidingView, Text, View, VStack } from 'native-base'
import NavButtons from '../../components/formContainer/NavButtons'
import MarkRecaptureNavButtons from '../../components/markRecapture/MarkRecaptureNavButtons'

export default function ReleaseDataEntry({ navigation }: { navigation: any }) {
  return (
    <>
      <View flex={1} bg='themeGrey'>
        <VStack space={8} p='10'>
          <Text>TEST RELEASE DATA ENTRY</Text>
        </VStack>
      </View>
      <MarkRecaptureNavButtons navigation={navigation} />
    </>
  )
}
