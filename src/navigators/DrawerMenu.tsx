import { useCallback } from 'react'
import {
  HStack,
  VStack,
  Avatar,
  Heading,
  IconButton,
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
import { useSelector } from 'react-redux'
import { AppDispatch } from '../redux/store'
import { useDispatch } from 'react-redux'
import { updateActiveStep } from '../redux/reducers/navigationSlice'

export default function DrawerMenu(props: DrawerContentComponentProps) {
  const { state, navigation } = props
  const currentRoute = state.routeNames[state.index]

  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const { steps, activeStep } = navigationState
  // console.log('🚀 ~ DrawerMenu ~ activeStep', activeStep)
  // console.log('🚀 ~ DrawerMenu ~ steps', steps)
  // const activePageTitle = steps[activeStep].name
  const stepsArray = Object.values(steps)

  const handlePressMainNavButton = useCallback(
    (buttonTitle: string) => {
      navigation.navigate(buttonTitle)
    },
    [navigation]
  )

  const handlePressFormButton = useCallback((buttonTitle: string) => {
    navigation.navigate('Trap Visit Form', { screen: buttonTitle })
    dispatch({
      type: updateActiveStep,
      payload: navigationState[buttonTitle],
    })
  }, [])

  return (
    <Box safeArea flex={1} p={7}>
      <VStack flex={1} space={2}>
        <HStack justifyContent='flex-end'>
          <IconButton
            onPress={() => navigation.closeDrawer()}
            borderWidth={2}
            borderRadius={100}
            variant='solid'
            backgroundColor='primary'
            borderColor='primary'
            _icon={{
              as: Ionicons,
              name: 'chevron-back',
              size: 6,
              color: '#FFF',
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
            onPress={() => handlePressMainNavButton('Home')}
            icon='home'
            title='Home'
          />
          <MenuButton
            active={currentRoute === 'Generate Report'}
            onPress={() => handlePressMainNavButton('Generate Report')}
            icon='podium'
            title='Generate Report'
          />

          <MenuButton
            active={currentRoute === 'Trap Visit Form'}
            onPress={() => handlePressMainNavButton('Trap Visit Form')}
            icon='clipboard'
            title='Trap Visit Form'
          />
          <Divider />
          {stepsArray &&
            stepsArray.map((step: any, index: any) => {
              return (
                <VStack ml='8' key={index}>
                  <MenuButton
                    active={currentRoute === step.name}
                    onPress={() => handlePressFormButton(step.name)}
                    icon='clipboard'
                    title={step.name}
                    // disabled={step.completed}
                  />
                </VStack>
              )
            })}
        </DrawerContentScrollView>
      </VStack>
    </Box>
  )
}
