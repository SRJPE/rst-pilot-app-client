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
import {
  markStepCompleted,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { fishProcessingSchema } from '../../utils/helpers/yupValidations'
import { useEffect, useMemo } from 'react'
import { DeviceEventEmitter } from 'react-native'
import { navigateHelper } from '../../utils/utils'

const mapStateToProps = (state: RootState) => {
  const activeTabId = state.tabSlice.activeTabId
  let isPaperEntryStore = activeTabId
    ? state.visitSetup[activeTabId]?.isPaperEntry
    : false

  return {
    reduxState: state.fishProcessing,
    tabSlice: state.tabSlice,
    activeTabId: state.tabSlice.activeTabId,
    isPaperEntryStore,
    previouslyActiveTabId: state.tabSlice.previouslyActiveTabId,
    navigationSlice: state.navigation,
  }
}

const FishProcessing = ({
  navigation,
  reduxState,
  tabSlice,
  activeTabId,
  isPaperEntryStore,
  previouslyActiveTabId,
  navigationSlice,
}: {
  navigation: any
  reduxState: any
  tabSlice: any
  activeTabId: any
  isPaperEntryStore: boolean
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
      const allTabIds: string[] = Object.keys(tabSlice.tabs)
      allTabIds.forEach((allTabId) => {
        if (!Object.keys(reduxState).includes(allTabId)) {
          if (Object.keys(reduxState).length < allTabIds.length) {
            stepCompletedCheck = false
          }
          if (Object.keys(errors).length) {
            stepCompletedCheck = false
          }
        } else {
          if (!reduxState[allTabId].completed) {
            stepCompletedCheck = false
          }
        }
      })

      if (stepCompletedCheck)
        dispatch(markStepCompleted({ propName: 'fishProcessing' }))
      console.log('🚀 ~ handleSubmit~ FishProcessing', values)
    }
  }

  return (
    <Formik
      validationSchema={fishProcessingSchema}
      enableReinitialize={true}
      initialValues={
        reduxState[activeTabId]
          ? reduxState[activeTabId].values
          : reduxState['placeholderId'].values
      }
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      initialTouched={{ fishProcessedResult: true }}
      initialErrors={
        activeTabId && reduxState[activeTabId]
          ? reduxState[activeTabId].errors
          : { fishProcessedResult: '' }
      }
      onSubmit={(values) => {
        if (activeTabId && activeTabId != 'placeholderId') {
          const callback = () => {
            if (!isPaperEntryStore) {
              if (values?.fishProcessedResult === 'no fish caught') {
                navigateHelper(
                  'No Fish Caught',
                  navigationSlice,
                  navigation,
                  dispatch,
                  updateActiveStep
                )
              } else if (
                values?.fishProcessedResult ===
                  'no catch data, fish left in live box' ||
                values?.fishProcessedResult === 'no catch data, fish released'
              ) {
                navigateHelper(
                  'Trap Post-Processing',
                  navigationSlice,
                  navigation,
                  dispatch,
                  updateActiveStep
                )
              } else {
                navigateHelper(
                  'Fish Input',
                  navigationSlice,
                  navigation,
                  dispatch,
                  updateActiveStep
                )
              }
            } else {
              navigateHelper(
                'Trap Post-Processing',
                navigationSlice,
                navigation,
                dispatch,
                updateActiveStep
              )
            }
          }

          navigation.push('Loading...')

          setTimeout(() => {
            DeviceEventEmitter.emit('event.load', {
              process: () => onSubmit(values, activeTabId),
              callback,
            })
          }, 2000)
        }
      }}
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
        const navButtons = useMemo(
          () => (
            <NavButtons
              navigation={navigation}
              handleSubmit={handleSubmit}
              errors={errors}
              touched={touched}
              values={values}
              shouldProceedToLoadingScreen={true}
            />
          ),
          [navigation, handleSubmit, errors, touched, values]
        )
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
                    ? errors.fishProcessed &&
                      RenderErrorMessage(errors, 'fishProcessed')
                    : touched.reasonNotFunc &&
                      errors.fishProcessed &&
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
                      ? errors.reasonForNotProcessing &&
                        RenderErrorMessage(errors, 'reasonForNotProcessing')
                      : touched.reasonNotFunc &&
                        errors.reasonForNotProcessing &&
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
            {navButtons}
          </>
        )
      }}
    </Formik>
  )
}

export default connect(mapStateToProps)(FishProcessing)
