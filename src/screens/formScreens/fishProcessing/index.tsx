import { Formik } from 'formik'
import {
  FormControl,
  Heading,
  Text,
  VStack,
  CheckIcon,
  Select,
  View,
} from 'native-base'
import { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import renderErrorMessage from '../../../components/form/RenderErrorMessage'
import NavButtons from '../../../components/formContainer/NavButtons'
import { getTrapVisitDropdownValues } from '../../../redux/reducers/dropdownsSlice'
import {
  markFishProcessingCompleted,
  saveFishProcessing,
} from '../../../redux/reducers/fishProcessingSlice'
import { markStepCompleted } from '../../../redux/reducers/navigationSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import { fishProcessingSchema } from '../../../utils/helpers/yupValidations'

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
    dispatch(markStepCompleted(true))
    console.log('🚀 ~ Fish Processing ~ values', values)
  }

  return (
    <Formik
      validationSchema={fishProcessingSchema}
      initialValues={reduxState.values}
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      initialTouched={{ fishProcessedResult: true }}
      initialErrors={{ fishProcessedResult: '' }}
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
          <View
            flex={1}
            bg='#fff'
            p='6%'
            borderColor='themeGrey'
            borderWidth='15'
          >
            <VStack space={8}>
              <Heading>Will you be processing fish today?</Heading>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Fish Processed
                  </Text>
                </FormControl.Label>
                <Select
                  height='50px'
                  fontSize='16'
                  accessibilityLabel='Fish Processed'
                  placeholder='Status'
                  _selectedItem={{
                    bg: 'secondary',
                    endIcon: <CheckIcon size='5' />,
                  }}
                  mt={1}
                  selectedValue={values.fishProcessedResult}
                  onValueChange={handleChange('fishProcessedResult')}
                >
                  {fishProcessedDropdowns.map((item: any) => (
                    <Select.Item
                      key={item.id}
                      label={item.definition}
                      value={item.definition}
                    />
                  ))}
                </Select>
                {touched.fishProcessed &&
                  errors.fishProcessed &&
                  renderErrorMessage(errors, 'fishProcessed')}
              </FormControl>
              {values.fishProcessedResult ===
                'No catch data; fish left in live box' && (
                <FormControl>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Reason For Not Processing
                    </Text>
                  </FormControl.Label>
                  <Select
                    height='50px'
                    fontSize='16'
                    accessibilityLabel='reasonForNotProcessing'
                    placeholder='Reason'
                    _selectedItem={{
                      bg: 'secondary',
                      endIcon: <CheckIcon size='5' />,
                    }}
                    mt={1}
                    selectedValue={values.reasonForNotProcessing}
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
                  {/* {touched.reasonForNotProcessing &&
                    errors.reasonForNotProcessing &&
                    renderErrorMessage(errors, 'reasonForNotProcessing')} */}
                </FormControl>
              )}

              {values.fishProcessedResult === 'Processed fish' && (
                <VStack>
                  <Heading>Please sort fish by category:</Heading>

                  <Text>Chinook salmon (by run when possible),</Text>
                  <Text>Steelhead</Text>
                  <Text>recaptured</Text>
                  <Text>non-salmonid species</Text>
                </VStack>
              )}
            </VStack>
          </View>
          <NavButtons
            navigation={navigation}
            handleSubmit={handleSubmit}
            errors={errors}
            touched={touched}
            values={values}
          />
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(FishProcessing)

const reasonsForNotProcessing = [
  { id: 0, definition: 'Safety Precautions' },
  { id: 1, definition: 'Staffing Shortages' },
]
