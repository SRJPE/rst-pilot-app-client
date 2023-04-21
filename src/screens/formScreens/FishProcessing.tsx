import { Formik, yupToFormErrors } from 'formik'
import {
  FormControl,
  Heading,
  Text,
  VStack,
  View,
  Avatar,
  HStack,
  Radio,
} from 'native-base'
import { connect, useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import NavButtons from '../../components/formContainer/NavButtons'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  markFishProcessingCompleted,
  saveFishProcessing,
} from '../../redux/reducers/formSlices/fishProcessingSlice'
import { markStepCompleted } from '../../redux/reducers/formSlices/navigationSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { fishProcessingSchema } from '../../utils/helpers/yupValidations'
import { useEffect } from 'react'

const mapStateToProps = (state: RootState) => {
  let activeTabId = 'placeholderId'
  if (
    state.tabSlice.activeTabId &&
    state.fishProcessing[state.tabSlice.activeTabId]
  ) {
    activeTabId = state.tabSlice.activeTabId
  }

  return {
    reduxState: state.fishProcessing,
    tabSlice: state.tabSlice,
    activeTabId,
    previouslyActiveTabId: state.tabSlice.previouslyActiveTabId,
    navigationSlice: state.navigation,
  }
}

const FishProcessing = ({
  navigation,
  reduxState,
  tabSlice,
  activeTabId,
  previouslyActiveTabId,
  navigationSlice,
}: {
  navigation: any
  reduxState: any
  tabSlice: any
  activeTabId: string
  previouslyActiveTabId: string | null
  navigationSlice: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const {
    fishProcessed: fishProcessedDropdowns,
    whyFishNotProcessed: whyFishNotProcessedDropdowns,
  } = dropdownValues.values

  const checkForErrors = (values: any) => {
    try {
      fishProcessingSchema.validateSync(values, {
        abortEarly: false,
        context: { values },
      })
      return {}
    } catch (err) {
      return yupToFormErrors(err)
    }
  }

  const onSubmit = (values: any, tabId: string | null) => {
    if (tabId) {
      const errors = checkForErrors(values)
      dispatch(saveFishProcessing({ tabId, values, errors }))
      dispatch(markFishProcessingCompleted({ tabId, value: true }))
      let stepCompletedCheck = true
      Object.keys(tabSlice.tabs).forEach((tabId) => {
        if (!reduxState[tabId]) stepCompletedCheck = false
      })
      if (stepCompletedCheck)
        dispatch(markStepCompleted([true, 'fishProcessing']))
      console.log('🚀 ~ handleSubmit~ FishProcessing', values)
    }
  }

  return (
    <Formik
      validationSchema={fishProcessingSchema}
      enableReinitialize={true}
      initialValues={reduxState[activeTabId].values}
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      initialTouched={{ fishProcessedResult: true }}
      initialErrors={
        activeTabId && reduxState[activeTabId]
          ? reduxState[activeTabId].errors
          : null
      }
      onSubmit={(values) => {
        if (activeTabId != 'placeholderId') {
          onSubmit(values, activeTabId)
        } else {
          if (tabSlice.activeTabId) onSubmit(values, tabSlice.activeTabId)
        }
      }}
      validateOnChange={true}
    >
      {({
        handleChange,
        handleSubmit,
        setFieldTouched,
        setFieldValue,
        touched,
        errors,
        values,
        resetForm,
      }) => {
        useEffect(() => {
          if (previouslyActiveTabId && navigationSlice.activeStep === 3) {
            onSubmit(values, previouslyActiveTabId)
            resetForm()
          }
        }, [previouslyActiveTabId])

        return (
          <>
            <View
              flex={1}
              bg='#fff'
              px='5%'
              py='3%'
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
                  {tabSlice.incompleteSectionTouched
                    ? errors.reasonNotFunc &&
                      RenderErrorMessage(errors, 'fishProcessed')
                    : touched.reasonNotFunc &&
                      errors.reasonNotFunc &&
                      RenderErrorMessage(errors, 'fishProcessed')}
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
                    {tabSlice.incompleteSectionTouched
                      ? errors.reasonNotFunc &&
                        RenderErrorMessage(errors, 'reasonForNotProcessing')
                      : touched.reasonNotFunc &&
                        errors.reasonNotFunc &&
                        RenderErrorMessage(errors, 'reasonForNotProcessing')}
                  </FormControl>
                )}

                {values.fishProcessedResult === 'processed fish' && (
                  <VStack space={4}>
                    <Heading>Please sort fish by category:</Heading>

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
                    <FormControl>
                      <FormControl.Label>
                        <Heading mb='4'>
                          Will you be holding fish for mark recapture trial?
                        </Heading>
                      </FormControl.Label>
                      <Radio.Group
                        name='coneSetting'
                        accessibilityLabel='cone setting'
                        value={`${values.willBeHoldingFishForMarkRecapture}`}
                        onChange={(value: any) => {
                          setFieldTouched(
                            'willBeHoldingFishForMarkRecapture',
                            true
                          )
                          if (value === 'true') {
                            setFieldValue(
                              'willBeHoldingFishForMarkRecapture',
                              true
                            )
                          } else {
                            setFieldValue(
                              'willBeHoldingFishForMarkRecapture',
                              false
                            )
                          }
                        }}
                      >
                        <Radio
                          colorScheme='primary'
                          value='true'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          Yes
                        </Radio>
                        <Radio
                          colorScheme='primary'
                          value='false'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          No
                        </Radio>
                      </Radio.Group>
                    </FormControl>
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
        )
      }}
    </Formik>
  )
}

export default connect(mapStateToProps)(FishProcessing)
