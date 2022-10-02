import {
  Box,
  FormControl,
  Heading,
  Input,
  Text,
  View,
  VStack,
  CheckIcon,
  Select,
} from 'native-base'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getTrapVisitDropdownValues } from '../../../redux/reducers/dropdownsSlice'
import { AppDispatch } from '../../../redux/store'

export default function FishProcessing({
  route,
  navigation,
}: {
  route: any
  navigation: any
}) {
  const step = route.params.step
  const activeFormState = route.params.activeFormState
  console.log('🚀 ~ activeFormState', activeFormState)
  const passToActiveFormState = route.params.passToActiveFormState
  const previousFormState = useSelector(
    (state: any) => state.values?.fishProcessing
  )

  // const initialFormState = {
  //   fishProcessed: '',
  //   reasonForNotProcessing: '',
  // } as any

  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const reduxState = useSelector((state: any) => state)

  useEffect(() => {
    passToActiveFormState(navigation, step, activeFormState)
  }, [])

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
  }, [])
  const { fishProcessed } = dropdownValues.values

  return (
    <Box height='full' bg='#fff' p='10%'>
      <VStack space={8}>
        <Heading>Will you be processing fish today?</Heading>
        <FormControl>
          <FormControl.Label>Fish Processed</FormControl.Label>
          <Select
            selectedValue={previousFormState?.fishProcessed}
            minWidth='200'
            accessibilityLabel='Fish Processed'
            placeholder='Status'
            _selectedItem={{
              bg: 'primary',
              endIcon: <CheckIcon size='5' />,
            }}
            mt={1}
            onValueChange={(selectedValue: any) =>
              passToActiveFormState(navigation, step, {
                ...activeFormState,
                fishProcessed: selectedValue,
              })
            }
          >
            {fishProcessed.map((item: any) => (
              <Select.Item
                key={item.id}
                label={item.definition}
                value={item.definition}
              />
            ))}
          </Select>
        </FormControl>
        {activeFormState.fishProcessed ===
          'No catch data; fish left in live box' && (
          <FormControl>
            <FormControl.Label>Reason For Not Processing</FormControl.Label>
            <Select
              selectedValue={previousFormState?.reasonForNotProcessing}
              minWidth='200'
              accessibilityLabel='reasonForNotProcessing'
              placeholder='Reason'
              _selectedItem={{
                bg: 'primary',
                endIcon: <CheckIcon size='5' />,
              }}
              mt={1}
              onValueChange={(selectedValue: any) =>
                passToActiveFormState(navigation, step, {
                  ...activeFormState,
                  reasonForNotProcessing: selectedValue,
                })
              }
            >
              {reasonsForNotProcessing.map((item: any) => (
                <Select.Item
                  key={item.id}
                  label={item.definition}
                  value={item.definition}
                />
              ))}
            </Select>
          </FormControl>
        )}

        {activeFormState.fishProcessed === 'Processed fish' && (
          <VStack>
            <Heading>Please sort fish by category:</Heading>

            <Text>Chinook salmon (by run when possible),</Text>
            <Text> Steelhead</Text>
            <Text>recaptured</Text>
            <Text>non-salmonid species</Text>
          </VStack>
        )}
      </VStack>
    </Box>
  )
}

const reasonsForNotProcessing = [
  { id: 0, definition: 'Safety Precautions' },
  { id: 0, definition: 'Staffing Shortages' },
]
