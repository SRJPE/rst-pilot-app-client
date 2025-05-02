import React, { useEffect, useMemo, useState, useRef } from 'react'
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
  ScrollView,
  KeyboardAvoidingView,
  Switch,
  Box,
  Button,
} from 'native-base'
import CopyFormValuesDialog from '../../components/form/CopyFormValuesDialog'
import NavButtons from '../../components/formContainer/NavButtons'
import {
  trapOperationsSchema,
  generateDynamicTrapOpsSchema,
} from '../../utils/helpers/yupValidations'
import {
  markStepCompleted,
  updateActiveStep,
} from '../../redux/reducers/formSlices/navigationSlice'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  markTrapOperationsCompleted,
  saveTrapOperations,
} from '../../redux/reducers/formSlices/trapOperationsSlice'
import { MaterialIcons } from '@expo/vector-icons'
import { DeviceEventEmitter, Keyboard } from 'react-native'
import {
  QARanges,
  navigateHelper,
  navigateFlowRightButton,
  navigateFlowLeftButton,
} from '../../utils/utils'
import {
  TabStateI,
  setActiveTab,
} from '../../redux/reducers/formSlices/tabSlice'
import { StackActions } from '@react-navigation/native'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { find } from 'lodash'
import FormInputComponent, {
  TextInputAdornment,
} from '../../components/Shared/FormInputComponent'
import ConditionalTrapVisitFields from '../../components/form/ConditionalTrapVisitFields'
import TrapEndDateAndTime from '../../components/form/TrapEndDateAndTime'
import RPMBefore from '../../components/form/RPMBefore'
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
    selectedTrapLocationId:
      state.visitSetup[state.tabSlice.activeTabId ?? 'placeholderId']?.values
        ?.trapLocationId,
    selectedProgramId:
      state.visitSetup[state.tabSlice.activeTabId ?? 'placeholderId']?.values
        ?.programId,
    activeTabId: state.tabSlice.activeTabId,
    previouslyActiveTabId: state.tabSlice.previouslyActiveTabId,
    navigationSlice: state.navigation,
    tabSlice: state.tabSlice,
    visitSetupDefaults: state.visitSetupDefaults,
  }
}

const TrapOperations = ({
  navigation,
  reduxState,
  selectedStream,
  selectedTrapSite,
  selectedTrapName,
  selectedTrapLocationId,
  selectedProgramId,
  activeTabId,
  previouslyActiveTabId,
  navigationSlice,
  tabSlice,
  visitSetupDefaults,
}: {
  navigation: any
  reduxState: any
  selectedStream: string
  selectedTrapSite: string
  selectedTrapName?: string
  selectedTrapLocationId: number | null
  selectedProgramId: number | null
  activeTabId: string | null
  previouslyActiveTabId: string | null
  navigationSlice: any
  tabSlice: TabStateI
  visitSetupDefaults: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const navigationState = useSelector((state: any) => state.navigation)
  const activeStep = navigationState.activeStep
  const activePage = navigationState.steps[activeStep]?.name
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const { whyTrapNotFunctioning } = dropdownValues
  const trapNotInServiceLabel = '- restart trapping'
  const trapNotInServiceIdentifier = 'trap not in service - restart trapping'
  const [turbidityToggle, setTurbidityToggle] = useState(false as boolean)
  const [endTime, setEndTime] = useState(new Date() as any)
  const [trapPermitInfo, setTrapPermitInfo] = useState<any>(null)
  const [trapLocationInfo, setTrapLocationInfo] = useState<any>(null)
  const [selectedProgramObj, setSelectedProgramObj] = useState<any>(null)
  const [validationSchema, setValidationSchema] =
    useState<any>(trapOperationsSchema)
  const [formFields, setFormFields] = useState<any>(null)
  const inputRefs = useRef({}) // key: field name, value: ref

  const allTabIds: string[] = Object.keys(tabSlice.tabs)

  useEffect(() => {
    // flow threshold on trap location
    // TO DO: temp threshold WILL permit info (Needs to be refactored in db and monitoring program setup)
    const currentTrapPermitInfo = find(
      visitSetupDefaults.permitInfo,
      (permit: any) => permit.programId === selectedProgramId
    )

    const currentTrapLocationInfo = find(
      visitSetupDefaults.trapLocations,
      (trapLocation: any) => trapLocation.id === selectedTrapLocationId
    )
    setTrapPermitInfo(currentTrapPermitInfo)

    setTrapLocationInfo(currentTrapLocationInfo)

    const currentProgramInfo = find(
      visitSetupDefaults.programs,
      (program: any) => program.id === selectedProgramId
    )
    setSelectedProgramObj(currentProgramInfo)

    if (currentProgramInfo?.programFormFields?.length) {
      const trapEquimentType =
        find(
          visitSetupDefaults?.trapLocations,
          (trapLocation: any) => trapLocation.id === selectedTrapLocationId
        )?.equipmentId || null

      // get fields for this section and equipment type, if applicable
      // null equipmentId indicates field displayed for all equipment types
      const sectionFields = currentProgramInfo?.programFormFields.filter(
        (field: any) =>
          field.formSection === activePage &&
          (field.equipmentId === null || field.equipmentId === trapEquimentType)
      )
      setFormFields(sectionFields)
      const dynamicTrapOpsSchema = generateDynamicTrapOpsSchema(sectionFields)
      setValidationSchema(dynamicTrapOpsSchema)
    } else {
      setFormFields(null)
      setValidationSchema(trapOperationsSchema)
    }
  }, [
    visitSetupDefaults.permitInfo,
    selectedTrapLocationId,
    visitSetupDefaults.programs,
    activePage,
    visitSetupDefaults?.trapLocations,
    selectedTrapLocationId,
  ])

  const useFlowMeasureCalculationBool = (flowMeasureEntered: number | null) => {
    return useMemo(() => {
      if (!flowMeasureEntered || !QARanges) {
        return false
      }
      let warningResult = false
      let activeTabName = selectedTrapName

      if (activeTabId) {
        activeTabName = tabSlice.tabs[activeTabId].name
      }
      let range

      if (trapPermitInfo && trapPermitInfo?.flowThreshold) {
        range = { max: Number(trapPermitInfo.flowThreshold), min: 50 }
      } else if (
        !QARanges.flowMeasure?.[selectedStream.trim()]?.[
          selectedTrapSite.trim()
        ]
      ) {
        range = { max: 15000, min: 50 }
      } else {
        range = activeTabName
          ? QARanges.flowMeasure?.[selectedStream.trim()]?.[
              selectedTrapSite.trim()
            ][activeTabName.trim()]
          : QARanges.flowMeasure?.[selectedStream.trim()]?.[
              selectedTrapSite.trim()
            ]
      }

      if (!range) {
        range = { max: 15000, min: 50 }
      }
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
      let maxTemp

      if (trapPermitInfo) {
        maxTemp =
          unit === '°F'
            ? Number(trapPermitInfo.temperatureThreshold) * 1.8 + 32
            : Number(trapPermitInfo.temperatureThreshold)
      } else {
        1
        maxTemp =
          unit === '°F'
            ? QARanges.waterTemperature.maxF
            : QARanges.waterTemperature.maxC
      }

      if (waterTemperatureValue > maxTemp) {
        warningResult = true
      }

      return warningResult
    }, [waterTemperatureValue, unit])
  }

  const checkForErrors = (values: any) => {
    try {
      validationSchema.validateSync(values, {
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
            trapVisitStopTime: endTime, //refactor needed
            trapVisitStartTime: new Date(),
          },
          errors,
        })
      )
      dispatch(markTrapOperationsCompleted({ tabId, value: true }))
      let stepCompletedCheck = true
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

      if (values.gearStatus === 'S') {
        dispatch(markStepCompleted({ propName: 'fishProcessing' }))
        dispatch(markStepCompleted({ propName: 'fishInput' }))
      }
      showSlideAlert(dispatch)
      console.log('🚀 ~ handleSubmit ~ Status', values)
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

  const onEndTimeChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setEndTime(currentDate)
  }

  useEffect(() => {
    if (activeTabId) {
      if (
        reduxState[activeTabId]?.values?.trapVisitStopTime &&
        reduxState[activeTabId]?.values?.trapVisitStopTime !== 'Invalid Date'
      ) {
        setEndTime(
          reduxState[activeTabId]?.values?.trapVisitStopTime || new Date()
        )
      }
    }
  }, [activeTabId, reduxState])

  const handleNavButtonClick = (
    direction: 'left' | 'right',
    values: any,
    warningResultFlow: boolean,
    warningResultTemp: boolean
  ) => {
    if (activeTabId && activeTabId != 'placeholderId') {
      const destination =
        direction === 'left'
          ? navigateFlowLeftButton('Trap Operations', false, navigation)
          : navigateFlowRightButton({
              values,
              activePage: 'Trap Operations',
              holdingForMarkRecap: false,
              navigation,
              warnings: {
                warningResultFlow,
                warningResultTemp,
              },
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
      }, 1000)
    }
  }

  const renderTrappingDateAndTime = (values: any, setFieldValue: any) => {
    // no program form fields have been set
    // assume has not been customized
    if (
      !selectedProgramObj?.programFormFields?.length ||
      find(formFields, {
        fieldName: 'trapVisitStopTime',
      })
    ) {
      return (
        <TrapEndDateAndTime
          endTime={endTime}
          onEndTimeChange={onEndTimeChange}
          popoverTrigger={popoverTrigger}
        />
      )
    } else if (
      formFields?.length &&
      find(formFields, {
        fieldName: 'trapVisitTime',
      })
    ) {
      const item = find(selectedProgramObj?.programFormFields, {
        fieldName: 'trapVisitTime',
      })
      const { displayName } = item
      if (!values.trapVisitTime) {
        setFieldValue('trapVisitTime', new Date())
      }
      return (
        <FormControl marginBottom={4}>
          <VStack space={2}>
            <HStack space={4}>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  {displayName}{' '}
                </Text>
              </FormControl.Label>
            </HStack>
            <Box alignSelf='flex-start' ml='-2'>
              <DateTimePicker
                value={values?.trapVisitTime || new Date()}
                mode='datetime'
                onChange={(event: any, selectedDate: any) => {
                  setFieldValue('trapVisitTime', selectedDate || new Date())
                }}
                accentColor='#007C7C'
              />
            </Box>
          </VStack>
        </FormControl>
      )
    } else {
      setEndTime(null)
    }
  }

  const renderRPMBefore = ({
    touched,
    errors,
    values,
    setFieldValue,
    handleBlur,
    handleChange,
  }: {
    touched: any
    errors: any
    values: any
    setFieldValue: any
    handleBlur: any
    handleChange: any
  }) => {
    // no program form fields have been set
    // assume has not been customized
    if (!selectedProgramObj?.programFormFields?.length) {
      return (
        <RPMBefore
          touched={touched}
          errors={errors}
          values={values}
          setFieldValue={setFieldValue}
          handleBlur={handleBlur}
          handleChange={handleChange}
          validationSchema={validationSchema}
        />
      )
    }
  }

  return (
    <Formik
      validationSchema={validationSchema}
      enableReinitialize={true}
      validateOnMount={false}
      isInitialValid={true}
      // validateOnChange={false}
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
      initialTouched={
        activeTabId && reduxState[activeTabId]?.errors
          ? reduxState[activeTabId].errors
          : {}
      }
      // only create initial error when form is not completed
      onSubmit={() => {}}
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
        isValid,
      }) => {
        console.log('errors', errors)
        console.log('values', values)
        const warningResultFlow = useFlowMeasureCalculationBool(
          values.flowMeasure
        )
        const warningResultTemp = useWaterTempCalculationBool(
          Number(values.waterTemperature),
          values.waterTemperatureUnit
        )

        const checkOtherTabForms = () => {
          const tabIds = Object.keys(tabSlice.tabs)

          const trapOperationsOtherTabsValidity = tabIds.map(tabId => {
            if (tabId !== activeTabId) {
              const tabFormValues = reduxState[tabId]?.values
              const formIsValid = validationSchema.isValidSync(tabFormValues)
              return formIsValid
            }

            return
          })

          const tabIncomplete = trapOperationsOtherTabsValidity.some(
            result => result === false
          )

          if (tabIncomplete) return false

          return true
        }

        const handleValuesCopy = () => {
          const tabIds = Object.keys(tabSlice.tabs)

          tabIds.map(tabId => {
            const tabIdValues = reduxState[tabId]?.values

            if (tabId === activeTabId) {
              dispatch(
                saveTrapOperations({
                  tabId,
                  values: {
                    ...values,
                    trapVisitStopTime: endTime, //refactor needed
                    trapVisitStartTime: new Date(),
                  },
                  errors,
                })
              )
            } else {
              dispatch(
                saveTrapOperations({
                  tabId,
                  values: {
                    ...tabIdValues,
                    coneSetting: tabIdValues.coneSetting,
                    reasonNotFunc: tabIdValues.reasonNotFunc,
                    recordTurbidityInPostProcessing:
                      tabIdValues.recordTurbidityInPostProcessing,
                    rpm1: tabIdValues.rpm1,
                    rpm2: tabIdValues.rpm2,
                    rpm3: tabIdValues.rpm3,
                    trapStatus: tabIdValues.trapStatus,
                    trapVisitStartTime: tabIdValues.trapVisitStartTime,
                    flowMeasure: values.flowMeasure,
                    flowMeasureUnit: values.flowMeasureUnit,
                    waterTurbidity: values.waterTurbidity,
                    waterTurbidityUnit: values.waterTurbidityUnit,
                    waterTemperature: values.waterTemperature,
                    waterTemperatureUnit: values.waterTemperatureUnit,
                    trapVisitStopTime:
                      tabId === activeTabId
                        ? endTime
                        : tabIdValues.trapVisitStopTime,
                  },
                  errors,
                })
              )
            }
          })
        }
        const otherTabFormsValid = checkOtherTabForms()

        const navButtons = useMemo(() => {
          return (
            <NavButtons
              navigation={navigation}
              handleSubmit={(buttonDirection: 'left' | 'right') => {
                handleNavButtonClick(
                  buttonDirection,
                  values,
                  warningResultFlow,
                  warningResultTemp
                )
                dispatch(setActiveTab(activeTabId))
              }}
              errors={errors}
              touched={touched}
              values={values}
              shouldProceedToLoadingScreen={true}
              isValid={isValid && otherTabFormsValid}
            />
          )
        }, [
          navigation,
          handleSubmit,
          errors,
          touched,
          values,
          isValid,
          endTime,
        ])

        useEffect(() => {
          if (previouslyActiveTabId && navigationSlice.activeStep === 2) {
            onSubmit(values, previouslyActiveTabId)
            resetForm()
          }
        }, [previouslyActiveTabId, activeTabId])

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
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps='handled'
            >
              <Pressable onPress={Keyboard.dismiss}>
                <VStack space={4}>
                  <Heading>Trap Operations</Heading>
                  {renderTrappingDateAndTime(values, setFieldValue)}
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
                      label='Trap Status'
                      placeholder='Select Trap Status'
                      camelName='trapStatus'
                      onValueChange={handleChange('trapStatus')}
                      touched={touched}
                      errors={errors}
                      setFieldTouched={() => setFieldTouched('trapStatus')}
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
                    <CustomSelect
                      selectedValue={values.reasonNotFunc}
                      placeholder='Select Reason for Trap Malfunction'
                      camelName='reasonNotFunc'
                      label='Select Reason for Trap Malfunction'
                      errors={errors}
                      touched={touched}
                      onValueChange={handleChange('reasonNotFunc')}
                      setFieldTouched={() => setFieldTouched('reasonNotFunc')}
                      selectOptions={whyTrapNotFunctioning}
                    />
                  )}
                  {values.trapStatus.length > 0 && (
                    <>
                      {renderRPMBefore({
                        touched: touched,
                        errors: errors,
                        values: values,
                        setFieldValue: setFieldValue,
                        handleBlur: handleBlur,
                        handleChange: handleChange,
                      })}
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

                      <HStack space={8} flexWrap={'wrap'}>
                        <Box
                          flexBasis='30%' // Ensures 3 items per row (adjust for spacing)
                          minWidth='30%' // Prevents shrinking too much
                          maxWidth='30%' // Prevents growing beyond this size
                        >
                          <FormInputComponent
                            showWarning={warningResultFlow}
                            label={'Flow Measure'}
                            placeholder='0'
                            touched={touched}
                            errors={errors}
                            value={values.flowMeasure || null}
                            camelName={'flowMeasure'}
                            onChangeText={handleChange('flowMeasure')}
                            onBlur={handleBlur('flowMeasure')}
                            RightElement={<TextInputAdornment text='cfs' />}
                            validationSchema={validationSchema}
                            keyboardType={'number-pad'}
                            inputRefs={inputRefs}
                          />
                        </Box>
                        <Box
                          flexBasis='30%' // Ensures 3 items per row (adjust for spacing)
                          minWidth='30%' // Prevents shrinking too much
                          maxWidth='30%' // Prevents growing beyond this size
                        >
                          <FormInputComponent
                            showWarning={warningResultTemp}
                            label={'Water Temperature'}
                            placeholder='0'
                            touched={touched}
                            errors={errors}
                            value={values.waterTemperature || null}
                            camelName={'waterTemperature'}
                            onChangeText={handleChange('waterTemperature')}
                            onBlur={handleBlur('waterTemperature')}
                            validationSchema={validationSchema}
                            keyboardType={'number-pad'}
                            inputRefs={inputRefs}
                            RightElement={
                              <Button
                                bg='warmGray.200'
                                h={'full'}
                                w={50}
                                onPress={() => {
                                  if (values.waterTemperatureUnit === '°C') {
                                    setFieldValue('waterTemperatureUnit', '°F')
                                  } else {
                                    setFieldValue('waterTemperatureUnit', '°C')
                                  }
                                }}
                              >
                                <Text>{values.waterTemperatureUnit}</Text>
                              </Button>
                            }
                          />
                        </Box>
                        {(!selectedProgramObj?.programFormFields?.length ||
                          find(selectedProgramObj?.programFormFields, {
                            fieldName: 'waterTurbidity',
                          })) && (
                          <Box
                            flexBasis='40%' // Ensures 3 items per row (adjust for spacing)
                            minWidth='40%' // Prevents shrinking too much
                            maxWidth='40%' // Prevents growing beyond this size
                          >
                            <FormInputComponent
                              label={'Water Turbidity (via CDEC)'}
                              placeholder='0'
                              touched={touched}
                              errors={errors}
                              value={values.waterTurbidity}
                              camelName={'waterTurbidity'}
                              onChangeText={handleChange('waterTurbidity')}
                              onBlur={handleBlur('waterTurbidity')}
                              RightElement={<TextInputAdornment text='ntu' />}
                              validationSchema={validationSchema}
                              keyboardType={'number-pad'}
                            />
                          </Box>
                        )}
                      </HStack>

                      <ConditionalTrapVisitFields
                        touched={touched}
                        errors={errors}
                        values={values}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setFieldTouched={setFieldTouched}
                        dropdownValues={dropdownValues}
                        activePage={activePage}
                        formFields={formFields}
                        setFieldValue={setFieldValue}
                        activeTabId={activeTabId}
                        validationSchema={validationSchema}
                        inputRefs={inputRefs}
                      />
                      {allTabIds.length > 1 && (
                        <CopyFormValuesDialog
                          valueType='environmental'
                          onSubmit={handleValuesCopy}
                        />
                      )}
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
