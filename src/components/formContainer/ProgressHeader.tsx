import { useEffect, useMemo, useState } from 'react'
import { Box, HStack, VStack, Text, Progress } from 'native-base'
import { getHeaderTitle } from '@react-navigation/elements'
import { getPosition, formStepLength } from '../../services/utils'

export default function ProgressHeader(props: any) {
  const title = useMemo(
    () => getHeaderTitle(props.options, props.route.name),
    [props]
  )
  const position = useMemo(() => getPosition(title) || 1, [props])

  return (
    <Box>
      <VStack space={4}>
        <HStack w='100%' justifyContent='space-between' px='4'>
          <Text fontSize='lg'>{title || ''}</Text>
          <Text>{`Step ${position} of ${formStepLength}`}</Text>
        </HStack>
        <Box w='100%'>
          <Progress
            bg='secondary'
            _filledTrack={{
              bg: 'primary',
            }}
            value={(position / formStepLength) * 100}
            mx='4'
          />
        </Box>
      </VStack>
    </Box>
  )
}
