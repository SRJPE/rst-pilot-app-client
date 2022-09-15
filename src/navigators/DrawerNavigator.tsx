import { createDrawerNavigator } from '@react-navigation/drawer'
// import { RootStackParamList } from './types'
import DrawerMenu from './DrawerMenu'
import Home from '../screens/home'
import TrapVisitForm from '../screens/trapVisitForm'
import GenerateReport from '../screens/generateReport'
import DataQualityControl from '../screens/QCData'
import FishInput from '../screens/formScreens/fishInput'
import FishProcessing from '../screens/formScreens/fishProcessing'
import VisitSetup from '../screens/formScreens/visitSetup'
import TrapStatus from '../screens/formScreens/trapStatus'
import TrapOperations from '../screens/formScreens/trapOperations'
import HighFlows from '../screens/formScreens/trapStatus/HighFlows'
import HighTemperatures from '../screens/formScreens/trapStatus/HighTemperatures'
import NonFunctionalTrap from '../screens/formScreens/trapStatus/NonFunctionalTrap'

const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      drawerContent={props => <DrawerMenu {...props} />}
    >
      <Drawer.Screen name='Home' component={Home} />
      <Drawer.Screen name='Generate Report' component={GenerateReport} />
      <Drawer.Screen
        name='Data Quality Control'
        component={DataQualityControl}
      />
      <Drawer.Screen name='Trap Visit Form' component={TrapVisitForm} />
      <Drawer.Screen name='Visit Setup' component={VisitSetup} />
      <Drawer.Screen name='Trap Status' component={TrapStatus} />
      <Drawer.Screen name='Trap Operations' component={TrapOperations} />
      <Drawer.Screen name='Fish Input' component={FishInput} />
      <Drawer.Screen name='Fish Processing' component={FishProcessing} />
      <Drawer.Screen name='High Flows' component={HighFlows} />
      <Drawer.Screen name='High Temperatures' component={HighTemperatures} />
      <Drawer.Screen name='Non Functional Trap' component={NonFunctionalTrap} />
    </Drawer.Navigator>
  )
}
