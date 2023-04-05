import { Ionicons } from '@expo/vector-icons'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import {
  Badge,
  Box,
  Icon,
  ScrollView,
  HStack,
  Button,
  Text,
} from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { uid } from 'uid'
import {
  createTab,
  deleteTab,
  setActiveTab,
  TabStateI,
} from '../../redux/reducers/formSlices/tabSlice'
import { AppDispatch, RootState } from '../../redux/store'

const TabBar = ({
  headerProps,
  tabSlice,
}: {
  headerProps: NativeStackHeaderProps
  tabSlice: TabStateI
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const nonTabBarScreens = [
    'Paper Entry',
    'Add Fish',
    'Batch Count',
    'Incomplete Sections',
  ]

  if (
    Object.keys(tabSlice.tabs).length &&
    !nonTabBarScreens.includes(headerProps.route.name)
  ) {
    // show tab bar
    return (
      <Box px={'2%'} pt={'2%'}>
        <ScrollView horizontal={true}>
          <HStack alignItems={'center'} justifyContent='space-between'>
            {Object.keys(tabSlice.tabs).map((tabId) => (
              <Button
                bg={tabId == tabSlice.activeTabId ? 'primary' : 'secondary'}
                onPress={() => dispatch(setActiveTab(tabId))}
                key={tabId}
                mr={5}
              >
                <HStack alignItems={'center'} justifyContent='space-between'>
                  <Text
                    fontSize='lg'
                    color={tabId == tabSlice.activeTabId ? 'white' : 'primary'}
                  >
                    {tabSlice.tabs[tabId].name}
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
                const tabId = uid()
                dispatch(createTab({ tabId, tabName: 'New Tab' }))
                dispatch(setActiveTab(tabId))
                headerProps.navigation.navigate('Trap Visit Form', {
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
    nonTabBarScreens.includes(headerProps.route.name)
  ) {
    if (
      tabSlice.activeTabId != null &&
      headerProps.route.name == 'Paper Entry'
    ) {
      return <Text ml={5}>{tabSlice.tabs[tabSlice.activeTabId].trapSite}</Text>
    } else if (
      tabSlice.activeTabId != null &&
      headerProps.route.name != 'Incomplete Sections'
    ) {
      return <Text ml={5}>{tabSlice.tabs[tabSlice.activeTabId].name}</Text>
    } else {
      return <></>
    }
  } else {
    // show nothing
    return <></>
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
  }
}

export default connect(mapStateToProps)(TabBar)
