import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FishInput from '../screens/formScreens/FishInput'
import { useSelector } from 'react-redux'
import FishProcessing from '../screens/formScreens/FishProcessing'
import VisitSetup from '../screens/formScreens/VisitSetup'
import TrapOperations from '../screens/formScreens/TrapOperations'
import HighFlows from '../screens/formScreens/navigationFlowWarnings/HighFlows'
import HighTemperatures from '../screens/formScreens/navigationFlowWarnings/HighTemperatures'
import ProgressHeader from '../components/formContainer/ProgressHeader'
import NonFunctionalTrap from '../screens/formScreens/navigationFlowWarnings/NonFunctionalTrap'
import NoFishCaught from '../screens/formScreens/navigationFlowWarnings/NoFishCaught'
import EndTrapping from '../screens/formScreens/EndTrapping'
import IncompleteSections from '../screens/formScreens/IncompleteSections'
import StartMarkRecapture from '../screens/markRecaptureScreens/StartMarkRecapture'
import TrapPostProcessing from '../screens/formScreens/TrapPostProcessing'
import AddFish from '../screens/formScreens/AddFish'
import PaperEntry from '../screens/formScreens/PaperEntry'
import StartedTrapping from '../screens/formScreens/StartedTrapping'
import BatchCount from '../screens/formScreens/BatchCount'
import { VStack } from 'native-base'
import FishHolding from '../screens/formScreens/FishHolding'
import TabBar from '../components/form/TabBar'
import LoadingScreen from '../components/Shared/LoadingScreen'

const FormStack = createNativeStackNavigator()

function FormStackNavigation() {
  const fishInputModalOpen = useSelector(
    (state: any) => state.fishInput.modalOpen
  )

  return (
    <FormStack.Navigator
      initialRouteName='Visit Setup'
      screenOptions={{
        header: (props) => (
          <VStack>
            <ProgressHeader {...props} />
            <TabBar headerProps={props} />
          </VStack>
        ),
      }}
    >
      <FormStack.Screen
        name='Loading...'
        component={LoadingScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <FormStack.Screen name='Visit Setup' component={VisitSetup} />
      <FormStack.Screen name='Trap Operations' component={TrapOperations} />
      <FormStack.Screen name='Fish Processing' component={FishProcessing} />
      <FormStack.Screen
        name='Fish Input'
        component={FishInput}
        options={{ headerShown: fishInputModalOpen ? false : true }}
      />
      <FormStack.Screen
        name='Add Fish'
        component={AddFish}
        options={{ headerShown: false }}
      />
      <FormStack.Screen
        name='Batch Count'
        component={BatchCount}
        options={{ headerShown: false }}
      />
      <FormStack.Screen
        name='Trap Post-Processing'
        component={TrapPostProcessing}
      />
      <FormStack.Screen name='Fish Holding' component={FishHolding} />
      <FormStack.Screen
        name='Incomplete Sections'
        component={IncompleteSections}
      />
      <FormStack.Screen
        name='Start Mark Recapture'
        component={StartMarkRecapture}
        options={{ headerShown: false }}
      />
      <FormStack.Screen name='High Flows' component={HighFlows} />
      <FormStack.Screen name='High Temperatures' component={HighTemperatures} />
      <FormStack.Screen
        name='Non Functional Trap'
        component={NonFunctionalTrap}
      />
      <FormStack.Screen name='No Fish Caught' component={NoFishCaught} />
      <FormStack.Screen name='End Trapping' component={EndTrapping} />
      <FormStack.Screen name='Started Trapping' component={StartedTrapping} />
      <FormStack.Screen name='Paper Entry' component={PaperEntry} />
    </FormStack.Navigator>
  )
}

export default FormStackNavigation
