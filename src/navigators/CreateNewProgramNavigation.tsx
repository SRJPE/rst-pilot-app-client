import { createStackNavigator } from '@react-navigation/stack'

import CreateNewProgramHome from '../screens/accountScreens/createNewProgram/CreateNewProgramHome'
import TrappingSites from '../screens/accountScreens/createNewProgram/TrappingSites'
import CrewMembers from '../screens/accountScreens/createNewProgram/CrewMembers'
import EfficiencyTrialProtocols from '../screens/accountScreens/createNewProgram/EfficiencyTrialProtocols'
import TrappingProtocols from '../screens/accountScreens/createNewProgram/TrappingProtocols'
import PermitInformation from '../screens/accountScreens/createNewProgram/PermitInformation'
import PermittingInformationInput from '../screens/accountScreens/createNewProgram/PermittingInformationInput'
import MultipleTraps from '../screens/accountScreens/createNewProgram/MultipleTraps'

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
        name='Trapping Sites'
        component={TrappingSites}
      />
      <CreateNewProgram.Screen
        name='Multiple Traps'
        component={MultipleTraps}
      />
      <CreateNewProgram.Screen name='Crew Members' component={CrewMembers} />
      <CreateNewProgram.Screen
        name='Efficiency Trial Protocols'
        component={EfficiencyTrialProtocols}
      />
      <CreateNewProgram.Screen
        name='Trapping Protocols'
        component={TrappingProtocols}
      />
      <CreateNewProgram.Screen
        name='Permit Information'
        component={PermitInformation}
      />
      <CreateNewProgram.Screen
        name='Permitting Information Input'
        component={PermittingInformationInput}
      />
    </CreateNewProgram.Navigator>
  )
}
