import { Box, Pressable, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addForkLengthToBatchCount } from '../../../redux/reducers/formSlices/fishInputSlice'
import { AppDispatch } from '../../../redux/store'
import { createArray } from '../../../utils/utils'

const BatchCountButtonGrid = ({
  firstButton,
  numberOfAdditionalButtons,
}: {
  firstButton: number
  numberOfAdditionalButtons: number
}) => {
  const [numArray, setNumArray] = useState([] as number[])
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setNumArray(createArray(firstButton, numberOfAdditionalButtons))
  }, [firstButton])

  const handlePress = (num: number) => {
    dispatch(addForkLengthToBatchCount(num))
  }

  return (
    <Box
      flexDirection='row'
      justifyContent='center'
      alignItems='center'
      flexWrap='wrap'
      height='234'
    >
      {numArray.length > 1 ? (
        numArray.map((num: number, idx: number) => {
          return (
            <Pressable key={idx} onPress={() => handlePress(num)}>
              <Box
                justifyContent='center'
                alignItems='center'
                bg='#FFC5B6'
                h='70'
                w='70'
                margin='1'
                borderRadius='sm'
                shadow='3'
              >
                <Text fontSize='lg' bold color='white'>
                  {num}
                </Text>
              </Box>
            </Pressable>
          )
        })
      ) : (
        <Text bold fontSize='lg'>
          PLease select a fork length size range.
        </Text>
      )}
    </Box>
  )
}

export default BatchCountButtonGrid
