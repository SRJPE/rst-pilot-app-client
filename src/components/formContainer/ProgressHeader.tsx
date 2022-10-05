import { Box, HStack, VStack, Text, Progress } from 'native-base'
import { useSelector } from 'react-redux'

export default function ProgressHeader(props: any) {
  const navigationState = useSelector((state: any) => state.navigation)
  const { steps, activeStep } = navigationState
  const activePageTitle = steps[activeStep]?.name

  return (
    <Box>
      <VStack space={4}>
        <HStack w='100%' justifyContent='space-between' px='4'>
          <Text fontSize='lg'>{activePageTitle || ''}</Text>
          <Text>{`Step ${navigationState.activeStep} of ${
            Object.keys(navigationState.steps).length
          }`}</Text>
        </HStack>
        <Box w='100%'>
          <Progress
            bg='secondary'
            _filledTrack={{
              bg: 'primary',
            }}
            value={(activeStep / Object.keys(steps).length) * 100}
            mx='4'
          />
        </Box>
      </VStack>
    </Box>
  )
}
