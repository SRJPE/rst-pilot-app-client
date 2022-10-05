import { Text, View, VStack } from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'

export default function EndTrapping({ navigation }: { navigation: any }) {
  return (
    <VStack space={10} flex={1} justifyContent='center' alignItems='center'>
      <Text fontSize='lg'>End Trapping Placeholder</Text>
      <NavButtons navigation={navigation} />
    </VStack>
  )
}
