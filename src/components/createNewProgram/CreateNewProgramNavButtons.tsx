import React from 'react'
import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useRoute } from '@react-navigation/native'
import { markCreateNewProgramStepCompleted } from '../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'

const CreateNewProgramNavButtons = ({
  navigation,
  handleSubmit,
}: {
  navigation?: any
  handleSubmit?: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const activePage = useRoute().name

  //TODO:
  //if a section is completed, navigate to the final page of that section when green button clicked

  const handleRightButton = () => {
    switch (activePage) {
      case 'Crew Members':
        dispatch(markCreateNewProgramStepCompleted('crewMembers'))
        navigation.goBack()
        break
      case 'Efficiency Trial Protocols':
        navigation.navigate('Create New Program', {
          screen: 'Hatchery Information',
        })
        break
      case 'Hatchery Information':
        handleSubmit()
        dispatch(markCreateNewProgramStepCompleted('efficiencyTrialProtocols'))
        navigation.navigate('Create New Program', {
          screen: 'Create New Program Home',
        })
        break
      case 'Trapping Protocols':
        navigation.navigate('Create New Program', {
          screen: 'Trapping Protocols Table',
        })
        break
      case 'Trapping Protocols Table':
        dispatch(markCreateNewProgramStepCompleted('trappingProtocols'))
        navigation.navigate('Create New Program', {
          screen: 'Create New Program Home',
        })
        break
      case 'Permit Information':
        navigation.navigate('Create New Program', {
          screen: 'Permitting Information Input',
        })
        break
      case 'Permitting Information Input':
        handleSubmit()
        dispatch(markCreateNewProgramStepCompleted('permitInformation'))
        navigation.navigate('Create New Program', {
          screen: 'Create New Program Home',
        })
        break

      default:
        console.log('Default hit')
        break
    }
  }
  const handleLeftButton = () => {
    // if (activePage === 'Create New Program Home') {
    //   navigation.navigate('Monitoring Program', {
    //     screen: 'Monitoring Program Home',
    //   })
    // } else {
    //   navigation.goBack()
    // }
    navigation.goBack()
  }

  const handleRightButtonText = () => {
    let rightButtonText = 'Next'
    switch (activePage) {
      case 'Crew Members':
        rightButtonText = 'Save Crew Members and Exit'
        break
      case 'Hatchery Information':
        rightButtonText = 'Save and Exit'
        break
      case 'Trapping Protocols Table':
        rightButtonText = 'Save Trapping Protocols and Exit'
        break
      case 'Permitting Information Input':
        rightButtonText = 'Save Permitting Information and Exit'
        break

      default:
        console.log('Default hit')
        break
    }
    return rightButtonText
  }

  const handleLeftButtonText = () => {
    return 'Back'
  }
  const disableLeftButton = () => {
    // return activePage === 'Create New Program Home'
    return false
  }
  const disableRightButton = () => {
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
          shadow='5'
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

export default CreateNewProgramNavButtons
