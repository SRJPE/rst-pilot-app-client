import { useCallback } from 'react'
import {
  HStack,
  VStack,
  Avatar,
  Heading,
  IconButton,
  useColorModeValue,
  Box,
  Center,
} from 'native-base'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import Ionicons from '@expo/vector-icons/Ionicons'

import MenuButton from './MenuButton'
import ThemeToggle from '../ThemeToggle'

export default function Sidebar(props: DrawerContentComponentProps) {
  const { state, navigation } = props
  const currentRoute = state.routeNames[state.index]

  const handlePressBackButton = useCallback(() => {
    navigation.closeDrawer()
  }, [navigation])
  const handlePressMenuHome = useCallback(() => {
    navigation.navigate('Home')
  }, [navigation])
  const handlePressMenuGenerateReport = useCallback(() => {
    navigation.navigate('Generate Report')
  }, [navigation])
  const handlePressMenuTrapVisitForm = useCallback(() => {
    navigation.navigate('Trap Visit Form')
  }, [navigation])
  // const handlePressMenuVisitSetup = useCallback(() => {
  //   navigation.navigate('Visit Setup')
  // }, [navigation])
  // const handlePressMenuTrapStatus = useCallback(() => {
  //   navigation.navigate('Trap Status')
  // }, [navigation])
  // const handlePressMenuTrapOperations = useCallback(() => {
  //   navigation.navigate('Trap Operations')
  // }, [navigation])
  // const handlePressMenuFishInput = useCallback(() => {
  //   navigation.navigate('Fish Input')
  // }, [navigation])
  // const handlePressMenuFishProcessing = useCallback(() => {
  //   navigation.navigate('Fish Processing')
  // }, [navigation])

  return (
    <Box safeArea flex={1} bg={useColorModeValue('#FFFFFF', 'primary')} p={7}>
      <VStack flex={1} space={2}>
        <HStack justifyContent='flex-end'>
          <IconButton
            onPress={handlePressBackButton}
            borderWidth={2}
            borderRadius={100}
            variant='solid'
            backgroundColor={useColorModeValue('primary', '#FFFFFF')}
            borderColor={useColorModeValue('primary', '#FFFFFF')}
            _icon={{
              as: Ionicons,
              name: 'chevron-back',
              size: 6,
              color: useColorModeValue('#FFFFFF', 'primary'),
            }}
          />
        </HStack>
        <Avatar
          source={require('../../assets/chinook_salmon.jpeg')}
          size='xl'
          borderRadius={100}
          mb={6}
          borderColor='secondary.500'
          borderWidth={3}
        />
        <Heading mb={4} size='xl'>
          Data Tackle
        </Heading>
        <DrawerContentScrollView>
          <MenuButton
            active={currentRoute === 'Home'}
            onPress={handlePressMenuHome}
            icon='home'
          >
            Home
          </MenuButton>
          <MenuButton
            active={currentRoute === 'Generate Report'}
            onPress={handlePressMenuGenerateReport}
            icon='podium'
          >
            Generate Report
          </MenuButton>
          <MenuButton
            active={currentRoute === 'Trap Visit Form'}
            onPress={handlePressMenuTrapVisitForm}
            icon='clipboard'
          >
            Trap Visit Form
          </MenuButton>
          {/* <MenuButton
            active={currentRoute === 'Visit Setup'}
            onPress={handlePressMenuVisitSetup}
            icon='clipboard'
          >
            VisitSetup
          </MenuButton>
          <MenuButton
            active={currentRoute === 'Trap Status'}
            onPress={handlePressMenuTrapStatus}
            icon='clipboard'
          >
            Trap Status
          </MenuButton>
          <MenuButton
            active={currentRoute === 'Trap Operations'}
            onPress={handlePressMenuTrapOperations}
            icon='clipboard'
          >
            Trap Operations
          </MenuButton>
          <MenuButton
            active={currentRoute === 'Fish Input'}
            onPress={handlePressMenuFishInput}
            icon='clipboard'
          >
            Fish Input
          </MenuButton>
          <MenuButton
            active={currentRoute === 'Fish Processing'}
            onPress={handlePressMenuFishProcessing}
            icon='clipboard'
          >
            Fish Processing
          </MenuButton> */}
        </DrawerContentScrollView>
        <Center>
          <ThemeToggle />
        </Center>
      </VStack>
    </Box>
  )
}
