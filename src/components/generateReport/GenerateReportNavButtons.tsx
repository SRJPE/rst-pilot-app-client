import { Box, HStack, Text, Button } from 'native-base'

import { useRoute } from '@react-navigation/native'
import { Icon } from 'native-base'
import { Ionicons } from '@expo/vector-icons'

const GenerateReportNavButtons = ({
  navigation,
  handleSubmit,
  errors,
  touched,
  values,
  clearFormValues,
}: {
  navigation?: any
  handleSubmit?: any
  errors?: any
  touched?: any
  values?: any
  clearFormValues?: any
}) => {
  const activePage = useRoute().name

  const handleRightButton = async () => {
    switch (activePage) {
      case 'Generate Report Home':
        navigation.navigate('Generate Report', {
          screen: 'Share Report',
        })
        break

      default:
        break
    }
  }
  const handleLeftButton = () => {
    switch (activePage) {
      case 'Generate Report Home':
        navigation.navigate('Home')
        break
      default:
        navigation.goBack()
        break
    }
  }

  const handleLeftButtonText = () => {
    let leftButtonText = 'Back'
    switch (activePage) {
      case 'Generate Report Home':
        leftButtonText = 'Home'
        break

      default:
        break
    }
    return leftButtonText
  }
  const handleRightButtonText = () => {
    let rightButtonText = 'Next'
    switch (activePage) {
      case 'Share Report':
        rightButtonText = 'Send Report'
        break

      default:
        break
    }
    return rightButtonText
  }

  const disableLeftButton = () => {
    let shouldBeDisabled = false
    return shouldBeDisabled
  }
  const disableRightButton = () => {
    let shouldBeDisabled = false
    return shouldBeDisabled
  }
  return (
    <Box bg='themeGrey' pb='12' pt='6' px='3' maxWidth='100%'>
      <HStack justifyContent='space-evenly'>
        <Button
          alignSelf='flex-start'
          bg='secondary'
          width='45%'
          height='20'
          rounded='xs'
          borderRadius='5'
          shadow='2'
          leftIcon={
            activePage === 'Generate Report Home' ? (
              <Icon as={Ionicons} name='home' size='lg' color='primary' />
            ) : (
              <></>
            )
          }
          isDisabled={disableLeftButton()}
          onPress={() => handleLeftButton()}
        >
          <Text fontSize='xl' fontWeight='bold' color='primary'>
            {handleLeftButtonText()}
          </Text>
        </Button>
        {activePage !== 'Generate Report Home' && (
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
        )}
      </HStack>
    </Box>
  )
}
export default GenerateReportNavButtons
