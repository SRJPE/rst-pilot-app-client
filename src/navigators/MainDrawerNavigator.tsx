import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerMenu from '../components/drawerMenu'
import Home from '../screens/Home'
import TrapVisitForm from './roots/TrapVisitFormRoot'
import GenerateReport from '../screens/GenerateReport'
import MarkRecaptureForm from './roots/MarkRecaptureFormRoot'
import Profile from '../screens/accountScreens/Profile'
import PermitInfo from '../screens/PermitInfo'
import SignIn from '../screens/SignIn'
import { connect } from 'react-redux'
import { RootState } from '../redux/store'
import QCForm from './roots/QCFormRoot'
import MonitoringProgram from './roots/MonitoringProgramRoot'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'

const Drawer = createDrawerNavigator()

const DrawerNavigator = ({
  storedCredentialsStore,
}: {
  storedCredentialsStore: any
}) => {
  console.log('🚀  ~ storedCredentialsStore:', storedCredentialsStore)
  const [currentUserAccessToken, setCurrentUserAccessToken] = useState(
    null as string | null
  )

  async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key)
    if (result) {
      return result
    } else {
      console.log('No values stored under that key.')
      return null
    }
  }

  useEffect(() => {
    ;(async () => {
      await SecureStore.deleteItemAsync('userAccessToken')
      // const user = await getValueFor('userAccessToken')
      // console.log('🚀 ~ ; ~TEST user:', user)
      // setCurrentUserAccessToken(user)
    })()
  }, [])

  useEffect(() => {
    console.log('🚀 ~ currentUserAccessToken:', currentUserAccessToken)
  }, [currentUserAccessToken])
  return (
    <Drawer.Navigator
      initialRouteName='Sign In'
      // initialRouteName='Home'
      screenOptions={{ drawerType: 'front' }}
      drawerContent={(props) => <DrawerMenu {...props} />}
    >
      {/*       
      UN-COMMENT THIS CODE TO REACTIVATE NAV AUTH REQUIREMENT  */}

      {/* {storedCredentialsStore === null ? ( */}
      {currentUserAccessToken === null ? (
        <Drawer.Screen
          name='Sign In'
          component={SignIn}
          options={{
            headerShown: false,
            swipeEnabled: true,
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
    storedCredentialsStore: state.userCredentials.storedCredentials,
  }
}
export default connect(mapStateToProps)(DrawerNavigator)
