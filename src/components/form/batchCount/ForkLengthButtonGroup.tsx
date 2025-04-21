import { Button, Text } from 'native-base'
import React from 'react'
import { buttonLookup } from '../../../utils/utils'

const ForkLengthButtonGroup = ({
  setFirstButton,
  setLifeStageRadioValue,
  setNumberOfAdditionalButtons,
}: {
  setFirstButton: any
  setLifeStageRadioValue: any
  setNumberOfAdditionalButtons: any
}) => {
  const handlePressGroupButton = (key: string) => {
    setFirstButton(buttonLookup[key].firstButton)
    setNumberOfAdditionalButtons(buttonLookup[key].additionalButtons)
    setLifeStageRadioValue(buttonLookup[key].lifeStage)
  }

  return (
    <Button.Group
      isAttached
      variant='subtle'
      colorScheme='muted'
      alignSelf='center'
      display='flex'
      justifyContent='center'
      px='3%'
    >
      {buttonLookup &&
        Object.keys(buttonLookup).map((label: string, idx: number) => (
          <Button
            // bg='secondary'
            // _focus={{ bg: 'secondary' }}
            // _pressed={{ bg: 'secondary' }}
            isFocused
            key={idx}
            borderWidth='1'
            px='5%'
            shadow='3'
            flex={1}
            onPress={() => handlePressGroupButton(label)}
          >
            <Text fontSize='md'>{label}</Text>
          </Button>
        ))}
    </Button.Group>
  )
}

export default ForkLengthButtonGroup
