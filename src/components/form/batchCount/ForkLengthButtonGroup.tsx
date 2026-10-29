import { Button, Text } from 'native-base'
import React, { useCallback, useMemo, useRef } from 'react'
import { getButtonLookup } from '../../../utils/utils'

const ForkLengthButtonGroup = ({
  setFirstButton,
  setLifeStageRadioValue,
  setNumberOfAdditionalButtons,
  selectedProgramObj,
  disabled = false,
}: {
  setFirstButton: any
  setLifeStageRadioValue: any
  setNumberOfAdditionalButtons: any
  selectedProgramObj: any
  disabled?: boolean
}) => {
  const buttonLookup = useMemo(
    () => getButtonLookup(selectedProgramObj),
    [selectedProgramObj]
  )

  // Guard against RN's Pressable double-firing onPress for a single tap
  // (see BatchCountButtonGrid.tsx for the same pattern and rationale).
  const lastPressRef = useRef<number>(0)
  const DOUBLE_PRESS_GUARD_MS = 250

  const handlePressGroupButton = useCallback(
    (key: string) => {
      const now = Date.now()
      if (now - lastPressRef.current < DOUBLE_PRESS_GUARD_MS) return
      lastPressRef.current = now

      setFirstButton(buttonLookup[key].firstButton)
      setNumberOfAdditionalButtons(buttonLookup[key].additionalButtons)
      if (selectedProgramObj.streamName.toLowerCase().includes('butte')) return
      setLifeStageRadioValue(buttonLookup[key].lifeStage)
    },
    [
      buttonLookup,
      selectedProgramObj,
      setFirstButton,
      setNumberOfAdditionalButtons,
      setLifeStageRadioValue,
    ]
  )

  return (
    <Button.Group
      isDisabled={disabled}
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

export default React.memo(ForkLengthButtonGroup)
