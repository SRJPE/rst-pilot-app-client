import {
  Box,
  Button,
  FormControl,
  Input,
  Popover,
  Pressable,
  ScrollView,
  Text,
} from 'native-base'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { uid } from 'uid'
import { addForkLengthToBatchStore } from '../../../redux/reducers/formSlices/batchCountSlice'
import { AppDispatch } from '../../../redux/store'
import { findRunDefinition } from '../../../utils/helpers/helperFunctions'
import { createArray } from '../../../utils/utils'

const ForkLengthButton = React.memo(
  ({ num, onPress }: { num: number; onPress: (n: number) => void }) => (
    <Pressable onPress={() => onPress(num)} _pressed={{ bg: 'pink' }}>
      {({ isPressed }: { isPressed: boolean }) => (
        <Box
          justifyContent='center'
          alignItems='center'
          bg={isPressed ? 'secondary' : 'primary'}
          h='55'
          w='60'
          margin='2'
          borderRadius='sm'
        >
          <Text fontSize='lg' bold color='white'>
            {num}
          </Text>
        </Box>
      )}
    </Pressable>
  )
)

const BatchCountButtonGrid = ({
  firstButton,
  numberOfAdditionalButtons,
  selectedLifeStage,
  ignoreLifeStage,
  deadToggle,
  markToggle,
  miltingToggle,
  eggsToggle,
  adiposeClippedToggle,
  fishConditions,
  handleToggles,
  activeTabId,
  species,
  ladObject,
  taxonCode,
  visitSetupState,
}: {
  firstButton: number
  numberOfAdditionalButtons: number
  selectedLifeStage?: string
  ignoreLifeStage?: boolean
  deadToggle: boolean
  markToggle: boolean
  miltingToggle: boolean | null
  eggsToggle: boolean | null
  adiposeClippedToggle?: boolean
  fishConditions: string[]
  handleToggles: any
  activeTabId: string | null
  species: string
  taxonCode?: string
  ladObject: any
  visitSetupState: any
}) => {
  const [numArray, setNumArray] = useState([] as number[])

  const dispatch = useDispatch<AppDispatch>()
  const [showPopover, setShowPopover] = useState<boolean>(false)

  // No local buffering: dispatch immediately on press to avoid missed taps

  useEffect(() => {
    setNumArray(createArray(firstButton, numberOfAdditionalButtons))
  }, [firstButton])

  const handlePress = useCallback((num: number) => {
    let runDefinition = null as string | null | undefined
    if (species === 'Chinook salmon' && activeTabId && ladObject) {
      runDefinition = findRunDefinition({
        ladObject,
        number: num,
        trapSite: visitSetupState?.[activeTabId]?.values?.trapSite,
      })
    }

    // dispatch immediately to avoid missing taps
    dispatch(
      addForkLengthToBatchStore({
        uid: uid(),
        species: species,
        forkLength: num,
        lifeStage: ignoreLifeStage ? null : selectedLifeStage,
        dead: deadToggle,
        existingMark: markToggle,
        milting: miltingToggle,
        eggs: eggsToggle,
        adiposeClipped: adiposeClippedToggle || false,
        fishConditions,
        runDefinition: runDefinition,
        taxonCode,
      })
    )
    handleToggles('reset')
  }, [dispatch, species, activeTabId, ladObject, visitSetupState, ignoreLifeStage, selectedLifeStage, deadToggle, markToggle, miltingToggle, eggsToggle, adiposeClippedToggle, fishConditions, taxonCode, handleToggles])

  const [customForkLengthValue, setCustomForkLengthValue] = useState<string>('')

  const saveValue = () => {
    handlePress(+customForkLengthValue)
    closePopover()
  }

  const closePopover = () => {
    setShowPopover(false)
    setCustomForkLengthValue('')
  }

  const validateCustomForkLength = (value: string) => {
    const num = +value
    if (isNaN(num)) {
      return 'Enter a valid number'
    }

    if (num < 10) {
      return 'Entered fork length value must be at least 10'
    }

    return 'valid'
  }

  const showEnterNumberButton = numArray?.at(-1) === 117
  const initialFocusRef = useRef(null)

  useEffect(() => {
    return () => {
      // nothing to flush when dispatching immediately
    }
  }, [])

  return (
    <ScrollView display='flex' height='210' keyboardShouldPersistTaps='handled'>
      <Box
        flexDirection='row'
        justifyContent='flex-start'
        alignItems='center'
        flexWrap='wrap'
        width={'96%'}
        mx={'auto'}
      >
        {numArray.length > 1 ? (
          numArray.map((num: number, idx: number) => (
            <ForkLengthButton key={idx} num={num} onPress={handlePress} />
          ))
        ) : (
          <Text bold fontSize='lg'>
            Please select a fork length size range.
          </Text>
        )}
        {showEnterNumberButton && (
          <Popover
            initialFocusRef={initialFocusRef}
            isOpen={showPopover}
            onClose={() => closePopover()}
            trigger={triggerProps => {
              return (
                <Pressable
                  {...triggerProps}
                  onPress={() => setShowPopover(true)}
                >
                  <Box
                    justifyContent='center'
                    alignItems='center'
                    bg='primary'
                    h='55'
                    w='135'
                    margin='2'
                    borderRadius='sm'
                    shadow='3'
                  >
                    <Text fontSize='lg' bold color='white'>
                      {`Enter Value`}
                    </Text>
                  </Box>
                </Pressable>
              )
            }}
          >
            <Popover.Content width='56'>
              <Popover.Arrow />
              {/* @ts-ignore */}
              <Popover.Header>Enter Fork Length</Popover.Header>
              <Popover.Body>
                <FormControl>
                  <FormControl.Label
                    _text={{
                      fontSize: 'xs',
                      fontWeight: 'medium',
                    }}
                  >
                    Fork Length
                  </FormControl.Label>
                  <Input
                    rounded='sm'
                    fontSize='xs'
                    ref={initialFocusRef}
                    value={customForkLengthValue}
                    onChangeText={text => {
                      setCustomForkLengthValue(text)
                    }}
                    keyboardType='numeric'
                  />
                </FormControl>
              </Popover.Body>
              <Popover.Footer style={{ display: 'flex', gap: 10 }}>
                <Button
                  onPress={closePopover}
                  variant='outline'
                  borderColor={'error'}
                  flex={1}
                >
                  <Text color='error' bold>
                    Cancel
                  </Text>
                </Button>
                <Button
                  variant='solid'
                  bg='primary'
                  onPress={() => {
                    const validationResult = validateCustomForkLength(
                      customForkLengthValue
                    )

                    const isValid = validationResult === 'valid'
                    if (isValid) {
                      saveValue()
                    } else {
                      alert(validationResult)
                    }
                  }}
                  flex={1}
                >
                  <Text color={'white'} bold>
                    Save
                  </Text>
                </Button>
              </Popover.Footer>
            </Popover.Content>
          </Popover>
        )}
      </Box>
    </ScrollView>
  )
}

export default React.memo(
  BatchCountButtonGrid,
  (prev, next) => {
    if (prev.activeTabId !== next.activeTabId) return false
    const prevSite =
      prev.visitSetupState?.[prev.activeTabId ?? '']?.values?.trapSite
    const nextSite =
      next.visitSetupState?.[next.activeTabId ?? '']?.values?.trapSite
    return (
      prev.firstButton === next.firstButton &&
      prev.numberOfAdditionalButtons === next.numberOfAdditionalButtons &&
      prev.selectedLifeStage === next.selectedLifeStage &&
      prev.ignoreLifeStage === next.ignoreLifeStage &&
      prev.deadToggle === next.deadToggle &&
      prev.markToggle === next.markToggle &&
      prev.miltingToggle === next.miltingToggle &&
      prev.eggsToggle === next.eggsToggle &&
      prev.adiposeClippedToggle === next.adiposeClippedToggle &&
      prev.fishConditions === next.fishConditions &&
      prev.handleToggles === next.handleToggles &&
      prev.species === next.species &&
      prev.taxonCode === next.taxonCode &&
      prev.ladObject === next.ladObject &&
      prevSite === nextSite
    )
  }
)
