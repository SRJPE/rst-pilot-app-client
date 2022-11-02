import { createStackNavigator } from '@react-navigation/stack'
import FishInput from '../screens/formScreens/fishInput'
import FishProcessing from '../screens/formScreens/fishProcessing'
import VisitSetup from '../screens/formScreens/visitSetup'
import TrapStatus from '../screens/formScreens/trapStatus'
import HighFlows from '../screens/formScreens/navigationFlowWarnings/HighFlows'
import HighTemperatures from '../screens/formScreens/navigationFlowWarnings/HighTemperatures'
import ProgressHeader from '../components/formContainer/ProgressHeader'
import NonFunctionalTrap from '../screens/formScreens/navigationFlowWarnings/NonFunctionalTrap'
import NoFishCaught from '../screens/formScreens/navigationFlowWarnings/NoFishCaught'
import EndTrapping from '../screens/formScreens/endTrapping'
import IncompleteSections from '../screens/formScreens/incompleteSections'
import StartMarkRecapture from '../screens/markRecapture/StartMarkRecapture'
import TrapPreProcessing from '../screens/formScreens/trapOperations/TrapPreProcessing'
import TrapPostProcessing from '../screens/formScreens/trapOperations/TrapPostProcessing'
import AddFishModalContent from '../components/form/AddFishContent'
import { useSelector } from 'react-redux'

const FormStack = createStackNavigator()

export default function FormStackNavigation() {
  const fishInputModalOpen = useSelector(
    (state: any) => state.fishInput.modalOpen
  )
  return (
    <FormStack.Navigator
      initialRouteName='Visit Setup'
      screenOptions={{ header: props => <ProgressHeader {...props} /> }}
    >
      <FormStack.Screen name='Visit Setup' component={VisitSetup} />
      <FormStack.Screen name='Trap Status' component={TrapStatus} />
      <FormStack.Screen
        name='Trap Pre-Processing'
        component={TrapPreProcessing}
      />
      <FormStack.Screen name='Fish Processing' component={FishProcessing} />
      <FormStack.Screen
        name='Fish Input'
        component={FishInput}
        options={{ headerShown: fishInputModalOpen ? false : true }}
      />
      <FormStack.Screen
        name='Trap Post-Processing'
        component={TrapPostProcessing}
      />
      <FormStack.Screen name='High Flows' component={HighFlows} />
      <FormStack.Screen name='High Temperatures' component={HighTemperatures} />
      <FormStack.Screen
        name='Non Functional Trap'
        component={NonFunctionalTrap}
      />
      <FormStack.Screen name='No Fish Caught' component={NoFishCaught} />
      <FormStack.Screen name='End Trapping' component={EndTrapping} />
      <FormStack.Screen
        name='Add Fish'
        component={AddFishModalContent}
        options={{ headerShown: false }}
      />
      <FormStack.Screen
        name='Incomplete Sections'
        component={IncompleteSections}
      />
      <FormStack.Screen
        name='Start Mark Recapture'
        component={StartMarkRecapture}
        options={{ headerShown: false }}
      />
    </FormStack.Navigator>
  )
}
