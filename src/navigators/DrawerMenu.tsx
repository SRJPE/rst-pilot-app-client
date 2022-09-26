import { useCallback } from 'react'
import {
  HStack,
  VStack,
  Avatar,
  Heading,
  IconButton,
  useColorModeValue,
  Box,
  Divider,
} from 'native-base'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import Ionicons from '@expo/vector-icons/Ionicons'
import MenuButton from '../components/drawerMenu/MenuButton'
import ThemeToggle from '../components/drawerMenu/ThemeToggle'

//temporary routing during development into nested form.

export default function DrawerMenu(props: DrawerContentComponentProps) {
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
  const handlePressMenuVisitSetup = useCallback(() => {
    navigation.navigate('Trap Visit Form', { screen: 'Visit Setup' })
  }, [navigation])
  const handlePressMenuTrapStatus = useCallback(() => {
    navigation.navigate('Trap Visit Form', { screen: 'Trap Status' })
  }, [navigation])
  const handlePressMenuTrapOperations = useCallback(() => {
    navigation.navigate('Trap Visit Form', { screen: 'Trap Operations' })
  }, [navigation])
  const handlePressMenuFishInput = useCallback(() => {
    navigation.navigate('Trap Visit Form', { screen: 'Fish Input' })
  }, [navigation])
  const handlePressMenuFishProcessing = useCallback(() => {
    navigation.navigate('Trap Visit Form', { screen: 'Fish Processing' })
  }, [navigation])
  const handlePressMenuHighFlows = useCallback(() => {
    navigation.navigate('High Flows')
  }, [navigation])
  const handlePressMenuHighTemperatures = useCallback(() => {
    navigation.navigate('High Temperatures')
  }, [navigation])
  const handlePressMenuNonFunctionalTrap = useCallback(() => {
    navigation.navigate('Non Functional Trap')
  }, [navigation])
  const handlePressMenuNoFishCaught = useCallback(() => {
    navigation.navigate('No Fish Caught')
  }, [navigation])

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
          source={require('../assets/chinook_salmon.jpeg')}
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
          <Divider />
          <VStack ml='8'>
            <MenuButton
              active={currentRoute === 'Visit Setup'}
              onPress={handlePressMenuVisitSetup}
              icon='clipboard'
            >
              Visit Setup
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
            </MenuButton>
            <MenuButton
              active={currentRoute === 'High Flows'}
              onPress={handlePressMenuHighFlows}
              icon='clipboard'
            >
              High Flows
            </MenuButton>
            <MenuButton
              active={currentRoute === 'High Temperatures'}
              onPress={handlePressMenuHighTemperatures}
              icon='clipboard'
            >
              High Temperatures
            </MenuButton>
            <MenuButton
              active={currentRoute === 'Non Functional Trap'}
              onPress={handlePressMenuNonFunctionalTrap}
              icon='clipboard'
            >
              Non Functional Trap
            </MenuButton>
            <MenuButton
              active={currentRoute === 'No Fish Caught'}
              onPress={handlePressMenuNoFishCaught}
              icon='clipboard'
            >
              No Fish Caught
            </MenuButton>
          </VStack>
        </DrawerContentScrollView>
        {/* <Center>
          <ThemeToggle />
        </Center> */}
      </VStack>
    </Box>
  )
}
