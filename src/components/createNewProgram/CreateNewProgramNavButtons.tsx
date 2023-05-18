import React from 'react'
import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useRoute } from '@react-navigation/native'

const CreateNewProgramNavButtons = ({
  navigation,
  variant,
  handleSubmit,
}: {
  navigation?: any
  variant?: string
  handleSubmit?: Function
}) => {
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
      default:
        console.log('Default hit')
        break
    }
  }
  const handleLeftButton = () => {
    navigation.goBack()
  }

  const disableLeftButton = () => {
    return activePage === 'Create New Program Home'
  }
  const disableRightButton = () => {
    return false
  }

  return (
    <Box
      bg={isMultipleTrapsVariant ? 'transparent' : '#fff'}
      p={isMultipleTrapsVariant ? 0 : 8}
      pt={8}
      maxWidth='100%'
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
          <Text
            fontSize='xl'
            fontWeight='bold'
            color={isMultipleTrapsVariant ? 'white' : 'primary'}
          >
            {leftButtonText}
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
            {rightButtonText}
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}

export default CreateNewProgramNavButtons
