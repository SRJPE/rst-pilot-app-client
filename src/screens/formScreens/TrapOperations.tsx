import React, { useEffect, useMemo, useState } from 'react'
import { Formik, yupToFormErrors } from 'formik'
import { useSelector, useDispatch, connect } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  FormControl,
  Heading,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  Icon,
  Popover,
  Avatar,
  Pressable,
  Radio,
  ScrollView,
  KeyboardAvoidingView,
  Switch,
  Box,
} from 'native-base'
import NavButtons from '../../components/formContainer/NavButtons'
import { trapOperationsSchema } from '../../utils/helpers/yupValidations'
import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import {
  markStepCompleted,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  markTrapOperationsCompleted,
  saveTrapOperations,
} from '../../redux/reducers/formSlices/trapOperationsSlice'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { DeviceEventEmitter, Keyboard } from 'react-native'
import { QARanges, navigateHelper } from '../../utils/utils'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'
import OptimizedInput from '../../components/Shared/OptimizedInput'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import DateTimePicker from '@react-native-community/datetimepicker'

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.trapOperations,
    selectedStream:
      state.visitSetup[state.tabSlice.activeTabId ?? 'placeholderId']?.values
        ?.stream,
    selectedTrapSite:
      state.visitSetup[state.tabSlice.activeTabId ?? 'placeholderId']?.values
        ?.trapSite,
    selectedTrapName:
      state.visitSetup[state.tabSlice.activeTabId ?? 'placeholderId']?.values
        ?.trapName,
    activeTabId: state.tabSlice.activeTabId,
    previouslyActiveTabId: state.tabSlice.previouslyActiveTabId,
    navigationSlice: state.navigation,
    tabSlice: state.tabSlice,
  }
}

const TrapOperations = ({
  navigation,
  reduxState,
  selectedStream,
  selectedTrapSite,
  selectedTrapName,
  activeTabId,
  previouslyActiveTabId,
  navigationSlice,
  tabSlice,
}: {
  navigation: any
  reduxState: any
  selectedStream: string
  selectedTrapSite: string
  selectedTrapName?: string

  activeTabId: string | null
  previouslyActiveTabId: string | null
  navigationSlice: any
  tabSlice: TabStateI
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const { whyTrapNotFunctioning } = dropdownValues
  const trapNotInServiceLabel = '- restart trapping'
  const trapNotInServiceIdentifier = 'trap not in service - restart trapping'
  const [turbidityToggle, setTurbidityToggle] = useState(false as boolean)
  const [startTime, setStartTime] = useState(new Date() as any)

  const useFlowMeasureCalculationBool = (flowMeasureEntered: number) => {
    return useMemo(() => {
      if (!flowMeasureEntered || !QARanges) {
        return false
      }
      let warningResult = false
      let activeTabName = selectedTrapName

      if (activeTabId) {
        activeTabName = tabSlice.tabs[activeTabId].name
      }
      const range = activeTabName
        ? QARanges.flowMeasure[selectedStream.trim()][selectedTrapSite.trim()][
            activeTabName.trim()
          ]
        : QARanges.flowMeasure[selectedStream.trim()][selectedTrapSite.trim()]

      if (flowMeasureEntered > range.max || flowMeasureEntered < range.min) {
        warningResult = true
      }

      return warningResult
    }, [flowMeasureEntered, selectedTrapName, selectedStream, selectedTrapSite])
  }

  const useWaterTempCalculationBool = (
    waterTemperatureValue: number,
    unit: string
  ) => {
    return useMemo(() => {
      if (!waterTemperatureValue) {
        return false
      }
      let warningResult = false
      const maxTemp =
        unit === '°F'
          ? QARanges.waterTemperature.maxF
          : QARanges.waterTemperature.maxC

      if (waterTemperatureValue > maxTemp) {
        warningResult = true
      }

      return warningResult
    }, [waterTemperatureValue, unit])
  }

  const checkForErrors = (values: any) => {
    try {
      trapOperationsSchema.validateSync(values, {
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
      if (values.recordTurbidityInPostProcessing) {
        values.waterTurbidity = null
      }
      dispatch(
        saveTrapOperations({
          tabId,
          values: {
            ...values,
            trapVisitStopTime: new Date(), //refactor needed
            trapVisitStartTime: startTime,
          },
          errors,
        })
      )
      dispatch(markTrapOperationsCompleted({ tabId, value: true }))
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
          if (
            !reduxState[allTabId].completed ||
            Object.keys(reduxState[allTabId].errors).length
          ) {
            stepCompletedCheck = false
          }
        }
      })

      if (stepCompletedCheck)
        dispatch(markStepCompleted({ propName: 'trapOperations' }))
      console.log('🚀 ~ handleSubmit ~ Status', values)
    }
  }

  const inputUnit = (text: string, setFieldValue?: any) => {
    return (
      <Text
        color='#A1A1A1'
        position='absolute'
        top={50}
        right={4}
        fontSize={16}
        onPress={() => {
          if (setFieldValue) {
            if (text === '°C') {
              setFieldValue('waterTemperatureUnit', '°F')
            } else {
              setFieldValue('waterTemperatureUnit', '°C')
            }
          }
        }}
      >
        {text}
      </Text>
    )
  }

  const popoverTrigger = (triggerProps: any) => {
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
  }

  const onStartTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setStartTime(currentDate)
  }

  return (
    <Formik
      validationSchema={trapOperationsSchema}
      enableReinitialize={true}
      initialValues={
        activeTabId
          ? reduxState[activeTabId]
            ? reduxState[activeTabId].values
            : reduxState['placeholderId'].values
          : reduxState['placeholderId'].values
      }
      initialErrors={
        activeTabId && reduxState[activeTabId]
          ? reduxState[activeTabId].errors
          : null
      }
      // only create initial error when form is not completed
      onSubmit={(values: any) => {
        if (activeTabId && activeTabId != 'placeholderId') {
          const callback = () => {
            if (values?.trapStatus === 'trap not functioning') {
              navigateHelper(
                'Non Functional Trap',
                navigationSlice,
                navigation,
                dispatch,
                updateActiveStep
              )
            } else if (
              values?.trapStatus === 'trap not in service - restart trapping'
            ) {
              navigateHelper(
                'Started Trapping',
                navigationSlice,
                navigation,
                dispatch,
                updateActiveStep
              )
            } else if (values?.flowMeasure > 1000) {
              navigateHelper(
                'High Flows',
                navigationSlice,
                navigation,
                dispatch,
                updateActiveStep
              )
            } else if (values?.waterTemperatureUnit === '°C') {
              if (values?.waterTemperature > 30) {
                navigateHelper(
                  'High Temperatures',
                  navigationSlice,
                  navigation,
                  dispatch,
                  updateActiveStep
                )
              } else {
                navigateHelper(
                  'Fish Processing',
                  navigationSlice,
                  navigation,
                  dispatch,
                  updateActiveStep
                )
              }
            } else if (values?.waterTemperatureUnit === '°F') {
              if (values?.waterTemperature > 86) {
                navigateHelper(
                  'High Temperatures',
                  navigationSlice,
                  navigation,
                  dispatch,
                  updateActiveStep
                )
              } else {
                navigateHelper(
                  'Fish Processing',
                  navigationSlice,
                  navigation,
                  dispatch,
                  updateActiveStep
                )
              }
            } else {
              navigateHelper(
                'Fish Processing',
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
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        touched,
        errors,
        values,
        resetForm,
      }) => {
        const warningResultFlow = useFlowMeasureCalculationBool(
          Number(values.flowMeasure)
        )
        const warningResultTemp = useWaterTempCalculationBool(
          Number(values.waterTemperature),
          values.waterTemperatureUnit
        )
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
        useEffect(() => {
          if (previouslyActiveTabId && navigationSlice.activeStep === 2) {
            onSubmit(values, previouslyActiveTabId)
            resetForm()
          }
        }, [previouslyActiveTabId])
        return (
          <KeyboardAvoidingView flex='1' behavior='padding'>
            <ScrollView
              bg='#fff'
              px='5%'
              py='3%'
              borderColor='themeGrey'
              borderWidth='15'
              borderBottomWidth='0'
              borderTopWidth='0'
              my='15'
            >
              <Pressable onPress={Keyboard.dismiss}>
                <VStack space={4}>
                  <Heading>Trap Operations</Heading>
                  <FormControl>
                    <VStack space={2}>
                      <Text color='black' fontSize='xl'>
                        Trap Visit Start Date and Time:
                      </Text>
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
                  <FormControl>
                    <HStack space={2} alignItems='center'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Is the Trap functioning normally?
                        </Text>
                      </FormControl.Label>
                      <Popover placement='bottom left' trigger={popoverTrigger}>
                        <Popover.Content
                          accessibilityLabel='Trap Stats Info'
                          w='600'
                          mr='10'
                        >
                          <Popover.Arrow />
                          <Popover.CloseButton />
                          <Popover.Header>
                            Please select one of the trap functioning dropdowns
                            based on a visual inspection of the trap.
                          </Popover.Header>
                          <Popover.Body p={4}>
                            <VStack space={2}>
                              <HStack space={2} alignItems='flex-start'>
                                <Avatar size={'2'} mt={'2'} />
                                <Text fontSize='md'>
                                  Trap Functioning Normally: Trap rotating
                                  normally in the expected location in river.
                                </Text>
                              </HStack>
                              <HStack space={2} alignItems='flex-start'>
                                <Avatar size={'2'} mt={'2'} />
                                <Text fontSize='md'>
                                  Trap Not Functioning: Trap not rotating or
                                  displaced in the river.
                                </Text>
                              </HStack>
                              <HStack space={2} alignItems='flex-start'>
                                <Avatar size={'2'} mt={'2'} />
                                <Text fontSize='md'>
                                  Trap Functioning but not normally: The trap
                                  appears to be rotating but not consistently.
                                  There may be high flows or high debris levels
                                  that are affecting the trap.
                                </Text>
                              </HStack>
                              <HStack space={2} alignItems='flex-start'>
                                <Avatar size={'2'} mt={'2'} />
                                <Text fontSize='md'>
                                  Trap Not in Service: Trap not set up for
                                  fishing upon arrival.
                                </Text>
                              </HStack>
                            </VStack>
                          </Popover.Body>
                        </Popover.Content>
                      </Popover>
                    </HStack>
                    <CustomSelect
                      selectedValue={values.trapStatus}
                      placeholder='Trap Status'
                      onValueChange={handleChange('trapStatus')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={dropdownValues.trapFunctionality.map(
                        (item: any) => {
                          if (item.definition == 'trap not in service') {
                            return {
                              label: `${item.definition} ${trapNotInServiceLabel}`,
                              value: `${item.definition} ${trapNotInServiceLabel}`,
                            }
                          } else {
                            return {
                              label: item.definition,
                              value: item.definition,
                            }
                          }
                        }
                      )}
                    />
                  </FormControl>
                  {(values.trapStatus === 'trap functioning but not normally' ||
                    values.trapStatus === 'trap not functioning') && (
                    <FormControl>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Reason For Trap Not Functioning
                        </Text>
                      </FormControl.Label>
                      <CustomSelect
                        selectedValue={values.reasonNotFunc}
                        placeholder='Reason'
                        onValueChange={handleChange('reasonNotFunc')}
                        setFieldTouched={setFieldTouched}
                        selectOptions={whyTrapNotFunctioning}
                      />
                      {tabSlice.incompleteSectionTouched
                        ? errors.reasonNotFunc &&
                          RenderErrorMessage(errors, 'reasonNotFunc')
                        : touched.reasonNotFunc &&
                          errors.reasonNotFunc &&
                          RenderErrorMessage(errors, 'reasonNotFunc')}
                    </FormControl>
                  )}
                  {values.trapStatus.length > 0 && (
                    <>
                      <FormControl w='30%'>
                        <HStack space={4} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Cone Setting
                            </Text>
                          </FormControl.Label>
                          <Radio.Group
                            name='coneSetting'
                            accessibilityLabel='cone setting'
                            value={`${values.coneSetting}`}
                            onChange={(value: any) => {
                              setFieldTouched('coneSetting', true)
                              if (value === 'full') {
                                setFieldValue('coneSetting', 'full')
                              } else {
                                setFieldValue('coneSetting', 'half')
                              }
                            }}
                          >
                            <HStack space={4}>
                              <Radio
                                colorScheme='primary'
                                value='full'
                                my={1}
                                _icon={{ color: 'primary' }}
                              >
                                Full
                              </Radio>
                              <Radio
                                colorScheme='primary'
                                value='half'
                                my={1}
                                _icon={{ color: 'primary' }}
                              >
                                Half
                              </Radio>
                            </HStack>
                          </Radio.Group>
                        </HStack>
                      </FormControl>
                      <FormControl>
                        <HStack space={4} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              RPM Before Cleaning
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
                                Take one or more measure of cone rotations. We
                                will save the average in our database.
                              </Popover.Header>
                            </Popover.Content>
                          </Popover>
                          {tabSlice.incompleteSectionTouched
                            ? (errors.rpm1 || errors.rpm2 || errors.rpm3) && (
                                <HStack space={1}>
                                  <Icon
                                    marginTop={'.5'}
                                    as={Ionicons}
                                    name='alert-circle-outline'
                                    color='error'
                                  />
                                  <Text
                                    style={{ fontSize: 14, color: '#b71c1c' }}
                                  >
                                    At least one measurement is required
                                  </Text>
                                </HStack>
                              )
                            : (touched.rpm1 || touched.rpm2 || touched.rpm3) &&
                              (errors.rpm1 || errors.rpm2 || errors.rpm3) && (
                                <HStack space={1}>
                                  <Icon
                                    marginTop={'.5'}
                                    as={Ionicons}
                                    name='alert-circle-outline'
                                    color='error'
                                  />
                                  <Text
                                    style={{ fontSize: 14, color: '#b71c1c' }}
                                  >
                                    At least one measurement is required
                                  </Text>
                                </HStack>
                              )}
                        </HStack>
                        <HStack space={8} justifyContent='space-between'>
                          <FormControl w='30%'>
                            <VStack>
                              <OptimizedInput
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
                              <OptimizedInput
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
                              <OptimizedInput
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
                        <Text color='grey' mt='5' fontSize='17'>
                          Please take 3 separate measures of cone rotations per
                          minute before cleaning the trap.
                        </Text>
                      </FormControl>

                      <HStack
                        space={5}
                        width='100%'
                        justifyContent='space-between'
                      >
                        <Heading>Environmental Conditions</Heading>
                        <FormControl w='30%'>
                          <HStack space={2} alignItems='center'>
                            <FormControl.Label>
                              <Text fontSize='14'>
                                Record Turbidity in Post Processing
                              </Text>
                            </FormControl.Label>
                            <Switch
                              name='recordTurbidityInPostProcessing'
                              shadow='3'
                              offTrackColor='secondary'
                              onTrackColor='primary'
                              size='md'
                              isChecked={turbidityToggle}
                              value={values.recordTurbidityInPostProcessing}
                              onToggle={() => {
                                setFieldValue('waterTurbidity', null)
                                !turbidityToggle
                                  ? setFieldValue(
                                      'recordTurbidityInPostProcessing',
                                      true
                                    )
                                  : setFieldValue(
                                      'recordTurbidityInPostProcessing',
                                      false
                                    )
                                setTurbidityToggle(!turbidityToggle)
                              }}
                            />
                          </HStack>
                        </FormControl>
                      </HStack>

                      <HStack space={5} width='125%'>
                        <FormControl w='1/4'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Flow Measure
                            </Text>
                          </FormControl.Label>
                          <OptimizedInput
                            height='50px'
                            fontSize='16'
                            placeholder='Populated from CDEC'
                            keyboardType='numeric'
                            onChangeText={handleChange('flowMeasure')}
                            onBlur={handleBlur('flowMeasure')}
                            value={values.flowMeasure}
                          />
                          {inputUnit(values.flowMeasureUnit)}

                          {warningResultFlow && <RenderWarningMessage />}

                          {tabSlice.incompleteSectionTouched
                            ? errors.flowMeasure &&
                              RenderErrorMessage(errors, 'flowMeasure')
                            : touched.flowMeasure &&
                              errors.flowMeasure &&
                              RenderErrorMessage(errors, 'flowMeasure')}
                        </FormControl>
                        <FormControl w='1/4'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Water Temperature
                            </Text>
                          </FormControl.Label>
                          <OptimizedInput
                            height='50px'
                            fontSize='16'
                            placeholder='Numeric Value'
                            keyboardType='numeric'
                            onChangeText={handleChange('waterTemperature')}
                            onBlur={handleBlur('waterTemperature')}
                            value={values.waterTemperature}
                          />

                          {inputUnit(
                            values.waterTemperatureUnit,
                            setFieldValue
                          )}

                          {warningResultTemp && <RenderWarningMessage />}

                          {tabSlice.incompleteSectionTouched
                            ? errors.waterTemperature &&
                              RenderErrorMessage(errors, 'waterTemperature')
                            : touched.waterTemperature &&
                              errors.waterTemperature &&
                              RenderErrorMessage(errors, 'waterTemperature')}
                        </FormControl>
                        <FormControl w='1/4'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Water Turbidity
                            </Text>
                          </FormControl.Label>

                          <OptimizedInput
                            isReadOnly={turbidityToggle}
                            height='50px'
                            fontSize='16'
                            placeholder='Numeric Value'
                            keyboardType='numeric'
                            onChangeText={handleChange('waterTurbidity')}
                            onBlur={handleBlur('waterTurbidity')}
                            value={values.waterTurbidity}
                          />
                          {inputUnit(values.waterTurbidityUnit)}
                          {Number(values.waterTurbidity) >
                            QARanges.waterTurbidity.max && (
                            <RenderWarningMessage />
                          )}
                          {tabSlice.incompleteSectionTouched
                            ? errors.totalRevolutions &&
                              RenderErrorMessage(errors, 'waterTurbidity')
                            : touched.totalRevolutions &&
                              errors.totalRevolutions &&
                              RenderErrorMessage(errors, 'waterTurbidity')}
                        </FormControl>
                      </HStack>
                      <Text
                        color='black'
                        fontSize='xl'
                        alignSelf='center'
                        pb='15%'
                      >
                        - Remove debris and begin fish processing -
                      </Text>
                    </>
                  )}
                </VStack>
              </Pressable>
            </ScrollView>
            {navButtons}
          </KeyboardAvoidingView>
        )
      }}
    </Formik>
  )
}

export default connect(mapStateToProps)(TrapOperations)
