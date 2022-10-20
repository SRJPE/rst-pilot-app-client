import { createStackNavigator } from '@react-navigation/stack'
import ReleaseDataEntry from '../screens/markRecapture/releaseDataEntry'
import ReleaseTrial from '../screens/markRecapture/releaseTrial'

const MarkRecapture = createStackNavigator()

export default function MarkRecaptureStackNavigator() {
  return (
    <MarkRecapture.Navigator
      initialRouteName='Release Trial'
      screenOptions={{ headerShown: false }}
      // screenOptions={{ header: props => <ProgressHeader {...props} /> }}
    >
      <MarkRecapture.Screen name='Release Trial' component={ReleaseTrial} />
      <MarkRecapture.Screen
        name='Release Data Entry'
        component={ReleaseDataEntry}
      />
    </MarkRecapture.Navigator>
  )
}
