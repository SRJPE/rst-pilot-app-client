import { createStackNavigator } from '@react-navigation/stack'
import { Button } from 'native-base'
// import { FormStackParamList } from '../../../types/'
import FishInput from '../FishInput/FishInput'
import FishProcessing from '../FishProcessing/FishProcessing'
import VisitSetup from '../VisitSetup/VisitSetup'
import TrapStatus from '../TrapStatus/TrapStatus'
import TrapOperations from '../TrapOperations/TrapOperations'
import HighFlows from '../TrapStatus/HighFlows'
import HighTemperatures from '../TrapStatus/HighTemperatures'
import ProgressStepperHeader from './ProgressStepperHeader'

const FormStack = createStackNavigator()

export default function FormStackNavigation() {
  return (
    <FormStack.Navigator initialRouteName='Visit Setup'>
      <FormStack.Screen
        name='Visit Setup'
        component={VisitSetup}
        options={{ headerTitle: props => <ProgressStepperHeader {...props} /> }}
      />
      <FormStack.Screen name='Trap Status' component={TrapStatus} />
      <FormStack.Screen name='Trap Operations' component={TrapOperations} />
      <FormStack.Screen name='Fish Input' component={FishInput} />
      <FormStack.Screen name='Fish Processing' component={FishProcessing} />
      <FormStack.Group screenOptions={{ presentation: 'modal' }}>
        <FormStack.Screen name='High Flows' component={HighFlows} />
        <FormStack.Screen
          name='High Temperatures'
          component={HighTemperatures}
        />
      </FormStack.Group>
    </FormStack.Navigator>
  )
}
