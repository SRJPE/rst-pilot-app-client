import React from 'react'
import { INativebaseConfig, NativeBaseProvider, Box } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import theme from './NativeBaseTheme'
import Home from './src/components/Home/Home'
import TrapVisitForm from './src/components/TrapVisitForm/FormContainer/TrapVisitForm'

const config: INativebaseConfig = {
  // rest of the config keys like dependencies can go here
  strictMode: 'warn',
}

;<NativeBaseProvider config={config}>
  <App />
</NativeBaseProvider>

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NativeBaseProvider theme={theme} config={config}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen
            name='Trap Visit Data Entry'
            component={TrapVisitForm}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}
