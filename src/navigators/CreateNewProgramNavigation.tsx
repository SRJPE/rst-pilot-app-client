import { createStackNavigator } from '@react-navigation/stack'

import CreateNewProgramHome from '../screens/accountScreens/CreateNewProgramHome'
import TrappingProtocols from '../screens/accountScreens/TrappingProtocols'
import CrewMembers from '../screens/accountScreens/CrewMembers'

const CreateNewProgram = createStackNavigator()

export default function CreateNewProgramStackNavigator() {
  return (
    <CreateNewProgram.Navigator
      initialRouteName='Create New Program Home'
      screenOptions={{ headerShown: false }}
    >
      <CreateNewProgram.Screen
        name='Create New Program Home'
        component={CreateNewProgramHome}
      />
      <CreateNewProgram.Screen
        name='Trapping Protocols'
        component={TrappingProtocols}
      />
      <CreateNewProgram.Screen name='Crew Members' component={CrewMembers} />
    </CreateNewProgram.Navigator>
  )
}
