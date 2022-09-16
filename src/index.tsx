import { Provider as ReduxProvider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'
import theme from './styles/theme'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

type Props = {
  children: React.ReactNode
}

export default function AppContainer(props: Props) {
  return (
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <NativeBaseProvider theme={theme}>
            {props.children}
          </NativeBaseProvider>
        </NavigationContainer>
      </PersistGate>
    </ReduxProvider>
  )
}
