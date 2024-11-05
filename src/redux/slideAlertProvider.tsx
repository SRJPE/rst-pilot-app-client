import { RootState } from './store'
import { useSelector } from 'react-redux'
import { Box, CheckIcon, WarningIcon, HStack, Slide, Text } from 'native-base'
import { SlideAlertInitialStateI } from './reducers/slideAlertSlice'

type Props = {
  children: React.ReactNode
}

const SlideAlertProvider = (props: Props) => {
  const { slideAlertOpen, slideAlertTitle, slideAlertColor } = useSelector(
    (state: RootState) => state.slideAlert as SlideAlertInitialStateI
  )

  const bgColorMap = {
    success: 'emerald.100',
    error: 'red.100',
    warning: 'amber.100',
    info: 'blue.100',
  }

  const textColorMap = {
    success: 'emerald.600',
    error: 'red.600',
    warning: 'amber.600',
    info: 'blue.600',
  }

  return (
    <>
      <Slide in={slideAlertOpen} placement='top'>
        <Box
          w='100%'
          position='absolute'
          p='2'
          borderRadius='xs'
          bg={bgColorMap[slideAlertColor]}
          alignItems='center'
          justifyContent='center'
          safeArea
        >
          <HStack space={4} alignItems='center'>
            {slideAlertColor === 'success' && (
              <CheckIcon size='6' color={textColorMap.success} mt='1' />
            )}
            {slideAlertColor === 'error' && (
              <WarningIcon size='6' color={textColorMap.error} mt='1' />
            )}
            <Text
              fontSize={16}
              color={textColorMap[slideAlertColor]}
              textAlign='center'
              fontWeight='medium'
            >
              {/* {slideAlertTitle
                ? `${slideAlertTitle} added successfully`
                : 'Save complete'} */}
              {slideAlertTitle || 'Save complete'}
            </Text>
          </HStack>
        </Box>
      </Slide>

      {props.children}
    </>
  )
}

export default SlideAlertProvider
