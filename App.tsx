import React from 'react'
import { NativeBaseProvider, Box } from 'native-base'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import theme from './NativeBaseTheme'

import Home from './src/components/home/Home'
import TrapVisitForm from './src/components/form/TrapVisitForm'
import NativeBaseBoxDemo from './src/components/form/NativeBaseBoxDemo'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen
            name='Trap Visit Data Entry'
            component={TrapVisitForm}
          />
          <Stack.Screen name='Native Box Demo' component={NativeBaseBoxDemo} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  )
}
