import { createStackNavigator } from '@react-navigation/stack'
import GenerateReportHome from '../screens/reportScreens/GenerateReportHome'
import ShareReport from '../screens/reportScreens/ShareReport'

const MarkRecapture = createStackNavigator()

export default function GenerateReportStackNavigator() {
  return (
    <MarkRecapture.Navigator
      initialRouteName='Generate Report Home'
      screenOptions={{ headerShown: false }}
    >
      <MarkRecapture.Screen
        name='Generate Report Home'
        component={GenerateReportHome}
      />
      <MarkRecapture.Screen name='Share Report' component={ShareReport} />
    </MarkRecapture.Navigator>
  )
}
