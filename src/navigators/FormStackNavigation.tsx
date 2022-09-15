import { createStackNavigator } from '@react-navigation/stack'
import { Button } from 'native-base'
// import { FormStackParamList } from '../../../types/'
import FishInput from '../screens/formScreens/fishInput'
import FishProcessing from '../screens/formScreens/fishProcessing'
import VisitSetup from '../screens/formScreens/visitSetup'
import TrapStatus from '../screens/formScreens/trapStatus'
import TrapOperations from '../screens/formScreens/trapOperations'
import HighFlows from '../screens/formScreens/trapStatus/HighFlows'
import HighTemperatures from '../screens/formScreens/trapStatus/HighTemperatures'
import ProgressStepperHeader from '../components/formContainer/ProgressStepperHeader'
import NonFunctionalTrap from '../screens/formScreens/trapStatus/NonFunctionalTrap'

const FormStack = createStackNavigator()

export default function FormStackNavigation() {
  return (
    <FormStack.Navigator initialRouteName='Visit Setup'>
      <FormStack.Screen
        name='Visit Setup'
        component={VisitSetup}
        options={{
          // headerTitle: props => <ProgressStepperHeader {...props} />,
          header: props => <ProgressStepperHeader {...props} />,
        }}
      />
      <FormStack.Screen
        name='Trap Status'
        component={TrapStatus}
        options={{
          // headerTitle: props => <ProgressStepperHeader {...props} />,
          header: props => <ProgressStepperHeader {...props} />,
        }}
      />
      <FormStack.Screen
        name='Trap Operations'
        component={TrapOperations}
        options={{
          // headerTitle: props => <ProgressStepperHeader {...props} />,
          header: props => <ProgressStepperHeader {...props} />,
        }}
      />
      <FormStack.Screen
        name='Fish Input'
        component={FishInput}
        options={{
          header: props => <ProgressStepperHeader {...props} />,
        }}
      />
      <FormStack.Screen
        name='Fish Processing'
        component={FishProcessing}
        options={{
          header: props => <ProgressStepperHeader {...props} />,
        }}
      />
      <FormStack.Group screenOptions={{ presentation: 'modal' }}>
        <FormStack.Screen name='High Flows' component={HighFlows} />
        <FormStack.Screen
          name='High Temperatures'
          component={HighTemperatures}
        />
        <FormStack.Screen
          name='Non Functional Trap'
          component={NonFunctionalTrap}
        />
      </FormStack.Group>
    </FormStack.Navigator>
  )
}
