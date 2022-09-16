import { Provider as ReduxProvider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { NativeBaseProvider } from 'native-base'
import theme from './styles/theme'
import { store } from './redux/store'

type Props = {
  children: React.ReactNode
}

export default function AppContainer(props: Props) {
  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <NativeBaseProvider theme={theme}>{props.children}</NativeBaseProvider>
      </NavigationContainer>
    </ReduxProvider>
  )
}
