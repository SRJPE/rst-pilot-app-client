import { Formik } from 'formik'
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
import NavButtons from '../../../components/formContainer/NavButtons'
import { getTrapVisitDropdownValues } from '../../../redux/reducers/dropdownsSlice'
import {
  markFishProcessingCompleted,
  saveFishProcessing,
} from '../../../redux/reducers/fishProcessingSlice'
import { AppDispatch } from '../../../redux/store'
import { FishProcessingInitialValues } from '../../../utils/interfaces'

export default function FishProcessing({
  route,
  navigation,
}: {
  route: any
  navigation: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const reduxState = useSelector((state: any) => state.values?.fishProcessing)
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const [initialFormValues, setInitialFormValues] = useState({} as any)
  const [fishProcessed, setFishProcessed] = useState({} as any)
  const [reasonForNotProcessing, setReasonForNotProcessing] = useState(
    {} as any
  )

  useEffect(() => {
    setInitialFormValues(reduxState)
  }, [])

  useEffect(() => {
    console.log(
      '🚀 ~ useEffect ~ initialFormValues processing Fish',
      initialFormValues
    )
  }, [initialFormValues])

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
  }, [])
  const { fishProcessed: fishProcessedDropdowns } = dropdownValues.values

  const handleSubmit = (values: any) => {
    values.fishProcessed = fishProcessed
    values.reasonForNotProcessing = reasonForNotProcessing
    dispatch(saveFishProcessing(values))
    dispatch(markFishProcessingCompleted(true))
    console.log('🚀 ~ TrapStatus ~ values', values)
  }

  return (
    <Formik
      // validationSchema={{ test: '' }}
      initialValues={initialFormValues}
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <>
          <Box height='90%' bg='#fff' p='10%'>
            <VStack space={8}>
              <Heading>Will you be processing fish today?</Heading>
              <FormControl>
                <FormControl.Label>Fish Processed</FormControl.Label>
                <Select
                  minWidth='200'
                  accessibilityLabel='Fish Processed'
                  placeholder='Status'
                  _selectedItem={{
                    bg: 'primary',
                    endIcon: <CheckIcon size='5' />,
                  }}
                  mt={1}
                  selectedValue={reduxState?.fishProcessed}
                  onValueChange={itemValue => setFishProcessed(itemValue)}
                >
                  {fishProcessedDropdowns.map((item: any) => (
                    <Select.Item
                      key={item.id}
                      label={item.definition}
                      value={item.definition}
                    />
                  ))}
                </Select>
              </FormControl>
              {fishProcessed === 'No catch data; fish left in live box' && (
                <FormControl>
                  <FormControl.Label>
                    Reason For Not Processing
                  </FormControl.Label>
                  <Select
                    selectedValue={reduxState?.reasonForNotProcessing}
                    minWidth='200'
                    accessibilityLabel='reasonForNotProcessing'
                    placeholder='Reason'
                    _selectedItem={{
                      bg: 'primary',
                      endIcon: <CheckIcon size='5' />,
                    }}
                    mt={1}
                    onValueChange={itemValue =>
                      setReasonForNotProcessing(itemValue)
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

              {fishProcessed === 'Processed fish' && (
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
          <NavButtons navigation={navigation} handleSubmit={handleSubmit} />
        </>
      )}
    </Formik>
  )
}

const reasonsForNotProcessing = [
  { id: 0, definition: 'Safety Precautions' },
  { id: 0, definition: 'Staffing Shortages' },
]

// const step = route.params.step
// const activeFormState = route.params.activeFormState
// console.log('🚀 ~ activeFormState', activeFormState)
// const passToActiveFormState = route.params.passToActiveFormState
