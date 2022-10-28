import { Formik } from 'formik'
import { FormControl, Heading, Text, VStack, View } from 'native-base'
import { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import renderErrorMessage from '../../../components/form/RenderErrorMessage'
import NavButtons from '../../../components/formContainer/NavButtons'
import CustomSelect from '../../../components/Shared/CustomSelect'
import { getTrapVisitDropdownValues } from '../../../redux/reducers/dropdownsSlice'
import {
  markFishProcessingCompleted,
  saveFishProcessing,
} from '../../../redux/reducers/formSlices/fishProcessingSlice'
import { markStepCompleted } from '../../../redux/reducers/formSlices/navigationSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import { fishProcessingSchema } from '../../../utils/helpers/yupValidations'

const reasonsForNotProcessing = [
  { id: 0, definition: 'Safety Precautions' },
  { id: 1, definition: 'Staffing Shortages' },
]

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
      initialErrors={
        reduxState.completed ? undefined : { fishProcessedResult: '' }
      }
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({
        handleChange,
        handleSubmit,
        setFieldTouched,
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
                <CustomSelect
                  selectedValue={values.fishProcessedResult}
                  placeholder='Fish Processed'
                  onValueChange={handleChange('fishProcessedResult')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={fishProcessedDropdowns}
                />
                {touched.fishProcessed &&
                  errors.fishProcessed &&
                  renderErrorMessage(errors, 'fishProcessed')}
              </FormControl>
              {values.fishProcessedResult ===
                'no catch data, fish left in live box' ||
                (values.fishProcessedResult ===
                  'no catch data, fish released' && (
                  <FormControl>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Reason For Not Processing
                      </Text>
                    </FormControl.Label>
                    <CustomSelect
                      selectedValue={values.reasonForNotProcessing}
                      placeholder='Reason'
                      onValueChange={handleChange('reasonForNotProcessing')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={reasonsForNotProcessing}
                    />
                    {touched.reasonForNotProcessing &&
                      errors.reasonForNotProcessing &&
                      renderErrorMessage(errors, 'reasonForNotProcessing')}
                  </FormControl>
                ))}

              {values.fishProcessedResult === 'processed fish' && (
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
