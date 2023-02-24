import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack'
import FishInput from '../screens/formScreens/FishInput'
import { connect, useDispatch, useSelector } from 'react-redux'
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
import {
  HStack,
  VStack,
  Text,
  Button,
  Box,
  IconButton,
  Icon,
} from 'native-base'
import { AppDispatch, RootState } from '../redux/store'
import {
  createTab,
  deleteTab,
  setActiveTab,
  TabStateI,
} from '../redux/reducers/formSlices/tabSlice'
import { ScrollView } from 'react-native-gesture-handler'
import Ionicons from '@expo/vector-icons/Ionicons'
import { uid } from 'uid'

const FormStack = createNativeStackNavigator()

function FormStackNavigation(props: any) {
  const dispatch = useDispatch<AppDispatch>()
  const fishInputModalOpen = useSelector(
    (state: any) => state.fishInput.modalOpen
  )
  const tabSlice = props.tabSlice as TabStateI
  const nonTabBarScreens = ['Incomplete Sections', 'Add Fish', 'Batch Count']
  const renderTabContent = (
    tabSlice: TabStateI,
    props: NativeStackHeaderProps
  ) => {
    if (
      Object.keys(tabSlice.tabs).length &&
      !nonTabBarScreens.includes(props.route.name)
    ) {
      // show tabbar
      return (
        <Box px={'2%'} pt={'2%'}>
          <ScrollView horizontal={true}>
            <HStack alignItems={'center'} justifyContent='space-between'>
              {Object.keys(tabSlice.tabs).map((tabId) => (
                <Button
                  bg={tabId == tabSlice.activeTabID ? 'primary' : 'secondary'}
                  onPress={() => dispatch(setActiveTab(tabId))}
                  key={tabId}
                  mr={5}
                >
                  <HStack alignItems={'center'} justifyContent='space-between'>
                    <Text
                      fontSize='lg'
                      color={
                        tabId == tabSlice.activeTabID ? 'white' : 'primary'
                      }
                    >
                      {tabSlice.tabs[tabId]}
                    </Text>
                    <Icon
                      onPress={() => dispatch(deleteTab(tabId))}
                      as={Ionicons}
                      name='ios-close-circle'
                      color='#FFF'
                      size={6}
                      margin='0'
                      padding='0'
                      marginLeft={3}
                    />
                  </HStack>
                </Button>
              ))}
              <Icon
                onPress={() => {
                  const tabID = uid()
                  dispatch(createTab({ tabID, tabName: 'New Tab' }))
                  dispatch(setActiveTab(tabID))
                  props.navigation.navigate('Trap Visit Form', {
                    screen: 'Visit Setup',
                  })
                }}
                as={Ionicons}
                name='ios-add-circle'
                color='primary'
                size={9}
                margin='0'
                padding='0'
              />
            </HStack>
          </ScrollView>
        </Box>
      )
    } else if (
      Object.keys(tabSlice.tabs).length &&
      nonTabBarScreens.includes(props.route.name)
    ) {
      // just show tabname
      if (
        tabSlice.activeTabID != null &&
        props.route.name != 'Incomplete Sections'
      ) {
        return <Text>{tabSlice.tabs[tabSlice.activeTabID]}</Text>
      } else {
        return <></>
      }
    } else {
      // show nothing
      return <></>
    }
  }

  return (
    <FormStack.Navigator
      initialRouteName='Visit Setup'
      screenOptions={{
        header: (props) => (
          <VStack>
            <ProgressHeader {...props} />
            {renderTabContent(tabSlice, props)}
          </VStack>
        ),
      }}
    >
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

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
  }
}

export default connect(mapStateToProps, {})(FormStackNavigation)
