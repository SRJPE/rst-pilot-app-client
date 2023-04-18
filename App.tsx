import 'react-native-gesture-handler'
import AppContainer from './src'
import MainDrawerNavigator from './src/navigators/MainDrawerNavigator'

export default function App() {
  return (
    <AppContainer>
      <MainDrawerNavigator />
    </AppContainer>
  )
}
