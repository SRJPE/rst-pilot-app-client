import { VStack } from 'native-base'
import FormStackNavigation from '../FormStackNavigation'

export default function TrapVisitForm({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      <FormStackNavigation />
    </VStack>
  )
}
