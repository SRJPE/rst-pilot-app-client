import { Box, HStack, VStack, Text, Progress } from 'native-base'
import { useSelector } from 'react-redux'

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

  const renderCurrentStepOfTotalSteps = () => {
    const currentStep = activeStep > 6 ? '6' : activeStep
    const totalSteps = '6'

    return `Step ${currentStep} of ${totalSteps}`
  }
  return (
    <Box>
      <VStack>
        <HStack w='100%' justifyContent='space-between' p='4'>
          <Text fontSize='2xl'>{renderPageTitle()}</Text>
          <Text fontSize='xl'>{renderCurrentStepOfTotalSteps()}</Text>
        </HStack>
        <Box w='100%'>
          <Progress
            bg='secondary'
            _filledTrack={{
              bg: 'primary',
            }}
            value={(activeStep / 6 || Object.keys(steps).length) * 100}
            mx='4'
          />
        </Box>
      </VStack>
    </Box>
  )
}
