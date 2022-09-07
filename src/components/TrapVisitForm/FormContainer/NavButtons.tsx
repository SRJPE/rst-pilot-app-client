import { Box, HStack, Text, Button } from 'native-base'

export default function NavButtons({ navigation }: { navigation: any }) {
  const handleBack = () => {
    navigation.navigate('Home')
  }
  const handleNext = () => {
    navigation.navigate('Trap Visit Data Entry')
  }

  return (
    <Box bg='themeGrey' py='5' px='3' maxWidth='100%'>
      <HStack justifyContent='space-between'>
        <Button
          rounded='xs'
          bg='secondary'
          alignSelf='flex-start'
          py='3'
          px='175'
          borderRadius='5'
          onPress={handleBack}
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='primary'
          >
            Back
          </Text>
        </Button>
        <Button
          rounded='xs'
          bg='primary'
          alignSelf='flex-start'
          py='3'
          px='175'
          borderRadius='5'
          onPress={handleNext}
        >
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontWeight='bold'
            color='white'
          >
            Next
          </Text>
        </Button>
      </HStack>
    </Box>
  )
}
