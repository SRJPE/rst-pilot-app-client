import { Box, Pressable, Text } from 'native-base'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { addForkLengthToBatchStore } from '../../../redux/reducers/formSlices/fishInputSlice'
import { TabStateI } from '../../../redux/reducers/formSlices/tabSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import { createArray } from '../../../utils/utils'

const BatchCountButtonGrid = ({
  firstButton,
  numberOfAdditionalButtons,
  selectedLifeStage,
  ignoreLifeStage,
  tabSlice
}: {
  firstButton: number
  numberOfAdditionalButtons: number
  selectedLifeStage?: string
  ignoreLifeStage?: boolean
  tabSlice: TabStateI
}) => {
  const [numArray, setNumArray] = useState([] as number[])
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setNumArray(createArray(firstButton, numberOfAdditionalButtons))
  }, [firstButton])

  const handlePress = (num: number) => {
    const activeTabId = tabSlice.activeTabId
    if (activeTabId) {
      dispatch(
        addForkLengthToBatchStore({
          tabId: activeTabId,
          forkLength: num,
          lifeStage: ignoreLifeStage ? 'not recorded' : selectedLifeStage,
        })
      )
    }
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

const mapStateToProps = (state: RootState) => {
  return {
    tabSlice: state.tabSlice,
  }
}

export default connect(mapStateToProps)(BatchCountButtonGrid)
