import { Box, HStack, VStack, Text, Progress } from 'native-base'
import { useSelector } from 'react-redux'
import TrapPostProcessing from '../../screens/formScreens/trapOperations/TrapPostProcessing'

export default function ProgressHeader(props: any) {
  const navigationState = useSelector((state: any) => state.navigation)
  const { steps, activeStep } = navigationState
  const activePageTitle = steps[activeStep]?.name

  const renderPageTitle = () => {
    let title
    activePageTitle === 'Trap Post-Processing' ||
    activePageTitle === 'Trap Pre-Processing'
      ? (title = 'Trap Operations')
      : (title = activePageTitle)
    return title
  }
  return (
    <Box>
      <VStack>
        <HStack w='100%' justifyContent='space-between' p='4'>
          <Text fontSize='2xl'>{renderPageTitle()}</Text>
          <Text fontSize='xl'>{`Step ${navigationState.activeStep} of ${
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
