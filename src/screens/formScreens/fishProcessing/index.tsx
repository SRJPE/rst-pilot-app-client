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
import { fishInputSchema } from '../../../utils/helpers/yupValidations'

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

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
  }, [])
  const { fishProcessed: fishProcessedDropdowns } = dropdownValues.values

  const handleSubmit = (values: any) => {
    dispatch(saveFishProcessing(values))
    dispatch(markFishProcessingCompleted(true))
    console.log('🚀 ~ Fish Processing ~ values', values)
  }

  return (
    <Formik
      validationSchema={fishInputSchema}
      initialValues={reduxState.values}
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        errors,
        values,
      }) => (
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
                  selectedValue={values.fishProcessed}
                  onValueChange={handleChange('fishProcessed')}
                >
                  {fishProcessedDropdowns.map((item: any) => (
                    <Select.Item
                      key={item.id}
                      label={item.definition}
                      value={item.definition}
                    />
                  ))}
                </Select>
                {touched.fishProcessed && errors.fishProcessed && (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    {errors.fishProcessed as string}
                  </Text>
                )}
              </FormControl>
              {values.fishProcessed ===
                'No catch data; fish left in live box' && (
                <FormControl>
                  <FormControl.Label>
                    Reason For Not Processing
                  </FormControl.Label>
                  <Select
                    selectedValue={values.reasonForNotProcessing}
                    minWidth='200'
                    accessibilityLabel='reasonForNotProcessing'
                    placeholder='Reason'
                    _selectedItem={{
                      bg: 'primary',
                      endIcon: <CheckIcon size='5' />,
                    }}
                    mt={1}
                    onValueChange={handleChange('reasonForNotProcessing')}
                  >
                    {reasonsForNotProcessing.map((item: any) => (
                      <Select.Item
                        key={item.id}
                        label={item.definition}
                        value={item.definition}
                      />
                    ))}
                  </Select>
                  {touched.reasonForNotProcessing &&
                    errors.reasonForNotProcessing && (
                      <Text style={{ fontSize: 12, color: 'red' }}>
                        {errors.reasonForNotProcessing as string}
                      </Text>
                    )}
                </FormControl>
              )}

              {values.fishProcessed === 'Processed fish' && (
                <VStack>
                  <Heading>Please sort fish by category:</Heading>

                  <Text>Chinook salmon (by run when possible),</Text>
                  <Text>Steelhead</Text>
                  <Text>recaptured</Text>
                  <Text>non-salmonid species</Text>
                </VStack>
              )}
            </VStack>
          </Box>
          <NavButtons
            navigation={navigation}
            handleSubmit={handleSubmit}
            errors={errors}
            touched={touched}
          />
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
