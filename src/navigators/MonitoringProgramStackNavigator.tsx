import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import MonitoringProgramHome from '../screens/accountScreens/MonitoringProgramHome'
import CreateNewProgram from './roots/CreateNewProgramRoot'
import MonitoringProgramExisting from '../screens/accountScreens/MonitoringProgramExisting'
import MonitoringProgramNew from '../screens/accountScreens/MonitoringProgramNew'
import MonitoringProgramJoined from '../screens/accountScreens/MonitoringProgramJoined'
import MonitoringProgramNewCopy from '../screens/accountScreens/MonitoringProgramNewCopy'

const MonitoringProgram = createStackNavigator()

export default function MonitoringProgramStackNavigator() {
  return (
    <MonitoringProgram.Navigator
      initialRouteName='Monitoring Program Home'
      screenOptions={{ headerShown: false }}
    >
      <MonitoringProgram.Screen
        name='Monitoring Program Home'
        component={MonitoringProgramHome}
      />
      <MonitoringProgram.Screen
        name='Monitoring Program Existing'
        component={MonitoringProgramExisting}
      />
      <MonitoringProgram.Screen
        name='Monitoring Program New'
        component={MonitoringProgramNew}
      />
      <MonitoringProgram.Screen
        name='Monitoring Program New Copy'
        component={MonitoringProgramNewCopy}
      />
      <MonitoringProgram.Screen
        name='Monitoring Program Joined'
        component={MonitoringProgramJoined}
      />
      <MonitoringProgram.Screen
        name='Create New Program'
        component={CreateNewProgram}
      />
    </MonitoringProgram.Navigator>
  )
}
