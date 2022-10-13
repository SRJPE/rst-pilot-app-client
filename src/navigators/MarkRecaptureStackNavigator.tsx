import { createStackNavigator } from '@react-navigation/stack'
import ReleaseTrial from '../screens/markRecapture/releaseTrial'

import StartMarkRecapture from '../screens/markRecapture/StartMarkRecapture'

const MarkRecapture = createStackNavigator()

export default function MarkRecaptureStackNavigator() {
  return (
    <MarkRecapture.Navigator
      initialRouteName='Visit Setup'
      screenOptions={{ headerShown: false }}
      // screenOptions={{ header: props => <ProgressHeader {...props} /> }}
    >
      <MarkRecapture.Screen name='Release Trial' component={ReleaseTrial} />
    </MarkRecapture.Navigator>
  )
}
