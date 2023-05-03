import React from 'react'
import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { useRoute } from '@react-navigation/native'

const CreateNewProgramNavButtons = ({ navigation }: { navigation?: any }) => {
  const activePage = useRoute().name

  const handleRightButton = () => {
    switch (activePage) {
      case 'Permit Information':
        navigation.navigate('Create New Program', {
          screen: 'Permitting Information Input',
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
            Back
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
            Next
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}

export default CreateNewProgramNavButtons
