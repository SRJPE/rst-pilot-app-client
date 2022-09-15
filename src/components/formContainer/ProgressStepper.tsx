import {
  Box,
  HStack,
  Image,
  VStack,
  Text,
  Pressable,
  Center,
  Progress,
} from 'native-base'

export default function ProgressStepper(props: any) {
  return (
    <Box
      // bg='themeGrey'
      py='3'
      px='3'
      maxWidth='100%'
      justifyContent='space-between'
    >
      <VStack space={4}>
        <HStack justifyContent='space-between'>
          <Text fontSize='lg'>Visit Setup</Text>
          <Text>Step 1</Text>
        </HStack>
        <Center w='100%'>
          <Box w='100%'>
            <Progress value={45} mx='4' />
          </Box>
        </Center>
      </VStack>
    </Box>
  )
}
