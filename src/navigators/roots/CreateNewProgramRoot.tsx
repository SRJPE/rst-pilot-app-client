import { VStack } from 'native-base'
import CreateNewProgramStackNavigator from '../CreateNewProgramStackNavigator'

export default function CreateNewProgram({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      <CreateNewProgramStackNavigator />
    </VStack>
  )
}
