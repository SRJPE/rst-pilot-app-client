import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'

// import Sidebar from './Sidebar'
import FishInput from './FishInput/FishInput'
import FishProcessing from './FishProcessing/FishProcessing'
import VisitSetup from './VisitSetup/VisitSetup'
import TrapVisitForm from './FormContainer/TrapVisitForm'

const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName='VisitSetup'
      // drawerContent={props => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        overlayColor: '#00000000',
      }}
    >
      <Drawer.Screen name='TrapVisitForm' component={TrapVisitForm} />
      <Drawer.Screen name='VisitSetup' component={VisitSetup} />
      <Drawer.Screen name='FishInput' component={FishInput} />
      <Drawer.Screen name='FishProcessing' component={FishProcessing} />
    </Drawer.Navigator>
  )
}
