import { useCallback, useEffect } from 'react'
import {
  HStack,
  VStack,
  Button,
  Icon,
  Avatar,
  Heading,
  IconButton,
  Text,
  Box,
  Divider,
  Pressable,
} from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'
import Ionicons from '@expo/vector-icons/Ionicons'
import MenuButton from './MenuButton'
import { useSelector } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useDispatch } from 'react-redux'
import {
  numOfFormSteps,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import { updateActiveMarkRecaptureStep } from '../../redux/reducers/markRecaptureSlices/markRecaptureNavigationSlice'
import AppLogo from '../Shared/AppLogo'

const DUMMY_USER = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@flowwest.com',
}

const DrawerMenu = (props: DrawerContentComponentProps) => {
  const dispatch = useDispatch<AppDispatch>()
  //=========== DUMMY USER ===========//
  const { firstName, lastName, email } = DUMMY_USER
  //=================================//

  const navigationState = useSelector((state: any) => state.navigation)
  const reduxState = useSelector((state: any) => state)
  const { steps, activeStep } = navigationState
  const { state, navigation } = props
  const currentRoute = state.routeNames[state.index]
  //unsliced Array for dev
  // const stepsArray = Object.values(steps) as Array<any>
  const stepsArray = Object.values(steps).slice(0, numOfFormSteps) as Array<any>

  //mark recapture steps
  const markRecaptureSteps = useSelector(
    (state: any) => state.markRecaptureNavigation.steps
  )
  const markRecaptureStepsArray = Object.values(markRecaptureSteps).slice(
    0,
    2
  ) as Array<any>

  const handlePressMainNavButton = useCallback(
    (buttonTitle: string) => {
      navigation.navigate(buttonTitle)
    },
    [navigation]
  )

  const handlePressFormButton = useCallback((buttonTitle: string) => {
    navigation.navigate('Trap Visit Form', { screen: buttonTitle })
    //for each object in the steps Array
    //if the Object contain the name property that matched button title
    //assign the index top stepPayload
    //navigate to the index + 1
    let stepPayload
    for (let i = 0; i < stepsArray.length; i++) {
      if (stepsArray[i].name === buttonTitle) {
        stepPayload = i + 1
      }
    }
    dispatch({
      type: updateActiveStep,
      payload: stepPayload,
      // payload: steps[buttonTitle],
    })
  }, [])

  const handlePressMarkRecaptureButton = useCallback((buttonTitle: string) => {
    navigation.navigate('Mark Recapture', { screen: buttonTitle })
    let stepPayload
    for (let i = 0; i < markRecaptureStepsArray.length; i++) {
      if (markRecaptureStepsArray[i].name === buttonTitle) {
        stepPayload = i + 1
      }
    }
    dispatch({
      type: updateActiveMarkRecaptureStep,
      payload: stepPayload,
    })
  }, [])

  return (
    <>
      <HStack
        bg='primary'
        p={7}
        alignItems='center'
        justifyContent='space-between'
      >
        <AppLogo imageSize={225} />
        <VStack>
          <Text fontSize='2xl' color='white'>
            Hello,
          </Text>
          <Text fontSize='2xl' color='white' bold mt={3}>
            {`${firstName} ${lastName}`}
          </Text>
          <Text fontSize='lg' color='white'>
            {email}
          </Text>

          <Pressable
            variant='outline'
            style={{
              display: 'flex',
              flexDirection: 'row',

              marginTop: 10,
            }}
            onPress={() => {
              handlePressMainNavButton('Profile')
            }}
          >
            <MaterialIcons
              name='settings'
              size={20}
              color='white'
              style={{ marginRight: 5 }}
            />
            <Text color='white'>Profile Settings</Text>
          </Pressable>
        </VStack>
        <Avatar
          source={{
            uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
          }}
          size={75}
          borderRadius={100}
          backgroundColor='hsl(0,0%,70%)'
          borderColor='secondary'
          borderWidth={3}
        />
      </HStack>
      <Box safeArea flex={1} px={7}>
        <VStack flex={1} space={2}>
          <DrawerContentScrollView>
            <MenuButton
              active={currentRoute === 'Home'}
              onPress={() => handlePressMainNavButton('Home')}
              icon='home'
              title='Home'
            />
            <MenuButton
              active={currentRoute === 'Sign In'}
              onPress={() => handlePressMainNavButton('Sign In')}
              icon='home'
              title='Sign In'
            />

            <MenuButton
              active={currentRoute === 'Permit Info'}
              onPress={() => {
                handlePressMainNavButton('Permit Info')
              }}
              icon='information-circle'
              title='Permit Info'
            />
            <MenuButton
              active={currentRoute === 'Generate Report'}
              onPress={() => handlePressMainNavButton('Generate Report')}
              icon='bar-chart'
              title='Generate Report'
            />
            <MenuButton
              active={false}
              onPress={() => console.log('🚀 ~ reduxState:', reduxState)}
              icon='bug'
              title='Developer Log'
            />
            <MenuButton
              active={currentRoute === 'Mark Recapture'}
              onPress={() => handlePressMainNavButton('Mark Recapture')}
              icon='clipboard'
              title='Mark Recapture'
            />
            {markRecaptureStepsArray && currentRoute === 'Mark Recapture' && (
              <>
                <Divider mt='2' />
                {markRecaptureStepsArray.map((step: any, index: any) => {
                  return (
                    <VStack ml='4' key={index}>
                      <MenuButton
                        active={currentRoute === step.name}
                        completed={step.completed}
                        icon='ellipse'
                        listItem={true}
                        title={step.name}
                        // isDisabled={
                        //   reduxState[step.propName]?.completed ? false : true
                        // }
                        onPress={() =>
                          handlePressMarkRecaptureButton(step.name)
                        }
                      />
                    </VStack>
                  )
                })}
              </>
            )}
            <MenuButton
              active={currentRoute === 'Trap Visit Form'}
              onPress={() => handlePressMainNavButton('Trap Visit Form')}
              icon='clipboard'
              title='Trap Visit Form'
              completed={true}
            />
            {stepsArray && currentRoute === 'Trap Visit Form' && (
              <>
                <Divider mt='2' />
                {stepsArray.map((step: any, index: any) => {
                  return (
                    <VStack ml='4' key={index}>
                      <MenuButton
                        active={currentRoute === step.name}
                        // isDisabled={
                        //   reduxState[step.propName]?.completed ? false : true
                        // }
                        completed={step.completed}
                        onPress={() => handlePressFormButton(step.name)}
                        icon='ellipse'
                        listItem={true}
                        title={step.name}
                      />
                    </VStack>
                  )
                })}
              </>
            )}
          </DrawerContentScrollView>
        </VStack>
      </Box>
    </>
  )
}

export default DrawerMenu
