import React, { useEffect } from 'react'
import { AppDispatch, RootState } from './store'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CheckIcon, HStack, Slide, Text } from 'native-base'

type Props = {
  children: React.ReactNode
}

const SlideAlertProvider = (props: Props) => {
  const { slideAlertOpen, slideAlertInfo } = useSelector(
    (state: RootState) => state.slideAlert
  )
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {}, [])

  return (
    <>
      <Slide in={slideAlertOpen} placement='top' duration={300}>
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
            {/* <Icon
                    as={FontAwesome5}
                    name='fish'
                    size='8'
                    color='emerald.600'
                  /> */}
            <Text
              fontSize={16}
              color='emerald.600'
              textAlign='center'
              fontWeight='medium'
            >
              {slideAlertInfo === 'Add Fish'
                ? 'Fish added successfully'
                : 'Form Section Saved'}
            </Text>
          </HStack>
        </Box>
      </Slide>

      {props.children}
    </>
  )
}

export default SlideAlertProvider
