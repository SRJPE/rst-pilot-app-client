import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './components/Home/Home'
import DrawerNavigator from './components/TrapVisitForm/DrawerNavigator'
import TrapVisitForm from './components/TrapVisitForm/FormContainer/TrapVisitForm'

const Stack = createNativeStackNavigator()

export default function Navigator() {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Trap Visit Data Entry' component={TrapVisitForm} />

      <Stack.Screen name='DrawerNavigator' component={DrawerNavigator} />
    </Stack.Navigator>
  )
}
