import { createDrawerNavigator } from '@react-navigation/drawer'
// import { RootStackParamList } from './types'
import DrawerMenu from './DrawerMenu'
import Home from '../screens/home'
import TrapVisitForm from '../screens/trapVisitForm'
import GenerateReport from '../screens/generateReport'
import DataQualityControl from '../screens/QCData'

const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      screenOptions={{ drawerType: 'front' }}
      drawerContent={props => <DrawerMenu {...props} />}
    >
      <Drawer.Screen
        name='Home'
        component={Home}
        options={{ headerShown: false }}
      />
      <Drawer.Screen name='Generate Report' component={GenerateReport} />
      <Drawer.Screen
        name='Data Quality Control'
        component={DataQualityControl}
      />
      <Drawer.Screen name='Trap Visit Form' component={TrapVisitForm} />
    </Drawer.Navigator>
  )
}
