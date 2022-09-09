import { createDrawerNavigator } from '@react-navigation/drawer'
// import { RootStackParamList } from './types'
import Sidebar from './components/Sidebar/SideBar'
import Home from './components/Home/Home'
import TrapVisitForm from './components/TrapVisitForm/FormContainer/TrapVisitForm'
import GenerateReport from './components/GenerateReport/GenerateReport'
import DataQualityControl from './components/QCData/DataQualityControl'
import FishInput from './components/TrapVisitForm/FishInput/FishInput'
import FishProcessing from './components/TrapVisitForm/FishProcessing/FishProcessing'
import VisitSetup from './components/TrapVisitForm/VisitSetup/VisitSetup'
import TrapStatus from './components/TrapVisitForm/TrapStatus/TrapStatus'
import TrapOperations from './components/TrapVisitForm/TrapOperations/TrapOperations'
import HighFlows from './components/TrapVisitForm/TrapStatus/HighFlows'
import HighTemperatures from './components/TrapVisitForm/TrapStatus/HighTemperatures'

const Drawer = createDrawerNavigator()

export default function Navigator() {
  return (
    <Drawer.Navigator
      initialRouteName='Home'
      screenOptions={{}}
      drawerContent={props => <Sidebar {...props} />}
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
    </Drawer.Navigator>
  )
}
