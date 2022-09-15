import { VStack } from 'native-base'
import NavButtons from '../../components/formContainer/NavButtons'
import FormTabNavigation from '../../navigators/FormStackNavigation'

export default function TrapVisitForm({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      {/* <ProgressStepper /> */}
      <FormTabNavigation />
      <NavButtons navigation={navigation} />
    </VStack>
  )
}
