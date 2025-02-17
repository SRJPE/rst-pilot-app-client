import { Box, Pressable, Text } from 'native-base'
import React, { useEffect, useState, useMemo } from 'react'
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
          Please select a fork length size range.
        </Text>
      )}
    </Box>
  )
}

export default BatchCountButtonGrid
