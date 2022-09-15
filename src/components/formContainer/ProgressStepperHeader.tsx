import { Box, HStack, VStack, Text, Progress } from 'native-base'
import { useState } from 'react'

export default function ProgressStepperHeader(props: any) {
  const [step, setStep] = useState(1 as number)
  return (
    <Box>
      <VStack space={4}>
        <HStack w='100%' justifyContent='space-between'>
          <Text fontSize='lg'>Visit Setup</Text>
          <Text>{`Step ${step} of 6`}</Text>
        </HStack>
        <Box w='100%'>
          <Progress
            bg='coolGray.100'
            _filledTrack={{
              bg: 'primary',
            }}
            value={(step / 6) * 100}
            mx='4'
          />
        </Box>
      </VStack>
    </Box>
  )
}
