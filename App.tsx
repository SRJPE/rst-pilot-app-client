import 'react-native-gesture-handler'
import AppContainer from './src'
import MainDrawerNavigator from './src/navigators/MainDrawerNavigator'
import { connectToDevTools } from 'react-devtools-core'

if (__DEV__) {
  connectToDevTools({
    host: 'localhost',
    port: 8097,
  })
}

export default function App() {
  return (
    <AppContainer>
      <MainDrawerNavigator />
    </AppContainer>
  )
}
