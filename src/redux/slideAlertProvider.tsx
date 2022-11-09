import { RootState } from './store'
import { useSelector } from 'react-redux'
import { Box, CheckIcon, HStack, Slide, Text } from 'native-base'

type Props = {
  children: React.ReactNode
}

const SlideAlertProvider = (props: Props) => {
  const { slideAlertOpen, slideAlertTitle } = useSelector(
    (state: RootState) => state.slideAlert as any
  )

  return (
    <>
      <Slide in={slideAlertOpen} placement='top'>
        <Box
          w='100%'
          position='absolute'
          p='2'
          borderRadius='xs'
          bg='emerald.100'
          alignItems='center'
          justifyContent='center'
          safeArea
        >
          <HStack space={4} alignItems='center'>
            <CheckIcon size='6' color='emerald.600' mt='1' />
            <Text
              fontSize={16}
              color='emerald.600'
              textAlign='center'
              fontWeight='medium'
            >
              {slideAlertTitle
                ? `${slideAlertTitle} added successfully`
                : 'Save complete'}
            </Text>
          </HStack>
        </Box>
      </Slide>

      {props.children}
    </>
  )
}

export default SlideAlertProvider
