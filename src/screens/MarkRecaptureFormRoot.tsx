import { VStack } from 'native-base'
import MarkRecaptureStackNavigator from '../navigators/MarkRecaptureStackNavigator'

export default function MarkRecaptureForm({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      <MarkRecaptureStackNavigator />
    </VStack>
  )
}
