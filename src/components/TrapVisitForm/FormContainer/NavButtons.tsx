import { Box, HStack, Image, VStack, Text, Pressable } from 'native-base'

export default function NavButtons() {
  return (
    <Box bg='themeGrey' py='5' px='3' maxWidth='100%'>
      <HStack justifyContent='space-between'>
        <Pressable
          rounded='xs'
          bg='secondary'
          alignSelf='flex-start'
          py='3'
          px='175'
          borderRadius='5'
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='primary'
          >
            Back
          </Text>
        </Pressable>
        <Pressable
          rounded='xs'
          bg='primary'
          alignSelf='flex-start'
          py='3'
          px='175'
          borderRadius='5'
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='white'
          >
            Next
          </Text>
        </Pressable>
      </HStack>
    </Box>
  )
}
