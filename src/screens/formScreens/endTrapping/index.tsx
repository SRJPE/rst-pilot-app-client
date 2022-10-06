import { Text, View, VStack } from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'

export default function EndTrapping({ navigation }: { navigation: any }) {
  return (
    <>
      <View flex={1} justifyContent='center' alignItems='center'>
        <Text fontSize='lg'>End Trapping Placeholder</Text>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}
