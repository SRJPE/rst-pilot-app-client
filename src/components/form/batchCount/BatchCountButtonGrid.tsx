import { Box, Pressable, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { createArray } from '../../../utils/utils'

const BatchCountButtonGrid = ({
  buttonValueStart,
}: {
  buttonValueStart: number
}) => {
  const [numArray, setNumArray] = useState([] as number[])

  useEffect(() => {
    setNumArray(createArray(buttonValueStart))
  }, [buttonValueStart])

  return (
    <Box
      flexDirection='row'
      justifyContent='center'
      alignItems='center'
      flexWrap='wrap'
    >
      {numArray.map((num: number, idx: number) => {
        return (
          <Box
            key={idx}
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
        )
      })}
    </Box>
  )
}

export default BatchCountButtonGrid
