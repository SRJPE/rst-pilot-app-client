import { Formik, yupToFormErrors, FormikProps } from 'formik'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  Text,
  FormControl,
  Heading,
  Input,
  VStack,
  HStack,
  Radio,
  Icon,
  Button,
  Pressable,
  Popover,
  Box,
  IconButton,
  ScrollView,
} from 'native-base'
import NavButtons from '../../components/formContainer/NavButtons'
import { trapPostProcessingSchema } from '../../utils/helpers/yupValidations'
import { DeviceEventEmitter, Keyboard } from 'react-native'
import FormInputComponent, {
  TextInputAdornment,
} from '../../components/Shared/FormInputComponent'
import {
  checkIfFormIsComplete,
  markStepCompleted,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import {
  markTrapPostProcessingCompleted,
  saveTrapPostProcessing,
} from '../../redux/reducers/formSlices/trapPostProcessingSlice'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'
import {
  QARanges,
  navigateHelper,
  navigateFlowRightButton,
  navigateFlowLeftButton,
  showFishInputButton,
} from '../../utils/utils'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { StackActions } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'

const mapStateToProps = (state: RootState) => {
  let activeTabId = state.tabSlice.activeTabId
  let willBeHoldingFishForMarkRecapture = false

  if (activeTabId) {
    const tabsContainHoldingTrue = Object.keys(state.tabSlice.tabs).some(
      tabId =>
        state.fishProcessing?.[tabId]?.values?.willBeHoldingFishForMarkRecapture
    )
    willBeHoldingFishForMarkRecapture = tabsContainHoldingTrue
  }

  return {
    reduxState: state.trapPostProcessing,
    tabSlice: state.tabSlice,
    activeTabId: state.tabSlice.activeTabId,
    willBeHoldingFishForMarkRecapture,
    previouslyActiveTabId: state.tabSlice.previouslyActiveTabId,
    navigationSlice: state.navigation,
    userCredentialsStore: state.userCredentials,
    fishProcessingSlice: state.fishProcessing,
  }
}

const TrapPostProcessing = ({
  navigation,
  reduxState,
  tabSlice,
  activeTabId,
  willBeHoldingFishForMarkRecapture,
  previouslyActiveTabId,
  navigationSlice,
  userCredentialsStore,
  fishProcessingSlice,
}: {
  navigation: any
  reduxState: any
  tabSlice: any
  activeTabId: any
  willBeHoldingFishForMarkRecapture: boolean
  previouslyActiveTabId: string | null
  navigationSlice: any
  fishProcessingSlice: any
  userCredentialsStore: any
}) => {
  console.log(
    '🚀 ~ TrapPostProcessing.tsx:94 ~ fishProcessingSlice:',
    fishProcessingSlice
  )

  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  const recordTurbidityInPostProcessing = useSelector(
    (state: any) =>
      !state.trapOperations?.[tabSlice.activeTabId]?.values
        ?.recordTurbidityInPostProcessing
  )

  const [locationClicked, setLocationClicked] = useState(false as boolean)
  const [startTime, setStartTime] = useState(new Date() as any)

  const userPrograms = userCredentialsStore?.userPrograms || []
  const programNames = userPrograms.map((program: any) => program.programName)

  const onStartTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setStartTime(currentDate)
  }

  const tabIds = Object.keys(tabSlice.tabs)
  const shouldNavigateToFishInput = showFishInputButton({
    fishProcessing: fishProcessingSlice,
    tabIds,
  })

  useEffect(() => {
    if (activeTabId) {
      if (
        reduxState[activeTabId]?.values?.trapVisitStartTime &&
        reduxState[activeTabId]?.values?.trapVisitStartTime !== 'Invalid Date'
      ) {
        setStartTime(reduxState[activeTabId]?.values?.trapVisitStartTime)
      }
    }
  }, [activeTabId, reduxState])

  const getCurrentLocation = (setFieldTouched: any, setFieldValue: any) => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return
      }
      try {
        let currentLocation = await Location.getCurrentPositionAsync({})
        setFieldValue('trapLatitude', currentLocation.coords.latitude)
        setFieldValue('trapLongitude', currentLocation.coords.longitude)
        setFieldTouched('trapLatitude', true)
        setFieldTouched('trapLongitude', true)
        setLocationClicked(false)
      } catch (error) {
        console.error(error)
      }
    })()
  }

  const handleTrapStatusAtEndRadio = useCallback(
    (nextValue: any, setFieldTouched: any, setFieldValue: any) => {
      setFieldTouched('endingTrapStatus', true)
      if (nextValue === 'Restart Trap') {
        setFieldValue('endingTrapStatus', 'Restart Trap')
      } else {
        setFieldValue('endingTrapStatus', 'End Trapping')
      }
    },
    []
  )

  const checkForErrors = (values: any) => {
    try {
      trapPostProcessingSchema.validateSync(values, {
        abortEarly: false,
        context: { values },
      })
      return {}
    } catch (err) {
      return yupToFormErrors(err)
    }
  }

  const onSubmit = (values: any, tabId: string) => {
    console.log('🚀 ~ onSubmit ~ values', values)
    let trapVisitStartTime = null
    if (values.endingTrapStatus == 'Restart Trap') {
      trapVisitStartTime = startTime || new Date()
    }
    const errors = checkForErrors(values)
    dispatch(
      saveTrapPostProcessing({
        tabId,
        values: { ...values, trapVisitStartTime },
        errors,
      })
    )
    dispatch(markTrapPostProcessingCompleted({ tabId, value: true }))
    let stepCompletedCheck = true
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
    })

    if (stepCompletedCheck) {
      dispatch(markStepCompleted({ propName: 'trapPostProcessing' }))
      dispatch(checkIfFormIsComplete())
    }
    console.log('🚀 ~ onSubmit ~ TrapPostProcessing', values)
  }

  const initialValues = useMemo(() => {
    let initialValues

    if (reduxState[activeTabId]) {
      initialValues = { ...reduxState[activeTabId].values }

      if (recordTurbidityInPostProcessing) {
        initialValues = {
          ...initialValues,
          isWaterTurbidityPresent: true,
        }
      }
    } else {
      initialValues = {
        ...reduxState['placeholderId'].values,
        isWaterTurbidityPresent: recordTurbidityInPostProcessing,
      }
    }

    return initialValues
  }, [reduxState, activeTabId])

  const nonFeatherYubaProgram = !userPrograms.some((element: string) =>
    ['Feather RST Monitoring', 'Yuba River RST Monitoring'].includes(element)
  )

  const handleNavButtonClick = (direction: 'left' | 'right', values: any) => {
    if (activeTabId && activeTabId != 'placeholderId') {
      let destination = navigateFlowRightButton({
        values,
        activePage,
        holdingForMarkRecap: willBeHoldingFishForMarkRecapture,
        navigation,
      })

      if (direction === 'left') {
        destination = shouldNavigateToFishInput
          ? navigateFlowLeftButton(
              activePage,
              willBeHoldingFishForMarkRecapture,
              navigation,
              values
            )
          : 'Fish Processing'
      }

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

  const popoverTrigger = (triggerProps: any) => {
    return (
      <IconButton
        {...triggerProps}
        marginTop={-2}
        icon={
          <Icon
            as={MaterialIcons}
            color='black'
            name='info-outline'
            size='lg'
          />
        }
      ></IconButton>
    )
  }

  return (
    <ScrollView>
      <Formik
        validationSchema={trapPostProcessingSchema}
        enableReinitialize={true}
        initialValues={initialValues}
        initialTouched={
          activeTabId && reduxState[activeTabId]
            ? reduxState[activeTabId].errors
            : null
        }
        initialErrors={
          activeTabId && reduxState[activeTabId]
            ? reduxState[activeTabId].errors
            : null
        }
        onSubmit={() => {}}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldTouched,
          setFieldValue,
          touched,
          errors,
          values,
          resetForm,
          isValid,
        }) => {
          const checkOtherTabForms = () => {
            const tabIds = Object.keys(tabSlice.tabs)
            const fishProcessingOtherTabsValidity = tabIds.map(tabId => {
              if (tabId !== activeTabId) {
                const tabFormValues = reduxState[tabId]?.values
                const formIsValid =
                  trapPostProcessingSchema.isValidSync(tabFormValues)

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

          useEffect(() => {
            if (previouslyActiveTabId && navigationSlice.activeStep === 5) {
              onSubmit(values, previouslyActiveTabId)
              resetForm()
            }
          }, [previouslyActiveTabId])

          const navButtons = useMemo(
            () => (
              <NavButtons
                navigation={navigation}
                handleSubmit={(buttonDirection: 'left' | 'right') => {
                  handleNavButtonClick(buttonDirection, values)
                }}
                errors={errors}
                touched={touched}
                shouldProceedToLoadingScreen={true}
                isValid={isValid && otherTabFormsValid}
              />
            ),
            [
              navigation,
              handleSubmit,
              errors,
              touched,
              activePage,
              values,
              startTime,
              isValid,
            ]
          )
          return (
            <>
              <Pressable
                flex={1}
                bg='#fff'
                px='5%'
                py='3%'
                borderColor='themeGrey'
                borderWidth='15'
                onPress={Keyboard.dismiss}
              >
                <VStack space={1}>
                  <Heading>Trap Post-Processing</Heading>
                  <HStack space={5}>
                    <FormInputComponent
                      label='Debris Volume'
                      placeholder='0'
                      touched={touched}
                      errors={errors}
                      camelName='debrisVolume'
                      onChangeText={handleChange('debrisVolume')}
                      onBlur={() => setFieldTouched('debrisVolume')}
                      value={values.debrisVolume}
                      RightElement={<TextInputAdornment text='gal' />}
                    />
                    <FormInputComponent
                      label='Total Revolutions'
                      placeholder='0'
                      touched={touched}
                      errors={errors}
                      camelName='totalRevolutions'
                      onChangeText={handleChange('totalRevolutions')}
                      onBlur={() => setFieldTouched('totalRevolutions')}
                      value={values.totalRevolutions}
                    />
                    {/* 
                    {recordTurbidityInPostProcessing && (
                      <FormInputComponent
                        label=' Water Turbidity (optional)'
                        placeholder='0'
                        touched={touched}
                        errors={errors}
                        camelName='totalRevolutions'
                        onChangeText={handleChange('waterTurbidity')}
                        onBlur={() => setFieldTouched('totalRevolutions')}
                        value={values.waterTurbidity}
                      />
                    )} */}
                  </HStack>
                  <FormControl>
                    <HStack space={4} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          RPM After Cleaning
                        </Text>
                      </FormControl.Label>
                      <Popover
                        placement='bottom left'
                        trigger={triggerProps => {
                          return (
                            <IconButton
                              {...triggerProps}
                              icon={
                                <Icon
                                  as={MaterialIcons}
                                  color='black'
                                  name='info-outline'
                                  size='lg'
                                />
                              }
                            ></IconButton>
                          )
                        }}
                      >
                        <Popover.Content
                          accessibilityLabel='RPM Info'
                          w='600'
                          mr='10'
                        >
                          <Popover.Arrow />
                          <Popover.Header>
                            Take up to three measurements of cone rotations. The
                            averages of the entered values will be saved to the
                            database.
                          </Popover.Header>
                        </Popover.Content>
                      </Popover>
                    </HStack>
                    <HStack space={5} justifyContent='space-between'>
                      <Box flex={1}>
                        <FormInputComponent
                          label={'Measure 1'}
                          placeholder='0'
                          touched={touched}
                          errors={errors}
                          value={values.rpm1 ? `${values.rpm1}` : ''}
                          camelName={'rpm1'}
                          onChangeText={newValue => {
                            setFieldValue('rpm1', newValue)
                            if (!newValue) {
                              setFieldValue('rpm2', null)
                              setFieldValue('rpm3', null)
                            }
                          }}
                          onBlur={handleBlur('rpm1')}
                        />
                      </Box>
                      <Box flex={1}>
                        <FormInputComponent
                          isDisabled={values.rpm1 ? false : true}
                          label={'Measure 2 (optional)'}
                          placeholder='0'
                          touched={touched}
                          errors={errors}
                          value={values.rpm2 ? `${values.rpm2}` : ''}
                          camelName={'rpm2'}
                          onChangeText={newValue => {
                            setFieldValue('rpm2', newValue)
                            if (!newValue) {
                              setFieldValue('rpm3', null)
                            }
                          }}
                          onBlur={handleBlur('rpm2')}
                        />
                      </Box>
                      <Box flex={1}>
                        <FormInputComponent
                          isDisabled={values.rpm1 && values.rpm2 ? false : true}
                          label={'Measure 3 (optional)'}
                          placeholder='0'
                          touched={touched}
                          errors={errors}
                          value={values.rpm3 ? `${values.rpm3}` : ''}
                          camelName={'rpm3'}
                          onChangeText={handleChange('rpm3')}
                          onBlur={handleBlur('rpm3')}
                        />
                      </Box>
                    </HStack>
                  </FormControl>
                  <HStack
                    space={5}
                    justifyContent='space-between'
                    alignItems='center'
                  >
                    <Box flex={1}>
                      <FormInputComponent
                        label={'Latitude'}
                        placeholder='0.00'
                        touched={touched}
                        errors={errors}
                        value={values?.trapLatitude?.toString() || ''}
                        camelName={'trapLatitude'}
                        onChangeText={handleChange('trapLatitude')}
                        onBlur={handleBlur('trapLatitude')}
                      />
                    </Box>
                    <Box flex={1}>
                      <FormInputComponent
                        label={'Longitude'}
                        placeholder='0.00'
                        touched={touched}
                        errors={errors}
                        value={values?.trapLongitude?.toString() || ''}
                        camelName={'trapLongitude'}
                        onChangeText={handleChange('trapLongitude')}
                        onBlur={handleBlur('trapLongitude')}
                      />
                    </Box>
                    {nonFeatherYubaProgram && (
                      <Box>
                        <Button
                          bg='primary'
                          h={50}
                          px={5}
                          // isLoading={locationClicked}
                          // isLoading
                          isLoadingText='Retrieving Location'
                          spinnerPlacement='end'
                          _loading={{
                            _text: {
                              fontSize: 'xl',
                            },
                          }}
                          onPress={() => {
                            setLocationClicked(true)
                            getCurrentLocation(setFieldTouched, setFieldValue)
                          }}
                        >
                          <Text fontSize='xl' color='white'>
                            Use Current Location
                          </Text>
                        </Button>
                      </Box>
                    )}
                  </HStack>
                  {/* <FormControl>
                    <HStack space={4} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          RPM After Cleaning
                        </Text>
                      </FormControl.Label>
                      {((touched.rpm1 && errors.rpm1) ||
                        (touched.rpm2 && errors.rpm2) ||
                        (touched.rpm3 && errors.rpm3)) && (
                        <HStack space={1}>
                          <Icon
                            marginTop={'.5'}
                            as={Ionicons}
                            name='alert-circle-outline'
                            color='error'
                          />
                          <Text style={{ fontSize: 16, color: '#b71c1c' }}>
                            At least one measurement is required
                          </Text>
                        </HStack>
                      )}
                    </HStack>

                    <HStack space={8} justifyContent='space-between'>
                      <FormControl w='30%'>
                        <VStack>
                          <Input
                            height='50px'
                            fontSize='16'
                            placeholder='Numeric Value'
                            keyboardType='numeric'
                            onChangeText={handleChange('rpm1')}
                            onBlur={handleBlur('rpm1')}
                            value={values.rpm1}
                          />
                          {Number(values.rpm1) > QARanges.RPM.max ? (
                            <RenderWarningMessage />
                          ) : (
                            <></>
                          )}
                        </VStack>
                      </FormControl>
                      <FormControl w='30%'>
                        <VStack>
                          <Input
                            height='50px'
                            fontSize='16'
                            placeholder='Numeric Value (optional)'
                            keyboardType='numeric'
                            onChangeText={handleChange('rpm2')}
                            onBlur={handleBlur('rpm2')}
                            value={values.rpm2}
                          />
                          {Number(values.rpm2) > QARanges.RPM.max ? (
                            <RenderWarningMessage />
                          ) : (
                            <></>
                          )}
                        </VStack>
                      </FormControl>

                      <FormControl w='30%'>
                        <VStack>
                          <Input
                            height='50px'
                            fontSize='16'
                            placeholder='Numeric Value (optional)'
                            keyboardType='numeric'
                            onChangeText={handleChange('rpm3')}
                            onBlur={handleBlur('rpm3')}
                            value={values.rpm3}
                          />
                          {Number(values.rpm3) > QARanges.RPM.max ? (
                            <RenderWarningMessage />
                          ) : (
                            <></>
                          )}
                        </VStack>
                      </FormControl>
                    </HStack>
                    <Text color='grey' my='5' fontSize='17'>
                      Take one or more measure of cone rotations. We will save
                      the average in our database.
                    </Text>
                    {/* if user programs is not F/Y, okay to show drop pin */}
                  {/* {!userPrograms.some((element: string) =>
                    [
                      'Feather RST Monitoring',
                      'Yuba River RST Monitoring',
                    ].includes(element)
                  ) && (
                    <HStack space={3} mt='5'>
                      <Button
                        w='1/2'
                        // h='12%'
                        bg='primary'
                        px='10'
                        isLoading={locationClicked}
                        spinnerPlacement='end'
                        isLoadingText='Drop Pin at Current Location'
                        _loading={{
                          _text: {
                            fontSize: 'xl',
                          },
                        }}
                        onPress={() => {
                          setLocationClicked(true)
                          getCurrentLocation(setFieldTouched, setFieldValue)
                        }}
                      >
                        <Text fontSize='xl' color='white'>
                          Drop Pin at Current Location
                        </Text>
                      </Button>
                      <VStack space={3} alignSelf='center'>
                        <Text fontSize='xl' color='black'>
                          {values.trapLatitude
                            ? `Lat:  ${values.trapLatitude}`
                            : 'Lat:'}
                        </Text>
                        <Text fontSize='xl' color='black'>
                          {values.trapLongitude
                            ? `Long:  ${values.trapLongitude}`
                            : 'Long:'}
                        </Text>
                      </VStack>
                    </HStack>
                  )} */}
                  {/* </FormControl>  */}
                  <FormControl w='30%'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Trap Status at End
                      </Text>
                    </FormControl.Label>
                    <Radio.Group
                      name='endingTrapStatus'
                      accessibilityLabel='Ending Trap Status'
                      value={`${values.endingTrapStatus}`}
                      onChange={(newValue: any) => {
                        handleTrapStatusAtEndRadio(
                          newValue,
                          setFieldTouched,
                          setFieldValue
                        )
                      }}
                    >
                      <Radio
                        colorScheme='primary'
                        value='Restart Trap'
                        my={1}
                        _icon={{ color: 'primary' }}
                      >
                        Continue Trapping
                      </Radio>
                      <Radio
                        colorScheme='primary'
                        value='End Trapping'
                        my={1}
                        _icon={{ color: 'primary' }}
                      >
                        End Trapping
                      </Radio>
                    </Radio.Group>
                  </FormControl>
                  {values.endingTrapStatus === 'Restart Trap' && (
                    <FormControl>
                      <VStack space={2}>
                        <HStack space={4}>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Trapping Start Date and Time:
                            </Text>
                            <Popover
                              placement='bottom left'
                              trigger={popoverTrigger}
                            >
                              <Popover.Content
                                accessibilityLabel='Trap Visit Start Info'
                                w='600'
                                mr='10'
                              >
                                <Popover.Arrow />
                                <Popover.CloseButton />
                                <Popover.Header>
                                  Please set the Date and Time of when you
                                  returned the trap to begin the new trapping
                                  period.
                                </Popover.Header>
                                <Popover.Body p={4}>
                                  <VStack space={2}>
                                    <HStack space={2} alignItems='flex-start'>
                                      <Text fontSize='md'>
                                        This value is used to record the date
                                        and time of returning the trap to the
                                        water to start the new trapping period.
                                      </Text>
                                    </HStack>
                                  </VStack>
                                </Popover.Body>
                              </Popover.Content>
                            </Popover>
                          </FormControl.Label>
                        </HStack>
                        <Box alignSelf='flex-start' ml='-2'>
                          <DateTimePicker
                            value={startTime}
                            mode='datetime'
                            onChange={onStartTimeChange}
                            accentColor='#007C7C'
                          />
                        </Box>
                      </VStack>
                    </FormControl>
                  )}
                  <FormInputComponent
                    multiline={true}
                    label={'Comments'}
                    placeholder='Enter any additional comments'
                    touched={touched}
                    errors={errors}
                    value={values.comments}
                    camelName={'comments'}
                    onChangeText={handleChange('comments')}
                    onBlur={handleBlur('comments')}
                  />
                </VStack>
              </Pressable>
              {navButtons}
            </>
          )
        }}
      </Formik>
    </ScrollView>
  )
}

export default connect(mapStateToProps)(TrapPostProcessing)
