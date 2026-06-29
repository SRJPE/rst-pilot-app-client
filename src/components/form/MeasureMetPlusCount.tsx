import React from 'react'
import {
  VStack,
  HStack,
  Text,
  Button,
  Box,
  Radio,
  FormControl as NBFormControl,
} from 'native-base'
import { Input, InputField } from '@/components/ui/input'
import { reorderTaxon, findTaxonCode } from '../../utils/utils'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import CustomModalHeader from '../Shared/CustomModalHeader'
import { savePlusCount } from '../../redux/reducers/formSlices/fishInputSlice'
import { addPlusCountToBatchStore } from '../../redux/reducers/formSlices/batchCountSlice'

const mapStateToProps = (state: RootState) => ({})

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
  const [dead, setDead] = React.useState(false)

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
          dead,
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
          default:
            dispatch(savePlusCount(plusCountData))
            break
        }

        closeModal()
        if (onSaveCallback) onSaveCallback()
        setInputValue('')
        setDead(false)
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
    }
  }

  return (
    <Box flex={1} paddingX={8} paddingBottom={6}>
      <CustomModalHeader
        headerText={`Enter Plus Count for ${protocolKeyMet || species.value}`}
        headerFontSize={24}
        showHeaderButton={true}
        closeModal={closeModal}
      />

      <Text fontSize='lg' color='gray.600' mt={4} mb={6}>
        You have met the fish measure count requirement for{' '}
        <Text bold color='black'>
          {protocolKeyMet}
        </Text>
        . Enter the plus count for all remaining{' '}
        <Text bold color='black'>
          {protocolKeyMet}
        </Text>
        .
      </Text>

      <VStack space={4}>
        <NBFormControl>
          <NBFormControl.Label
            _text={{ fontSize: 'xl', fontWeight: 'semibold', color: 'black' }}
          >
            Plus Count
          </NBFormControl.Label>
          <Input size='xl' style={{ height: 56 }}>
            <InputField
              keyboardType='number-pad'
              placeholder='0'
              value={inputValue}
              onChangeText={text => setInputValue(text.replace(/[^0-9]/g, ''))}
              style={{ fontSize: 22 }}
            />
          </Input>
        </NBFormControl>

        <NBFormControl>
          <NBFormControl.Label
            _text={{ fontSize: 'xl', fontWeight: 'semibold', color: 'black' }}
          >
            Dead
          </NBFormControl.Label>
          <Radio.Group
            name='dead'
            accessibilityLabel='dead'
            value={`${dead}`}
            onChange={value => setDead(value === 'true')}
          >
            <HStack space={4}>
              <Radio
                colorScheme='primary'
                value='true'
                size='lg'
                _icon={{ color: 'primary' }}
              >
                <Text fontSize='xl' ml={2}>
                  True
                </Text>
              </Radio>
              <Radio
                colorScheme='primary'
                value='false'
                size='lg'
                _icon={{ color: 'primary' }}
              >
                <Text fontSize='xl' ml={2}>
                  False
                </Text>
              </Radio>
            </HStack>
          </Radio.Group>
        </NBFormControl>

        <Box flexDirection='row' mt={2}>
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
        </Box>
      </VStack>
    </Box>
  )
}

export default connect(mapStateToProps)(MeasureMetPlusCount)
