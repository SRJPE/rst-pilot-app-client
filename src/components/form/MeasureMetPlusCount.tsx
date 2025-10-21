import React, { useEffect } from 'react'
import {
  // FormControl,
  VStack,
  Text,
  Button,
  Box,
  ScrollView,
} from 'native-base'
import { Input, InputField } from '@/components/ui/input'

import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control'
import { HStack } from '@/components/ui/hstack'
import { reorderTaxon, findTaxonCode } from '../../utils/utils'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'
import { savePlusCount } from '../../redux/reducers/formSlices/fishInputSlice'
import { addPlusCountToBatchStore } from '../../redux/reducers/formSlices/batchCountSlice'

const mapStateToProps = (state: RootState) => {
  return {
    // addAnotherMarkValues: state.addAnotherMark.values,
  }
}

const MeasureMetPlusCount = ({
  species,
  mode = 'default',
  closeModal,
  activeTabId,
  onSaveCallback,
  protocolKeyMet,
  lifeStageValue,
  runValue,
  dropdownValues,
}: {
  species: any
  mode?: 'default' | 'multiSpecies'
  closeModal: any
  activeTabId: string
  onSaveCallback?: () => void
  protocolKeyMet: string
  lifeStageValue: string
  runValue: string
  dropdownValues: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const [inputValue, setInputValue] = React.useState('')

  const handleSubmit = () => {
    let submittedRun = ''
    let submittedLifeStage = ''
    if (runValue && protocolKeyMet.includes(runValue)) submittedRun = runValue
    if (lifeStageValue && protocolKeyMet.includes(lifeStageValue))
      submittedLifeStage = lifeStageValue

    try {
      const plusCount = parseInt(inputValue, 10)
      if (activeTabId && !isNaN(plusCount)) {
        const reorderedTaxon = reorderTaxon(dropdownValues.taxon)
        const taxonCode = findTaxonCode(species.value, reorderedTaxon)
        const plusCountData = {
          tabId: activeTabId,
          existingMarks: [],
          count: plusCount,
          dead: false,
          lifeStage: submittedLifeStage,
          plusCountMethod: 'none',
          run: submittedRun,
          species: species.value,
          taxonCode,
        }

        switch (mode) {
          case 'multiSpecies':
            dispatch(addPlusCountToBatchStore(plusCountData))
            break
          case 'default':
          default:
            dispatch(savePlusCount(plusCountData))
            break
        }

        closeModal()
        if (onSaveCallback) {
          onSaveCallback() // Reset species after submission
        }
        setInputValue('') // Reset input value after submission
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
    }
  }

  return (
    <>
      <CustomModalHeader
        headerText={`Enter Plus Count for ${protocolKeyMet || species.value}`}
        headerFontSize={24}
        showHeaderButton={true}
        closeModal={closeModal}
      />
      <ScrollView>
        <Box paddingX='10' paddingTop='2' paddingBottom='2'>
          <Text fontSize='xl' color='black'>
            You have met the fish measure count requirement for{' '}
            <Text bold>{protocolKeyMet}</Text>. You may now enter plus counts
            for all remaining <Text bold>{protocolKeyMet}</Text>.
          </Text>
          <VStack space={4} mt={5}>
            <FormControl
              size='lg'
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
            >
              <FormControlLabel>
                <FormControlLabelText>Plus Count</FormControlLabelText>
              </FormControlLabel>
              <Input
                className='my-1'
                size={'lg'}
                style={{ height: 60, width: '100%' }}
              >
                <InputField
                  keyboardType='number-pad'
                  placeholder='Plus Count'
                  value={inputValue}
                  onChangeText={text => {
                    // Only allow numeric input
                    const numericText = text.replace(/[^0-9]/g, '')
                    setInputValue(numericText)
                  }}
                />
              </Input>
            </FormControl>
            <Box
              // flexDirection='row'
              justifyContent='space-between'
              width={'100%'}
              my={3}
            >
              <HStack>
                <Button
                  mx='auto'
                  minWidth={250}
                  bgColor='gray.400'
                  _pressed={{
                    bg: 'gray.600',
                  }}
                  onPress={closeModal}
                >
                  <Text fontSize='xl' color='white'>
                    Close
                  </Text>
                </Button>
                <Button
                  mx='auto'
                  minWidth={250}
                  bgColor='primary'
                  colorScheme='coolGray'
                  onPress={handleSubmit}
                  _pressed={{
                    bg: 'secondary',
                  }}
                  isDisabled={!inputValue || isNaN(Number(inputValue))}
                  disabled={!inputValue || isNaN(Number(inputValue))}
                  _disabled={{
                    bg: 'gray.400',
                  }}
                >
                  <Text fontSize='xl' color='white'>
                    Save Plus Count
                  </Text>
                </Button>
              </HStack>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </>
  )
}

export default connect(mapStateToProps)(MeasureMetPlusCount)
