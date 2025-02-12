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
  Button,
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
import {
  QARanges,
  navigateHelper,
  navigateFlowRightButton,
  navigateFlowLeftButton,
} from '../../utils/utils'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'
import OptimizedInput from '../../components/Shared/OptimizedInput'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import DateTimePicker from '@react-native-community/datetimepicker'
import { StackActions } from '@react-navigation/native'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { find } from 'lodash'
import FormInputComponent, {
  TextInputAdornment,
} from '../../components/Shared/FormInputComponent'
import * as Yup from 'yup'
import { getAllTabProcessingResults } from '../../redux/reducers/formSlices/fishProcessingSlice'

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
  const [waterTempUnitC, setWaterTempUnitC] = useState<boolean>(true)
  const [trapLocationInfo, setTrapLocationInfo] = useState<any>(null)

  const convertCtoF = (celsius: number) => (celsius * 9) / 5 + 32
  const permitFlowThreshold = trapPermitInfo?.flowThreshold || 2000
  const permitTempThreshold = waterTempUnitC
    ? trapPermitInfo?.temperatureThreshold
    : convertCtoF(trapPermitInfo?.temperatureThreshold)

  useEffect(() => {
    // flow threshold on trap location
    // TO DO: temp threshold WILL permit info (Needs to be refactored in db and monitoring program setup)
    const currentTrapPermitInfo = find(
      visitSetupDefaults.permitInfo,
      (permit: any) => permit.programId === selectedProgramId
    )

    const currentTrapLocationInfo = find(
      visitSetupDefaults.trapLocations,
      (permit: any) => permit.id === selectedTrapLocationId
    )
    setTrapPermitInfo(currentTrapPermitInfo)

    setTrapLocationInfo(currentTrapLocationInfo)
  }, [visitSetupDefaults.permitInfo, selectedTrapLocationId])

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

      if (trapPermitInfo) {
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
            trapVisitStopTime: endTime, //refactor needed
            trapVisitStartTime: new Date(),
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
      showSlideAlert(dispatch)
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
              setWaterTempUnitC(true)
              setFieldValue('waterTemperatureUnit', '°F')
            } else {
              setWaterTempUnitC(false)
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
        setEndTime(reduxState[activeTabId]?.values?.trapVisitStopTime)
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
              const formIsValid =
                trapOperationsSchema.isValidSync(tabFormValues)
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
            >
              <Pressable onPress={Keyboard.dismiss}>
                <VStack space={4}>
                  <Heading>Trap Operations</Heading>
                  <FormControl>
                    <VStack space={2}>
                      <HStack space={2}>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Trapping End Date and Time:
                          </Text>
                          <Popover
                            placement='bottom left'
                            trigger={popoverTrigger}
                          >
                            <Popover.Content
                              accessibilityLabel='Trap Visit End Info'
                              w='600'
                              mr='10'
                            >
                              <Popover.Arrow />
                              <Popover.CloseButton />
                              <Popover.Header>
                                Please set the Date and Time of when you removed
                                the trap to collect data and ended the current
                                trapping period.
                              </Popover.Header>
                              <Popover.Body p={4}>
                                <VStack space={2}>
                                  <HStack space={2} alignItems='flex-start'>
                                    <Text fontSize='md'>
                                      This value is used to record the date and
                                      time of ending the current trapping period
                                      and removing the trap from the water to
                                      collect data.
                                    </Text>
                                  </HStack>
                                  <HStack space={2} alignItems='flex-start'>
                                    <Text fontSize='md'>
                                      At the end of this form during the Post
                                      Processing step, if you continue trapping,
                                      you will set the "Trapping Start Date and
                                      Time" to record the time of starting the
                                      trap again.
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
                          value={endTime}
                          mode='datetime'
                          onChange={onEndTimeChange}
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
                                Take up to three measurements of cone rotations.
                                The averages of the entered values will be saved
                                to the database.
                              </Popover.Header>
                            </Popover.Content>
                          </Popover>
                        </HStack>
                        <HStack space={8} justifyContent='space-between'>
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
                              isDisabled={
                                values.rpm1 && values.rpm2 ? false : true
                              }
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

                      <HStack space={5}>
                        <Box flex={1}>
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
                          />
                        </Box>
                        <Box flex={1}>
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

                        <Box flex={1}>
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
                          />
                        </Box>
                        {/* <FormControl w='1/4'>
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
                        </FormControl> */}
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
