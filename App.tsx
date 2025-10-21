import './gesture-handler'
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import AppContainer from './src'
import MainDrawerNavigator from './src/navigators/MainDrawerNavigator'

export default function App() {
  return (
    <GluestackUIProvider mode="light"><AppContainer>
        <MainDrawerNavigator />
      </AppContainer></GluestackUIProvider>
  );
}
