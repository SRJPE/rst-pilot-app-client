import { createDrawerNavigator } from '@react-navigation/drawer'
import * as SecureStore from 'expo-secure-store'
import { connect } from 'react-redux'
import DrawerMenu from '../components/drawerMenu'
import { RootState } from '../redux/store'
import GenerateReport from '../screens/GenerateReport'
import Home from '../screens/Home'
import PermitInfo from '../screens/PermitInfo'
import SignIn from '../screens/SignIn'
import Profile from '../screens/accountScreens/Profile'
import InputTurbidity from '../screens/miscScreens/InputTurbidity'
import MarkRecaptureForm from './roots/MarkRecaptureFormRoot'
import MonitoringProgram from './roots/MonitoringProgramRoot'
import QCForm from './roots/QCFormRoot'
import TrapVisitForm from './roots/TrapVisitFormRoot'
import InspectorWindow from '../screens/InspectorWindow'
import PendingTrapVisits from '../screens/PendingTrapVisits'
import ImportTrapVisit from '../screens/ImportTrapVisit'
import React from 'react'
import type { InitialStateI as UserCredentialStopeProps } from '../redux/reducers/userCredentialsSlice'
import Genetics from '../screens/miscScreens/Genetics'
const Drawer = createDrawerNavigator()

// Proactive token refresh on reconnect used to live here, racing
// independently against axiosConfig.ts's interceptor-level refresh (and
// onStartupProvider.tsx's own now-removed copy of this same call) with no
// shared lock. Removed: axiosConfig.ts's interceptor already refreshes
// lazily on demand via the shared lock in authUtils.refreshUserToken, and
// connectionChanged already guarantees a real API call fires on every
// reconnect while a user is logged in.
const DrawerNavigator = ({
  userCredentialsStore,
}: {
  userCredentialsStore: UserCredentialStopeProps
}) => {
  return (
    <Drawer.Navigator
      // initialRouteName='Sign In'
      // initialRouteName='Home'
      screenOptions={{ drawerType: 'front' }}
      drawerContent={(props: any) => <DrawerMenu {...props} />}
    >
      {/*       
      UN-COMMENT THIS CODE TO REACTIVATE NAV AUTH REQUIREMENT  */}

      {!userCredentialsStore.azureUid ? (
        <Drawer.Screen
          name='Sign In'
          component={SignIn}
          options={{
            headerShown: false,
            swipeEnabled: false,
          }}
        />
      ) : (
        <>
          <Drawer.Screen
            name='Home'
            component={Home}
            options={{ headerShown: false, swipeEnabled: true }}
          />
          <Drawer.Screen name='Profile' component={Profile} />
          <Drawer.Screen name='Permit Info' component={PermitInfo} />
          <Drawer.Screen name='Generate Report' component={GenerateReport} />
          <Drawer.Screen name='Quality Control' component={QCForm} />
          <Drawer.Screen name='Inspector' component={InspectorWindow} />
          <Drawer.Screen
            name='Pending Trap Visits'
            component={PendingTrapVisits}
          />
          <Drawer.Screen name='Import Trap Visit' component={ImportTrapVisit} />
          <Drawer.Screen name='Mark Recapture' component={MarkRecaptureForm} />
          <Drawer.Screen name='Trap Visit Form' component={TrapVisitForm} />
          <Drawer.Screen
            name='Monitoring Program'
            component={MonitoringProgram}
          />
          <Drawer.Screen name='Input Turbidity' component={InputTurbidity} />
          <Drawer.Screen name='Genetics' component={Genetics} />
        </>
      )}
    </Drawer.Navigator>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    userCredentialsStore: state.userCredentials,
  }
}
export default connect(mapStateToProps)(DrawerNavigator)
