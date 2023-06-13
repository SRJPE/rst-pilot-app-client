import React from 'react'
import { Box, HStack, Text, Button, Icon } from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { useRoute } from '@react-navigation/native'
import { markCreateNewProgramStepCompleted } from '../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'
import { TrappingProtocolsStoreI } from '../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import { CrewMembersStoreI } from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'

const CreateNewProgramNavButtons = ({
  crewMembersStore,
  trappingProtocolsStore,
  navigation,
  handleSubmit,
  errors,
  touched,
  variant,
  disableRightButtonBool,
}: {
  crewMembersStore: CrewMembersStoreI
  trappingProtocolsStore: TrappingProtocolsStoreI
  navigation?: any
  handleSubmit?: any
  errors?: any
  touched?: any
  variant?: string
  disableRightButtonBool?: boolean
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const activePage = useRoute().name

  const isMultipleTrapsVariant = variant === 'multipleTrapsDialog'

  const { leftButtonText, rightButtonText } = (() => {
    switch (activePage) {
      case 'Trapping Sites':
        if (isMultipleTrapsVariant) {
          return {
            leftButtonText: 'Save and Exit',
            rightButtonText: 'Group Traps',
          }
        } else {
          return { leftButtonText: 'Back', rightButtonText: 'Next' }
        }
      case 'Multiple Traps':
        return {
          leftButtonText: 'Cancel',
          rightButtonText: 'Save',
        }
      default:
        return { leftButtonText: 'Back', rightButtonText: 'Next' }
    }
  })()

  const handleRightButton = async () => {
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
      case 'Trapping Sites':
        if (isMultipleTrapsVariant) {
          navigation.navigate('Create New Program', {
            screen: 'Multiple Traps',
          })
        } else {
          console.log('Navigating to next Screen')
        }
        break
      case 'Multiple Traps':
        //*****
        // Add dispatch function to save trap site group data to redux store
        //*****
        handleSubmit && handleSubmit()
        navigation.navigate('Create New Program', {
          screen: 'Trapping Sites',
        })
        break
      case 'Permitting Information Input':
        handleSubmit()
        dispatch(markCreateNewProgramStepCompleted('permitInformation'))
        navigation.navigate('Create New Program', {
          screen: 'Create New Program Home',
        })
        break
      case 'Create New Program Home':
        navigation.navigate('Create New Program', {
          screen: 'Create New Program Complete',
        })
        break
      case 'Create New Program Complete':
        navigation.navigate('Home')
        break

      default:
        break
    }
  }
  const handleLeftButton = () => {
    if (activePage === 'Create New Program Home') {
      navigation.navigate('Monitoring Program', {
        screen: 'Monitoring Program New',
      })
    } else {
    }

    switch (activePage) {
      case 'Create New Program Home':
        navigation.navigate('Monitoring Program', {
          screen: 'Monitoring Program New',
        })
        break
      case 'Create New Program Complete':
        navigation.navigate('Monitoring Program', {
          screen: 'Monitoring Program New',
        })
        break
      default:
        navigation.goBack()
        break
    }
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
      case 'Create New Program Complete':
        rightButtonText = 'Go Home'
        break

      default:
        break
    }
    return rightButtonText
  }

  const handleLeftButtonText = () => {
    let leftButtonText = 'Back'
    switch (activePage) {
      case 'Create New Program Complete':
        leftButtonText = 'Add Another Program'
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
    let shouldBeDisabled = false

    switch (activePage) {
      case 'Crew Members':
        if (Object.values(crewMembersStore).length === 0) {
          shouldBeDisabled = true
        }
        break
      case 'Hatchery Information':
        shouldBeDisabled =
          Object.keys(touched).length === 0 || Object.keys(errors).length > 0

        break
      case 'Trapping Protocols Table':
        if (Object.values(trappingProtocolsStore).length === 0) {
          shouldBeDisabled = true
        }
        break
      case 'Permitting Information Input':
        shouldBeDisabled =
          Object.keys(touched).length === 0 || Object.keys(errors).length > 0

        break
      default:
        shouldBeDisabled = false
        break
    }
    return shouldBeDisabled
  }

  return (
    <Box
      bg={isMultipleTrapsVariant ? 'transparent' : '#fff'}
      p={isMultipleTrapsVariant ? 0 : 8}
      mt={isMultipleTrapsVariant ? 8 : 0}
      width='100%'
    >
      <HStack justifyContent='space-evenly'>
        <Button
          alignSelf='flex-start'
          bg={isMultipleTrapsVariant ? 'primary' : 'secondary'}
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
          isDisabled={
            disableRightButtonBool !== undefined
              ? disableRightButtonBool
              : disableRightButton()
          }
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
const mapStateToProps = (state: RootState) => {
  return {
    createNewProgramHomeStore: state.createNewProgramHome,
    trappingSitesStore: state.trappingSites,
    crewMembersStore: state.crewMembers.crewMembersStore,
    efficiencyTrialProtocolsStore: state.efficiencyTrialProtocols,
    trappingProtocolsStore: state.trappingProtocols.trappingProtocolsStore,
    permitInformationStore: state.permitInformation,
  }
}

export default connect(mapStateToProps)(CreateNewProgramNavButtons)
