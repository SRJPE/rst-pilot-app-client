import { createStackNavigator } from '@react-navigation/stack'

import CreateNewProgramHome from '../screens/accountScreens/CreateNewProgramHome'
import TrappingSites from '../screens/accountScreens/TrappingSites'
import CrewMembers from '../screens/accountScreens/CrewMembers'
import EfficiencyTrialProtocols from '../screens/accountScreens/EfficiencyTrialProtocols'
import PermitInformation from '../screens/accountScreens/PermitInformation'
import PermittingInformationInput from '../screens/accountScreens/PermittingInformationInput'
import TrappingProtocols from '../screens/accountScreens/TrappingProtocols'
import TrappingProtocolsTable from '../screens/accountScreens/TrappingProtocolsTable'
import HatcheryInformation from '../screens/accountScreens/HatcheryInformation'

const CreateNewProgram = createStackNavigator()

export default function CreateNewProgramStackNavigator() {
  return (
    <CreateNewProgram.Navigator
      initialRouteName='Create New  Program Home'
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
      <CreateNewProgram.Screen name='Crew Members' component={CrewMembers} />
      <CreateNewProgram.Screen
        name='Efficiency Trial Protocols'
        component={EfficiencyTrialProtocols}
      />
      <CreateNewProgram.Screen
        name='Hatchery Information'
        component={HatcheryInformation}
      />
      <CreateNewProgram.Screen
        name='Trapping Protocols Table'
        component={TrappingProtocolsTable}
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
