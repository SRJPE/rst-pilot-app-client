import { Formik } from 'formik'
import {
  FormControl,
  Heading,
  Text,
  VStack,
  View,
  Avatar,
  HStack,
} from 'native-base'
import { useEffect } from 'react'
import { connect, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import renderErrorMessage from '../../components/Shared/RenderErrorMessage'
import NavButtons from '../../components/formContainer/NavButtons'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  markFishProcessingCompleted,
  saveFishProcessing,
} from '../../redux/reducers/formSlices/fishProcessingSlice'
import { markStepCompleted } from '../../redux/reducers/formSlices/navigationSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { fishProcessingSchema } from '../../utils/helpers/yupValidations'

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
  const {
    fishProcessed: fishProcessedDropdowns,
    whyFishNotProcessed: whyFishNotProcessedDropdowns,
  } = dropdownValues.values

  const handleSubmit = (values: any) => {
    dispatch(saveFishProcessing(values))
    dispatch(markFishProcessingCompleted(true))
    dispatch(markStepCompleted([true, 'fishProcessing']))
    console.log('🚀 ~ handleSubmit~ FishProcessing', values)
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
              {(values.fishProcessedResult ===
                'no catch data, fish left in live box' ||
                values.fishProcessedResult ===
                  'no catch data, fish released') && (
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
                    selectOptions={whyFishNotProcessedDropdowns}
                  />
                  {touched.reasonForNotProcessing &&
                    errors.reasonForNotProcessing &&
                    renderErrorMessage(errors, 'reasonForNotProcessing')}
                </FormControl>
              )}

              {values.fishProcessedResult === 'processed fish' && (
                <VStack>
                  <Heading mb='4'>Please sort fish by category:</Heading>

                  <VStack space={2} alignItems='flex-start'>
                    <HStack space={2} alignItems='flex-start'>
                      <Avatar size={'2'} mt={'2'} />
                      <Text>Chinook salmon (by run when possible)</Text>
                    </HStack>
                    <HStack space={2} alignItems='flex-start'>
                      <Avatar size={'2'} mt={'2'} />
                      <Text>Steelhead</Text>
                    </HStack>
                    <HStack space={2} alignItems='flex-start'>
                      <Avatar size={'2'} mt={'2'} />
                      <Text>recaptured</Text>
                    </HStack>
                    <HStack space={2} alignItems='flex-start'>
                      <Avatar size={'2'} mt={'2'} />
                      <Text>non-salmonid species</Text>
                    </HStack>
                  </VStack>
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
