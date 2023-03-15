import { createStackNavigator } from '@react-navigation/stack'

import CreateNewProgramHome from '../screens/accountScreens/CreateNewProgramHome'

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
    </CreateNewProgram.Navigator>
  )
}
