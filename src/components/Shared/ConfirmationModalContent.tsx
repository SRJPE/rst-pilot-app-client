import { Box, Text, HStack, Button } from 'native-base'
import React from 'react'

type Props = {
  modalHeader: string
  modalText: string
  cancelButtonLabel?: string
  confirmButtonLabel?: string
  handlePressCancel?: () => void
  handlePressConfirm?: () => void
}

const ConfirmationModalContent = ({
  modalHeader,
  modalText,
  cancelButtonLabel = 'Cancel',
  confirmButtonLabel = 'Confirm',
  handlePressCancel,
  handlePressConfirm,
}: Props) => {
  return (
    <Box display='flex' height='175' paddingX={10} paddingY={5}>
      <Text textAlign='center' fontSize='lg' bold marginBottom={1}>
        {modalHeader}
      </Text>
      <Text textAlign='center' marginBottom={5}>
        {modalText}
      </Text>
      <HStack justifyContent='center'>
        <Button
          marginRight={2}
          borderWidth={1}
          width={175}
          backgroundColor='transparent'
          borderColor='error'
          color='error'
          onPress={handlePressCancel}
        >
          <Text color='error'>{cancelButtonLabel}</Text>
        </Button>
        <Button
          background='primary'
          onPress={handlePressConfirm}
          width={175}
          marginLeft={3}
        >
          {confirmButtonLabel}
        </Button>
      </HStack>
    </Box>
  )
}

export default ConfirmationModalContent
