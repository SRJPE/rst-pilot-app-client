import React from 'react'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'
import FishInput from '../FishInput/FishInput'
import FishProcessing from '../FishProcessing/FishProcessing'
import VisitSetup from '../VisitSetup/VisitSetup'
import TrapStatus from '../TrapStatus/TrapStatus'
import { FormTabParamList } from '../../../types/'

const FormTab = createMaterialTopTabNavigator<FormTabParamList>()

export default function FormTabNavigation() {
  return (
    <FormTab.Navigator
      screenOptions={{
        swipeEnabled: false,
      }}
    >
      <FormTab.Screen name='Visit Setup' component={VisitSetup} />
      <FormTab.Screen name='Trap Status' component={TrapStatus} />
      <FormTab.Screen name='Fish Input' component={FishInput} />
      <FormTab.Screen name='Fish Processing' component={FishProcessing} />
    </FormTab.Navigator>
  )
}
