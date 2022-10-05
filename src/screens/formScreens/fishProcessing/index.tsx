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
import { connect, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import NavButtons from '../../../components/formContainer/NavButtons'
import { getTrapVisitDropdownValues } from '../../../redux/reducers/dropdownsSlice'
import {
  markFishProcessingCompleted,
  saveFishProcessing,
} from '../../../redux/reducers/fishProcessingSlice'
import { AppDispatch, RootState } from '../../../redux/store'

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.fishProcessing,
  }
}

const FishProcessing = ({
  navigation,
  reduxState,
}: {
  navigation: any
  reduxState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const [fishProcessed, setFishProcessed] = useState(
    reduxState.values.fishProcessed as any
  )
  const [reasonForNotProcessing, setReasonForNotProcessing] = useState(
    reduxState.values.reasonNotProcessing as any
  )

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
      initialValues={reduxState.values}
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
                  selectedValue={fishProcessed}
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
                    selectedValue={reasonForNotProcessing}
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

export default connect(mapStateToProps)(FishProcessing)

const reasonsForNotProcessing = [
  { id: 0, definition: 'Safety Precautions' },
  { id: 0, definition: 'Staffing Shortages' },
]

// const step = route.params.step
// const activeFormState = route.params.activeFormState
// console.log('🚀 ~ activeFormState', activeFormState)
// const passToActiveFormState = route.params.passToActiveFormState
