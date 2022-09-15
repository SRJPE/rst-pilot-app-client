import 'react-native-gesture-handler'
import AppContainer from './src/'
import DrawerNavigator from './src/navigators/DrawerNavigator'

export default function App() {
  return (
    <AppContainer>
      <DrawerNavigator />
    </AppContainer>
  )
}
