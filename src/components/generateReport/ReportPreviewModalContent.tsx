import React from 'react'
import { Divider, VStack } from 'native-base'
import CustomModalHeader from '../Shared/CustomModalHeader'

const ReportPreviewModalContent = ({ closeModal }: { closeModal: any }) => {
  return (
    <>
      <CustomModalHeader
        headerText={'Title Placeholder'}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      <Divider my={2} thickness='3' />
      <VStack space={5} m='5%'></VStack>
    </>
  )
}

export default ReportPreviewModalContent
