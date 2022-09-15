import { useState } from 'react'
import { Box, HStack, VStack, Text, Progress } from 'native-base'
import { getHeaderTitle } from '@react-navigation/elements'
import { getPosition } from '../../services/utils'

export default function ProgressStepperHeader(props: any) {
  const title = getHeaderTitle(props.options, props.route.name)
  const position = getPosition(title) || 1
  console.log('🚀 ~ ProgressStepperHeader ~ position', position)

  return (
    <Box>
      <VStack space={4}>
        <HStack w='100%' justifyContent='space-between' px='4'>
          <Text fontSize='lg'>{title || 'hello'}</Text>
          <Text>{`Step ${position} of 6`}</Text>
        </HStack>
        <Box w='100%'>
          <Progress
            bg='secondary'
            _filledTrack={{
              bg: 'primary',
            }}
            value={(position / 6) * 100}
            mx='4'
          />
        </Box>
      </VStack>
    </Box>
  )
}
