import { createStackNavigator } from '@react-navigation/stack'
// import { FormStackParamList } from '../../../types/'
import FishInput from '../screens/formScreens/fishInput'
import FishProcessing from '../screens/formScreens/fishProcessing'
import VisitSetup from '../screens/formScreens/visitSetup'
import TrapStatus from '../screens/formScreens/trapStatus'
import TrapOperations from '../screens/formScreens/trapOperations'
import HighFlows from '../screens/formScreens/trapStatus/HighFlows'
import HighTemperatures from '../screens/formScreens/trapStatus/HighTemperatures'
import ProgressHeader from '../components/formContainer/ProgressHeader'
import NonFunctionalTrap from '../screens/formScreens/trapStatus/NonFunctionalTrap'
import EndTrapping from '../screens/formScreens/endTrapping'

const FormStack = createStackNavigator()

export default function FormStackNavigation() {
  return (
    <FormStack.Navigator
      initialRouteName='Visit Setup'
      screenOptions={{ header: props => <ProgressHeader {...props} /> }}
    >
      <FormStack.Screen name='Visit Setup' component={VisitSetup} />
      <FormStack.Screen name='Trap Status' component={TrapStatus} />
      <FormStack.Screen name='Trap Operations' component={TrapOperations} />
      <FormStack.Screen name='Fish Input' component={FishInput} />
      <FormStack.Screen name='Fish Processing' component={FishProcessing} />
      <FormStack.Screen name='High Flows' component={HighFlows} />
      <FormStack.Screen name='High Temperatures' component={HighTemperatures} />
      <FormStack.Screen
        name='Non Functional Trap'
        component={NonFunctionalTrap}
      />
      <FormStack.Screen name='End Trapping' component={EndTrapping} />
    </FormStack.Navigator>
  )
}
