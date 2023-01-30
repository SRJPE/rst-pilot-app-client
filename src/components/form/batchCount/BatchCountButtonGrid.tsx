import { Box, Pressable, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addForkLengthToBatchCount } from '../../../redux/reducers/formSlices/fishInputSlice'
import { AppDispatch } from '../../../redux/store'
import { createArray } from '../../../utils/utils'

const BatchCountButtonGrid = ({
  buttonValueStart,
}: {
  buttonValueStart: number
}) => {
  const [numArray, setNumArray] = useState([] as number[])
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setNumArray(createArray(buttonValueStart))
  }, [buttonValueStart])

  const handlePress = (num: number) => {
    dispatch(addForkLengthToBatchCount(num))
  }

  return (
    <Box
      flexDirection='row'
      justifyContent='center'
      alignItems='center'
      flexWrap='wrap'
    >
      {numArray.map((num: number, idx: number) => {
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
            >
              <Text fontSize='lg' bold color='white'>
                {num}
              </Text>
            </Box>
          </Pressable>
        )
      })}
    </Box>
  )
}

export default BatchCountButtonGrid
