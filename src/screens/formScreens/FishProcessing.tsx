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
import { connect, useDispatch, useSelector } from 'react-redux'
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
import React, { useEffect, useMemo, useState } from 'react'
import { DeviceEventEmitter } from 'react-native'
import {
  navigateHelper,
  navigateFlowRightButton,
  navigateFlowLeftButton,
} from '../../utils/utils'
import { StackActions } from '@react-navigation/native'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'

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
  const navigationState = useSelector((state: any) => state.navigation)
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
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

      // if skipping over fish input, set to completed
      let setFishInputCompleted = true
      const allTabIds: string[] = Object.keys(tabSlice.tabs)
      allTabIds.forEach(allTabId => {
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
        // if any of tabs is processed fish, set fish input to not completed
        if (
          reduxState[allTabId]?.values?.fishProcessedResult === 'processed fish'
        ) {
          setFishInputCompleted = false
        }
      })

      if (stepCompletedCheck) {
        dispatch(markStepCompleted({ propName: 'fishProcessing' }))
      }

      if (setFishInputCompleted) {
        dispatch(markStepCompleted({ propName: 'fishInput' }))
      }
      console.log('🚀 ~ handleSubmit~ FishProcessing', values)
    }
  }

  const handleNavButtonClick = (direction: 'left' | 'right', values: any) => {
    const tabValues = Object.keys(tabSlice.tabs).map((tabId: any) => {
      if (tabId === activeTabId) {
        return values
      } else {
        return reduxState[tabId]?.values
      }
    })

    if (activeTabId && activeTabId != 'placeholderId') {
      const destination =
        direction === 'left'
          ? navigateFlowLeftButton('Fish Processing', false, navigation)
          : navigateFlowRightButton({
              values,
              activePage: 'Fish Processing',
              holdingForMarkRecap: false,
              navigation,
              tabValues,
            })
      const callback = () => {
        navigateHelper(
          destination,
          navigationSlice,
          navigation,
          dispatch,
          updateActiveStep
        )
      }

      navigation.dispatch(StackActions.replace('Loading...'))

      setTimeout(() => {
        DeviceEventEmitter.emit('event.load', {
          process: () => onSubmit(values, activeTabId),
          callback,
        })
        showSlideAlert(dispatch)
      }, 1000)
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
      // initialTouched={{ fishProcessedResult: true }}
      initialErrors={
        activeTabId && reduxState[activeTabId]
          ? reduxState[activeTabId].errors
          : { fishProcessedResult: '' }
      }
      onSubmit={() => {}}
    >
      {({
        handleChange,
        handleSubmit,
        setFieldTouched,
        setFieldValue,
        setFieldError,
        touched,
        errors,
        values,
        resetForm,
        isValid,
      }) => {
        useEffect(() => {
          if (previouslyActiveTabId && navigationSlice.activeStep === 3) {
            onSubmit(values, previouslyActiveTabId)
            resetForm()
          }
        }, [previouslyActiveTabId, activeTabId])

        const checkOtherTabForms = () => {
          const tabIds = Object.keys(tabSlice.tabs)

          const fishProcessingOtherTabsValidity = tabIds.map(tabId => {
            if (tabId !== activeTabId) {
              const tabFormValues = reduxState[tabId]?.values
              const formIsValid =
                fishProcessingSchema.isValidSync(tabFormValues)
              return formIsValid
            }

            return
          })

          const tabIncomplete = fishProcessingOtherTabsValidity.some(
            result => result === false
          )

          if (tabIncomplete) return false

          return true
        }

        const otherTabFormsValid = checkOtherTabForms()

        const noCatchData =
          values?.fishProcessedResult.includes('no catch data')
        const navButtons = useMemo(
          () => (
            <NavButtons
              navigation={navigation}
              handleSubmit={(buttonDirection: 'left' | 'right') => {
                handleNavButtonClick(buttonDirection, values)
              }}
              errors={errors}
              touched={touched}
              values={values}
              shouldProceedToLoadingScreen={true}
              isValid={isValid && otherTabFormsValid}
            />
          ),
          [
            navigation,
            handleSubmit,
            errors,
            touched,
            values,
            activePage,
            reduxState,
            tabSlice,
          ]
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

                <CustomSelect
                  label='Fish Processed Result'
                  camelName='fishProcessedResult'
                  errors={errors}
                  touched={touched}
                  selectedValue={values.fishProcessedResult}
                  placeholder='Select Result'
                  onValueChange={(newValue: string) => {
                    setFieldValue('fishProcessedResult', newValue).then(() => {
                      setFieldTouched('fishProcessedResult', true)
                    })

                    if (noCatchData) {
                      setFieldValue('reasonForNotProcessing', '').then(() => {
                        setFieldTouched('reasonForNotProcessing', false)
                      })
                      setFieldError('reasonForNotProcessing', undefined)
                    }
                  }}
                  setFieldTouched={() => setFieldTouched('fishProcessedResult')}
                  selectOptions={fishProcessedDropdowns}
                />

                {noCatchData && (
                  <CustomSelect
                    label='Reason For Not Processing'
                    camelName='reasonForNotProcessing'
                    errors={errors}
                    touched={touched}
                    selectedValue={values.reasonForNotProcessing}
                    placeholder='Select Reason'
                    onValueChange={(newValue: string) => {
                      setFieldValue('reasonForNotProcessing', newValue).then(
                        () => {
                          setFieldTouched('reasonForNotProcessing', true)
                        }
                      )
                    }}
                    selectOptions={whyFishNotProcessedDropdowns}
                  />
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
