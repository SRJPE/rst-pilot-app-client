import { useEffect, useState } from 'react'
import { Box, HStack, VStack, Text, Progress } from 'native-base'
import { getHeaderTitle } from '@react-navigation/elements'
import { getPosition, formStepLength } from '../../services/utils'

export default function ProgressHeader(props: any) {
  const [position, setPosition] = useState(0 as number)
  const [title, setTitle] = useState('' as string)

  useEffect(() => {
    const title = getHeaderTitle(props.options, props.route.name)
    let currentPosition
    //if the title is not high flows or non func
    //getposition()
    //otherwise  position is formStepLength
    if (title !== 'HighFlows' && title !== 'Non Functional Trap') {
      currentPosition = getPosition(title) || 1
    } else {
      currentPosition = formStepLength
    }

    setTitle(title)
    setPosition(currentPosition)
  }, [props])

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
