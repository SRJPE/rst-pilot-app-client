import {
  Alert,
  Box,
  Center,
  CloseIcon,
  HStack,
  IconButton,
  Text,
  VStack,
  Pressable,
} from 'native-base'

type AlertDialogProps = {
  title: string
  description: string
  onPress?: () => void
}

const AlertDialog = ({ title, description, onPress }: AlertDialogProps) => {
  return (
    <Center>
      <Alert
        maxW='600'
        bg='secondary'
        borderTopColor={'primary'}
        variant={'top-accent'}
      >
        <Pressable onPress={onPress}>
          <VStack space={2} flexShrink={1} w='100%'>
            <HStack
              flexShrink={1}
              space={2}
              alignItems='center'
              justifyContent='space-between'
            >
              <HStack flexShrink={1} space={2} alignItems='center'>
                <Alert.Icon />
                <Text fontSize='md' fontWeight='medium' color='coolGray.800'>
                  {title}{' '}
                </Text>
              </HStack>
              <IconButton
                variant='unstyled'
                _focus={{
                  borderWidth: 0,
                }}
                icon={<CloseIcon size='3' />}
                _icon={{
                  color: 'coolGray.600',
                }}
              />
            </HStack>
            <Box
              pl='6'
              _text={{
                color: 'coolGray.600',
              }}
            >
              {description}
            </Box>
          </VStack>
        </Pressable>
      </Alert>
    </Center>
  )
}

export default AlertDialog
