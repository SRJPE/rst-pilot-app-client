import { MaterialIcons } from '@expo/vector-icons'
import Ionicons from '@expo/vector-icons/Ionicons'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer'
import {
  Box,
  Divider,
  HStack,
  IconButton,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import { useCallback } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  numOfFormSteps,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import { updateActiveMarkRecaptureStep } from '../../redux/reducers/markRecaptureSlices/markRecaptureNavigationSlice'
import { AppDispatch, RootState } from '../../redux/store'
import AppLogo from '../Shared/AppLogo'
import MenuButton from './MenuButton'

interface ExtendedDrawerProps extends DrawerContentComponentProps {
  userCredentialsStore: any
}

const DrawerMenu = ({
  userCredentialsStore,
  ...props
}: ExtendedDrawerProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const reduxState = useSelector((state: any) => state)
  const { steps, activeStep } = navigationState
  const { state, navigation } = props
  const currentRoute = state?.routeNames[state.index]
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
      navigation?.navigate(buttonTitle)
    },
    [navigation]
  )

  const handlePressFormButton = useCallback((buttonTitle: string) => {
    navigation?.navigate('Trap Visit Form', { screen: buttonTitle })
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
      <VStack bg='primary' pt={8}>
        <AppLogo imageSize={175} />
        <IconButton
          onPress={() => navigation.closeDrawer()}
          borderWidth={2}
          borderRadius={100}
          variant='solid'
          position='absolute'
          right={2}
          top={5}
          backgroundColor='primary'
          borderColor='primary'
          _icon={{
            as: Ionicons,
            name: 'chevron-back',
            size: 10,
            color: 'white',
          }}
        />
        <HStack
          p={7}
          space={3}
          alignItems='center'
          justifyContent='space-between'
        >
          <VStack>
            <Text fontSize='xl' color='white' bold mt={3}>
              {userCredentialsStore.displayName}
            </Text>
            <Text fontSize='md' color='white'>
              {userCredentialsStore.emailAddress}
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
              <Text color='white'>Settings</Text>
            </Pressable>
          </VStack>
        </HStack>
        <AppLogo imageSize={225} />
        <DrawerContentScrollView>
          <MenuButton
            active={currentRoute === 'Home'}
            onPress={() => handlePressMainNavButton('Home')}
            icon='home'
            title='Home'
          />

          <MenuButton
            active={currentRoute === 'Profile'}
            onPress={() => {
              handlePressMainNavButton('Profile')
            }}
            icon='person'
            title='Profile'
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
            active={currentRoute === 'Quality Control'}
            onPress={() => handlePressMainNavButton('Quality Control')}
            icon='bar-chart'
            title='QC Data'
          />
          <MenuButton
            active={currentRoute === 'Inspector'}
            onPress={() => handlePressMainNavButton('Inspector')}
            icon='search'
            title='Inspector'
          />
          <MenuButton
            active={false}
            onPress={() => console.log('Redux Log: ', reduxState)}
            icon='search'
            title='Redux Log'
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
                      onPress={() => handlePressMarkRecaptureButton(step.name)}
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

    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(DrawerMenu)
