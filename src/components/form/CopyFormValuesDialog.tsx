import { Entypo } from '@expo/vector-icons'
import { AlertDialog, Button, Center, Icon, Text } from 'native-base'
import { useRef, useState } from 'react'

const CopyFormValuesDialog = ({
  onSubmit,
  step,
}: {
  step: string
  onSubmit: () => void
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClose = () => setIsOpen(false)

  const cancelRef = useRef(null)
  return (
    <Center>
      <Button
        variant='outline'
        onPress={() => setIsOpen(!isOpen)}
        w='full'
        endIcon={<Icon as={Entypo} name='copy' color='black' />}
      >
        <Text>{`Copy ${step} Values`}</Text>
      </Button>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{`Copy ${step} Values`}</AlertDialog.Header>
          <AlertDialog.Body>
            {`This will copy the current ${step} values to other tabs. Existing values in the target tabs will be overridden. This action cannot be reversed. Please confirm to proceed.`}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant='unstyled'
                colorScheme='coolGray'
                onPress={onClose}
                ref={cancelRef}
              >
                Cancel
              </Button>
              <Button
                bg='primary'
                onPress={() => {
                  onSubmit()
                  onClose()
                }}
              >
                Confirm
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  )
}

export default CopyFormValuesDialog
