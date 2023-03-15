import React from 'react'
import { Box, HStack, Text, Button, Icon } from 'native-base'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'

const CreateNewProgramNavButtons = ({
  navigation,
  handleSubmit,
  errors,
  touched,
  values,
}: {
  navigation?: any
  handleSubmit?: any
  errors?: any
  touched?: any
  values?: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const activePage = 'temp'
  const handleRightButton = () => {}
  const handleLeftButton = () => {}
  const disableRightButton = () => {
    return false
  }

  const renderRightButtonText = (activePage: string) => {
    let buttonText
    switch (activePage) {
      case 'Mark Recapture Complete':
        buttonText = 'QC Data'
        break
      default:
        buttonText = 'Next'
        break
    }
    return buttonText
  }

  return (
    <Box bg='themeGrey' pb='12' pt='12' px='3' maxWidth='100%'>
      <HStack justifyContent='space-evenly'>
        <Button
          alignSelf='flex-start'
          bg='secondary'
          width='45%'
          height='20'
          rounded='xs'
          borderRadius='5'
          shadow='5'
          // leftIcon={
          //   activePage === 'Release Trial' ? (
          //     <Icon as={Ionicons} name='home' size='lg' color='primary' />
          //   ) : (
          //     <></>
          //   )
          // }
          onPress={handleLeftButton}
        >
          <Text fontSize='xl' fontWeight='bold' color='primary'>
            {/* {activePage === 'Release Trial' ? 'Return Home' : 'Back'} */}
            Back
          </Text>
        </Button>
        {/* <Button
          height='20'
          rounded='xs'
          bg='primary'
          alignSelf='flex-start'
          width='5%'
          borderRadius='5'
          shadow='5'
          onPress={() => console.log('🚀 ~ reduxState', reduxState)}
        >
          <Text fontWeight='bold' color='white'>
            redux state
          </Text>
        </Button> */}
        <Button
          alignSelf='flex-start'
          bg='primary'
          width='45%'
          height='20'
          rounded='xs'
          borderRadius='5'
          shadow='5'
          isDisabled={disableRightButton()}
          onPress={handleRightButton}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            {renderRightButtonText(activePage) as string}
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}

export default CreateNewProgramNavButtons
