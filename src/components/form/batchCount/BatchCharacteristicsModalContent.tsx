import { Button, Divider, Text } from 'native-base'
import React from 'react'
import CustomModalHeader from '../../Shared/CustomModalHeader'

const BatchCharacteristicsModalContent = ({
  closeModal,
}: {
  closeModal: any
}) => {
  return (
    <>
      <CustomModalHeader
        headerText={'Choose Batch Characteristics'}
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
            // onPress={() => {
            //   handleSubmit()
            //   closeModal()
            // }}
          >
            <Text fontSize='xl' color='white'>
              Save
            </Text>
          </Button>
        }
      />
      <Divider my={2} thickness='3' />
    </>
  )
}

export default BatchCharacteristicsModalContent
