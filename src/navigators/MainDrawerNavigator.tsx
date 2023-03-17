import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerMenu from '../components/drawerMenu'
import Home from '../screens/Home'
import TrapVisitForm from './roots/TrapVisitFormRoot'
import GenerateReport from '../screens/GenerateReport'
import DataQualityControl from '../screens/QCData'
import MarkRecaptureForm from './roots/MarkRecaptureFormRoot'
import CreateNewProgram from './roots/CreateNewProgramRoot'
import Profile from '../screens/accountScreens/Profile'
import PermitInfo from '../screens/PermitInfo'
import SignIn from '../screens/SignIn'
import { connect } from 'react-redux'
import { RootState } from '../redux/store'

const Drawer = createDrawerNavigator()

const DrawerNavigator = ({
  storedCredentialsStore,
}: {
  storedCredentialsStore: any
}) => {
  return (
    <Drawer.Navigator
      initialRouteName='Sign In'
      screenOptions={{ drawerType: 'front' }}
      drawerContent={(props) => <DrawerMenu {...props} />}
    >
      {storedCredentialsStore === null ? (
        <Drawer.Screen
          name='Sign In'
          component={SignIn}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Drawer.Screen
            name='Home'
            component={Home}
            // options={{ headerShown: false }}
          />
          <Drawer.Screen name='Profile' component={Profile} />
          <Drawer.Screen name='Permit Info' component={PermitInfo} />
          <Drawer.Screen name='Generate Report' component={GenerateReport} />
          <Drawer.Screen
            name='Data Quality Control'
            component={DataQualityControl}
          />
          <Drawer.Screen name='Mark Recapture' component={MarkRecaptureForm} />
          <Drawer.Screen name='Trap Visit Form' component={TrapVisitForm} />
          <Drawer.Screen
            name='Create New Program'
            component={CreateNewProgram}
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
