import { VStack } from 'native-base'
import MonitoringProgramStackNavigator from '../MonitoringProgramStackNavigator'

export default function MonitoringProgram({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      <MonitoringProgramStackNavigator />
    </VStack>
  )
}
