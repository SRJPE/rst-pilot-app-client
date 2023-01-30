import { Provider as ReduxProvider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'
import theme from './styles/theme'
import { persistor, store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import OnStartupProvider from './redux/onStartupProvider'
import SlideAlertProvider from './redux/slideAlertProvider'
import { Provider as PaperProvider } from 'react-native-paper'

type Props = {
  children: React.ReactNode
}

export default function AppContainer(props: Props) {
  return (
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <NativeBaseProvider theme={theme}>
            <PaperProvider>
              <SlideAlertProvider>
                <OnStartupProvider>{props.children}</OnStartupProvider>
              </SlideAlertProvider>
            </PaperProvider>
          </NativeBaseProvider>
        </NavigationContainer>
      </PersistGate>
    </ReduxProvider>
  )
}
