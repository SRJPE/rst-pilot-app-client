import { Box, HStack, VStack, Text, Progress } from 'native-base'
import { useSelector } from 'react-redux'
import { numOfFormSteps } from '../../redux/reducers/formSlices/navigationSlice'

export default function ProgressHeader(props: any) {
  const navigationState = useSelector((state: any) => state.navigation)
  const { steps, activeStep } = navigationState
  const activePageTitle = steps[activeStep]?.name
  let currentStep =
    activeStep > numOfFormSteps ? `${numOfFormSteps}` : activeStep

  const renderCurrentStepOfTotalSteps = () => {
    //if page is Historical Data render step as 1
    if (activeStep === 14) {
      currentStep = '1'
    }
    const totalSteps = `${numOfFormSteps}`

    return `Step ${currentStep} of ${totalSteps}`
  }
  return (
    <Box>
      <VStack>
        <HStack w='100%' justifyContent='space-between' p='4'>
          <Text fontSize='2xl'>
            {activePageTitle === 'Trap Operations'
              ? 'Trap Operations & Environmental Conditions'
              : activePageTitle}
          </Text>
          <Text fontSize='xl'>{renderCurrentStepOfTotalSteps()}</Text>
        </HStack>
        <Box w='100%'>
          <Progress
            bg='secondary'
            _filledTrack={{
              bg: 'primary',
            }}
            value={(currentStep / numOfFormSteps) * 100}
            mx='4'
          />
        </Box>
      </VStack>
    </Box>
  )
}
