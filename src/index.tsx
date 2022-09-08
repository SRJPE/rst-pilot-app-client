import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamList } from './types'
import Home from './components/Home/Home'
import TrapVisitForm from './components/TrapVisitForm/FormContainer/TrapVisitForm'
import GenerateReport from './components/GenerateReport/GenerateReport'
import DataQualityControl from './components/QCData/DataQualityControl'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function Navigator() {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Generate Report' component={GenerateReport} />
      <Stack.Screen name='Trap Visit Form' component={TrapVisitForm} />
      <Stack.Screen
        name='Data Quality Control'
        component={DataQualityControl}
      />
    </Stack.Navigator>
  )
}
