import { VStack } from 'native-base'
import NavButtons from '../../components/formContainer/NavButtons'
import FormStackNavigation from '../../navigators/FormStackNavigation'

export default function TrapVisitForm({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      <FormStackNavigation />
    </VStack>
  )
}
