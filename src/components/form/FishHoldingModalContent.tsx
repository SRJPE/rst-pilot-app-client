import { HStack, VStack, Text, Button, Divider, Heading } from 'native-base'
import CustomModalHeader from '../Shared/CustomModalHeader'
import FishHoldingCard from './FishHoldingCard'

const FishHoldingModalContent = ({
  handleMarkFishFormSubmit,
  closeModal,
}: {
  handleMarkFishFormSubmit?: any
  closeModal: any
}) => {
  return (
    <>
      <CustomModalHeader
        headerText={'Fish Holding'}
        showHeaderButton={true}
        closeModal={closeModal}
        headerButton={
          <Button
            bg='primary'
            mx='2'
            px='10'
            shadow='3'
            // isDisabled={
            //   (touched && Object.keys(touched).length === 0) ||
            //   (errors && Object.keys(errors).length > 0)
            // }
            onPress={() => {
              // handleSubmit()
              closeModal()
            }}
          >
            <Text fontSize='xl' color='white'>
              Save
            </Text>
          </Button>
        }
      />
      <>
        <Divider my={2} thickness='3' />
        <VStack space={10} paddingX='10' paddingTop='7' paddingBottom='3'>
          <Heading color='black' fontSize='2xl'>
            Which fish are you holding for mark recapture Trials?
          </Heading>
          <HStack space={10} justifyContent='center'>
            <FishHoldingCard cardTitle='Run' />
            <FishHoldingCard cardTitle='Life Stage' />
          </HStack>
        </VStack>
      </>
    </>
  )
}

export default FishHoldingModalContent
