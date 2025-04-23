import {
  Box,
  Pressable,
  Text,
  ScrollView,
  Popover,
  FormControl,
  Input,
  Button,
} from 'native-base'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addForkLengthToBatchStore } from '../../../redux/reducers/formSlices/batchCountSlice'
import { AppDispatch } from '../../../redux/store'
import { createArray } from '../../../utils/utils'
import {
  findLengthAtDateRun,
  findRunDefinition,
} from '../../../utils/helpers/helperFunctions'

const BatchCountButtonGrid = ({
  firstButton,
  numberOfAdditionalButtons,
  selectedLifeStage,
  ignoreLifeStage,
  deadToggle,
  markToggle,
  fishConditions,
  handleToggles,
  trapOperationsStore,
  dropdownsStore,
  activeTabId,
  species,
}: {
  firstButton: number
  numberOfAdditionalButtons: number
  selectedLifeStage?: string
  ignoreLifeStage?: boolean
  deadToggle: boolean
  markToggle: boolean
  fishConditions: string[]
  handleToggles: any
  trapOperationsStore: any
  dropdownsStore: any
  activeTabId: string | null
  species: string
}) => {
  const [numArray, setNumArray] = useState([] as number[])
  const [lengthAtDate, setLengthAtDate] = useState([] as number[])
  const dispatch = useDispatch<AppDispatch>()
  const [showPopover, setShowPopover] = useState<boolean>(false)

  useEffect(() => {
    setLengthAtDate(dropdownsStore.values.lengthAtDate)
  }, [dropdownsStore.values])

  useEffect(() => {
    setNumArray(createArray(firstButton, numberOfAdditionalButtons))
  }, [firstButton])

  const handlePress = (num: number) => {
    let runDefinition = null as string | null
    if (species === 'Chinook salmon' && activeTabId) {
      const ladObj = findLengthAtDateRun(
        lengthAtDate,
        trapOperationsStore?.[activeTabId]?.values?.trapVisitStopTime
      )

      runDefinition = findRunDefinition(ladObj, num)
    }
    dispatch(
      addForkLengthToBatchStore({
        forkLength: num,
        lifeStage: ignoreLifeStage ? null : selectedLifeStage,
        dead: deadToggle,
        existingMark: markToggle,
        fishConditions,
        runDefinition: runDefinition,
      })
    )
    handleToggles('reset')
  }

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

  return (
    <ScrollView display='flex' height='210'>
      <Box
        flexDirection='row'
        justifyContent='flex-start'
        alignItems='center'
        flexWrap='wrap'
        width={'96%'}
        mx={'auto'}
      >
        {numArray.length > 1 ? (
          numArray.map((num: number, idx: number) => {
            return (
              <Pressable key={idx} onPress={() => handlePress(num)}>
                <Box
                  justifyContent='center'
                  alignItems='center'
                  bg='primary'
                  h='55'
                  w='60'
                  margin='2'
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

export default BatchCountButtonGrid
