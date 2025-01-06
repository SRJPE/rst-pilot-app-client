import { registerRootComponent } from 'expo'

import App from './App'
import { LogBox } from 'react-native'
LogBox.ignoreLogs(['Warning: ...']) // Ignore log notification by message
LogBox.ignoreAllLogs() //Ignore all log notifications

//optimization for react navigation
import { enableScreens } from 'react-native-screens'
enableScreens()

console.disableYellowBox = true

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
