import { VStack } from 'native-base'
import CreateNewProgramStackNavigator from '../navigators/CreateNewProgramNavigation'

export default function CreateNewProgram({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      <CreateNewProgramStackNavigator />
    </VStack>
  )
}
