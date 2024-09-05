import { createDrawerNavigator } from '@react-navigation/drawer'
import { useNavigationState } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import { connect, useDispatch } from 'react-redux'
import DrawerMenu from '../components/drawerMenu'
import { AppDispatch, RootState } from '../redux/store'
import GenerateReport from '../screens/GenerateReport'
import Home from '../screens/Home'
import PermitInfo from '../screens/PermitInfo'
import SignIn from '../screens/SignIn'
import Profile from '../screens/accountScreens/Profile'
import MarkRecaptureForm from './roots/MarkRecaptureFormRoot'
import MonitoringProgram from './roots/MonitoringProgramRoot'
import QCForm from './roots/QCFormRoot'
import TrapVisitForm from './roots/TrapVisitFormRoot'
import InspectorWindow from '../screens/InspectorWindow'
import { refreshUserToken } from '../utils/authUtils'
import { useEffect } from 'react'
import { setForcedLogoutModalOpen } from '../redux/reducers/userAuthSlice'

const Drawer = createDrawerNavigator()

const DrawerNavigator = ({
  userCredentialsStore,
}: {
  userCredentialsStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const currentRouteIndex = useNavigationState(state => state?.index)

  const isSignInScreen = currentRouteIndex === 0

  useEffect(() => {
    !isSignInScreen &&
      refreshUserToken(dispatch).then(tokenRefreshed => {
        if (!tokenRefreshed) {
          dispatch(setForcedLogoutModalOpen(true))
        } else {
          console.log(
            '🚀 ~ file: MainDrawerNavigator.tsx:42 ~ Tokens refreshed from main drawer navigation provider'
          )
        }
      })
  }, [isSignInScreen])

  async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key)
    if (result) {
      return result
    } else {
      console.log('No values stored under that key.')
      return null
    }
  }

  return (
    <Drawer.Navigator
      initialRouteName='Sign In'
      // initialRouteName='Home'
      screenOptions={{ drawerType: 'front' }}
      drawerContent={props => <DrawerMenu {...props} />}
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
          <Drawer.Screen name='Mark Recapture' component={MarkRecaptureForm} />
          <Drawer.Screen name='Trap Visit Form' component={TrapVisitForm} />
          <Drawer.Screen
            name='Monitoring Program'
            component={MonitoringProgram}
          />
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
