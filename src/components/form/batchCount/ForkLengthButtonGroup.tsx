import { Button, Text } from 'native-base'
import React, { useState } from 'react'
import { buttonLookup } from '../../../utils/utils'

const ForkLengthButtonGroup = ({
  setForkLengthRange,
}: {
  setForkLengthRange: any
}) => {
  const handlePressGroupButton = (key: string) => {
    setForkLengthRange(buttonLookup[key])
  }

  return (
    <Button.Group
      isAttached
      variant='subtle'
      colorScheme='muted'
      alignSelf='center'
    >
      {buttonLookup &&
        Object.keys(buttonLookup).map((label: string, idx: number) => (
          <Button
            key={idx}
            borderWidth='1'
            onPress={() => handlePressGroupButton(label)}
          >
            <Text fontSize='md'>{label}</Text>
          </Button>
        ))}
    </Button.Group>
  )
}

export default ForkLengthButtonGroup
