import { Button, Divider, Text, VStack } from 'native-base'

import CustomModalHeader from '../Shared/CustomModalHeader'

const AddCrewMemberModalContent = ({ closeModal }: { closeModal: any }) => {
  return (
    <>
      <CustomModalHeader
        headerText={'Add Crew Member'}
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
              Save
            </Text>
          </Button>
        }
      />
      <Divider my={2} thickness='3' />
      <VStack px='5%' space={4}></VStack>
    </>
  )
}

export default AddCrewMemberModalContent
