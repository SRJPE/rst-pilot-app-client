import { HStack, VStack, Text, Button, Divider, Heading } from 'native-base'
import { memo, useCallback } from 'react'
import CustomModalHeader from '../Shared/CustomModalHeader'
import FishHoldingCard from './FishHoldingCard'

const FishHoldingModalContent = ({
  handleMarkFishFormSubmit,
  closeModal,
}: {
  handleMarkFishFormSubmit?: any
  closeModal: any
}) => {
  // console.log('🚀 ~ FishHoldingModalContentRendered')

  const renderFishHoldingCards = useCallback(() => {
    return (
      <HStack space={10} justifyContent='center'>
        <FishHoldingCard cardTitle='Run' />
        <FishHoldingCard cardTitle='Life Stage' />
      </HStack>
    )
  }, [])

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
        <VStack
          alignItems='center'
          // space={10}
          paddingX='10'
          paddingTop='7'
          paddingBottom='3'
        >
          <Heading color='black' fontSize='2xl' mb='5%'>
            Which fish are you holding for mark recapture Trials?
          </Heading>
          <HStack m='4' space={4}>
            <Button
              bg='primary'
              alignSelf='flex-start'
              shadow='5'
              // onPress={handelModalChange}
            >
              <Text fontWeight='bold' color='white'>
                Clear all, I am not holding any fish.
              </Text>
            </Button>
            <Button
              bg='primary'
              alignSelf='flex-start'
              shadow='5'
              // onPress={handelModalChange}
            >
              <Text fontWeight='bold' color='white'>
                Reset All
              </Text>
            </Button>
          </HStack>
          {renderFishHoldingCards()}
          <Heading>Total Fish Holding: </Heading>
        </VStack>
      </>
    </>
  )
}

export default memo(FishHoldingModalContent)
