import React from 'react'
import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useRoute } from '@react-navigation/native'

const MonitoringProgramNavButtons = ({
  navigation,
  handleSubmit,
  touched,
  errors,
  program,
}: {
  navigation: any
  handleSubmit?: any
  touched?: any
  errors?: any
  program?: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const activePage = useRoute().name

  const handleRightButton = () => {
    switch (activePage) {
      case 'Monitoring Program Home':
        break
      case 'Monitoring Program Existing':
        navigation.navigate('Monitoring Program Joined')
        break
      case 'Monitoring Program Joined':
        navigation.reset({
          index: 0,
          routes: [{ name: 'Monitoring Program Home' }],
        })
        navigation.navigate('Home')
        break
      case 'Monitoring Program New':
        handleSubmit()
        navigation.navigate('Monitoring Program', {
          screen: 'Create New Program',
        })
        break
      default:
        break
    }
  }

  const handleLeftButton = () => {
    navigation.goBack()
  }

  const handleRightButtonText = () => {
    let rightButtonText = 'Next'
    switch (activePage) {
      case 'Monitoring Program Home':
        break
      case 'Monitoring Program Existing':
        rightButtonText = 'Join Program'
        break
      case 'Monitoring Program Joined':
        rightButtonText = 'Go Home'
        break
      case 'Monitoring Program New':
        rightButtonText = 'Create New Program'
        break
      default:
        break
    }
    return rightButtonText
  }

  const handleLeftButtonText = () => {
    let leftButtonText = 'Back'
    switch (activePage) {
      case 'Monitoring Program Joined':
        leftButtonText = 'Join Another Program'
        break
      case 'Monitoring Program New':
        break

      default:
        break
    }
    return leftButtonText
  }
  const disableLeftButton = () => {
    // return activePage === 'Create New Program Home'
    return false
  }
  const disableRightButton = () => {
    switch (activePage) {
      case 'Monitoring Program Existing':
        console.log('🚀 ~ disableRightButton ~ program:', program)
        if (!program) {
          return true
        }
        break
      case 'Monitoring Program New':
        if (
          Object.keys(touched).length === 0 ||
          Object.keys(errors).length > 0
        ) {
          return true
        }
        break

      default:
        break
    }
    return false
  }

  return (
    <Box bg='#fff' py='8' maxWidth='100%'>
      <HStack justifyContent='space-evenly'>
        <Button
          alignSelf='flex-start'
          bg='secondary'
          width='45%'
          height='20'
          rounded='xs'
          borderRadius='5'
          shadow='2'
          isDisabled={disableLeftButton()}
          onPress={() => handleLeftButton()}
        >
          <Text fontSize='xl' fontWeight='bold' color='primary'>
            {handleLeftButtonText()}
          </Text>
        </Button>
        <Button
          alignSelf='flex-start'
          bg='primary'
          width='45%'
          height='20'
          rounded='xs'
          borderRadius='5'
          shadow='2'
          isDisabled={disableRightButton()}
          onPress={() => handleRightButton()}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            {handleRightButtonText()}
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}

export default MonitoringProgramNavButtons
