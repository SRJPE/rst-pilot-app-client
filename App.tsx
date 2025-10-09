import './gesture-handler'
import '@/global.css'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import AppContainer from './src'
import MainDrawerNavigator from './src/navigators/MainDrawerNavigator'
import { useTokenAutoRefresh } from './src/utils/hooks/useTokenAutoRefresh'

export default function App() {
  useTokenAutoRefresh()

  return (
    <GluestackUIProvider mode='light'>
      <AppContainer>
        <MainDrawerNavigator />
      </AppContainer>
    </GluestackUIProvider>
  )
}
