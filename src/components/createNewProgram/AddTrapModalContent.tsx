import { Button, Divider, Text, VStack } from 'native-base'

import CustomModalHeader from '../Shared/CustomModalHeader'

const AddTrapModalContent = ({ closeModal }: { closeModal: any }) => {
  return (
    <>
      <CustomModalHeader
        headerText={'Add Traps'}
        showHeaderButton={true}
        closeModal={closeModal}
        headerButton={
          <Button
            bg='primary'
            mx='2'
            px='10'
            shadow='3'
            // isDisabled={}
            onPress={() => {
              // handleSubmit()
              closeModal()
            }}
          >
            <Text fontSize='xl' color='white'>
              Add Trap
            </Text>
          </Button>
        }
      />
      <Divider my={2} thickness='3' />
      <VStack px='5%' space={4}></VStack>
    </>
  )
}

export default AddTrapModalContent
