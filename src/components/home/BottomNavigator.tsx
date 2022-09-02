import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TrapVisitForm from '../TrapVisitForm/FormContainer/TrapVisitForm'
import Home from './Home'

const Tab = createBottomTabNavigator()

export default function BottomNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={Home} />
      <Tab.Screen name='Settings' component={TrapVisitForm} />
      {/* <Tab.Screen name='Settings' component={SettingsScreen} /> */}
    </Tab.Navigator>
  )
}
