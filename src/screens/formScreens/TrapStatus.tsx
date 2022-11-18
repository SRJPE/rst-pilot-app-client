import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
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
} from 'native-base'
import NavButtons from '../../components/formContainer/NavButtons'
import { trapStatusSchema } from '../../utils/helpers/yupValidations'
import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import { markStepCompleted } from '../../redux/reducers/formSlices/navigationSlice'
import CustomSelect from '../../components/Shared/CustomSelect'
import {
  markTrapStatusCompleted,
  saveTrapStatus,
} from '../../redux/reducers/formSlices/trapStatusSlice'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Keyboard } from 'react-native'
import { QARanges } from '../../utils/utils'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'

const reasonsForTrapNotFunctioning = [
  { label: 'High Flows', value: 'High Flows' },
  { label: 'Broken Trap', value: 'Broken Trap' },
  { label: 'Debris in Trap', value: 'Debris in Trap' },
]
const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.trapStatus,
  }
}
const TrapStatus = ({
  navigation,
  reduxState,
}: {
  navigation: any
  reduxState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const calculateTempWarning = (
    waterTemperatureValue: number,
    unit: string
  ) => {
    if (unit === '°F') {
      return (
        waterTemperatureValue > QARanges.waterTemperature.maxF &&
        RenderWarningMessage()
      )
    } else {
      return (
        waterTemperatureValue > QARanges.waterTemperature.maxC &&
        RenderWarningMessage()
      )
    }
  }

  const handleSubmit = (values: any, errors: any) => {
    dispatch(saveTrapStatus(values))
    dispatch(markTrapStatusCompleted(true))
    dispatch(markStepCompleted([true]))
    console.log('🚀 ~ handleSubmit ~ Status', values)
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
            if (text === '°F') {
              setFieldValue('waterTemperatureUnit', '°C')
            } else {
              setFieldValue('waterTemperatureUnit', '°F')
            }
          }
        }}
      >
        {text}
      </Text>
    )
  }

  return (
    <Formik
      validationSchema={trapStatusSchema}
      initialValues={reduxState.values}
      initialTouched={{ trapStatus: true }}
      // only create initial error when form is not completed
      initialErrors={reduxState.completed ? undefined : { trapStatus: '' }}
      onSubmit={(values: any, errors: any) => {
        handleSubmit(values, errors)
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
      }) => (
        <>
          <ScrollView
            bg='#fff'
            p='6%'
            borderColor='themeGrey'
            borderWidth='15'
            borderBottomWidth='0'
            mb='15'
          >
            <Pressable onPress={Keyboard.dismiss}>
              <VStack space={5}>
                <Heading>Trap Operations</Heading>

                <FormControl>
                  <HStack space={2} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Is the Trap functioning normally?
                      </Text>
                    </FormControl.Label>
                    <Popover
                      placement='bottom left'
                      trigger={(triggerProps) => {
                        return (
                          <IconButton
                            {...triggerProps}
                            icon={
                              <Icon
                                as={MaterialIcons}
                                name='info-outline'
                                size='lg'
                              />
                            }
                          ></IconButton>
                        )
                      }}
                    >
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
                                Trap Not in Service: Trap not set up for fishing
                                upon arrival.
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
                      (item: any) => ({
                        label: item.definition,
                        value: item.definition,
                      })
                    )}
                  />
                  {touched.trapStatus &&
                    errors.trapStatus &&
                    RenderErrorMessage(errors, 'trapStatus')}
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
                      placeholder='Trap Status'
                      onValueChange={handleChange('reasonNotFunc')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={reasonsForTrapNotFunctioning}
                    />

                    {touched.reasonNotFunc &&
                      errors.reasonNotFunc &&
                      RenderErrorMessage(errors, 'reasonNotFunc')}
                  </FormControl>
                )}
                {values.trapStatus.length > 0 && (
                  <>
                    <HStack space={10}>
                      <FormControl w='47%'>
                        <HStack space={4} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Cone Depth
                            </Text>
                          </FormControl.Label>
                          {Number(values.coneDepth) > QARanges.coneDepth.max &&
                            RenderWarningMessage()}
                          {touched.coneDepth &&
                            errors.coneDepth &&
                            RenderErrorMessage(errors, 'coneDepth')}
                        </HStack>
                        <Input
                          height='50px'
                          fontSize='16'
                          placeholder='Numeric Value'
                          keyboardType='numeric'
                          onChangeText={handleChange('coneDepth')}
                          onBlur={handleBlur('coneDepth')}
                          value={values.coneDepth}
                        />
                        <Text
                          color='#A1A1A1'
                          position='absolute'
                          top={50}
                          right={4}
                          fontSize={16}
                        >
                          {'in'}
                        </Text>
                      </FormControl>

                      <FormControl w='47%'>
                        <HStack space={4} alignItems='center'>
                          <FormControl.Label>
                            <Text color='black' fontSize='xl'>
                              Total Revolutions
                            </Text>
                          </FormControl.Label>
                          {Number(values.totalRevolutions) >
                            QARanges.totalRevolutions.max &&
                            RenderWarningMessage()}
                          {touched.totalRevolutions &&
                            errors.totalRevolutions &&
                            RenderErrorMessage(errors, 'totalRevolutions')}
                        </HStack>
                        <Input
                          height='50px'
                          fontSize='16'
                          placeholder='Numeric Value'
                          keyboardType='numeric'
                          onChangeText={handleChange('totalRevolutions')}
                          onBlur={handleBlur('totalRevolutions')}
                          value={values.totalRevolutions}
                        />
                      </FormControl>
                    </HStack>
                    <FormControl w='30%'>
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
                      </Radio.Group>
                    </FormControl>

                    <FormControl>
                      <HStack space={4} alignItems='center'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            RPM Before Cleaning
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
                            <Text style={{ fontSize: 14, color: '#b71c1c' }}>
                              All Three measurements are required
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
                              RenderWarningMessage()
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
                              placeholder='Numeric Value'
                              keyboardType='numeric'
                              onChangeText={handleChange('rpm2')}
                              onBlur={handleBlur('rpm2')}
                              value={values.rpm2}
                            />
                            {Number(values.rpm2) > QARanges.RPM.max ? (
                              RenderWarningMessage()
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
                              placeholder='Numeric Value'
                              keyboardType='numeric'
                              onChangeText={handleChange('rpm3')}
                              onBlur={handleBlur('rpm3')}
                              value={values.rpm3}
                            />
                            {Number(values.rpm3) > QARanges.RPM.max ? (
                              RenderWarningMessage()
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
                    <Heading>Environmental Conditions</Heading>
                    <HStack space={5} width='125%'>
                      <FormControl w='1/4'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Flow Measure
                          </Text>
                        </FormControl.Label>
                        <Input
                          height='50px'
                          fontSize='16'
                          placeholder='Populated from CDEC'
                          keyboardType='numeric'
                          onChangeText={handleChange('flowMeasure')}
                          onBlur={handleBlur('flowMeasure')}
                          value={values.flowMeasure}
                        />
                        {inputUnit(values.flowMeasureUnit)}
                        {Number(values.flowMeasure) >
                          QARanges.flowMeasure.max && RenderWarningMessage()}
                        {touched.flowMeasure &&
                          errors.flowMeasure &&
                          RenderErrorMessage(errors, 'flowMeasure')}
                      </FormControl>
                      <FormControl w='1/4'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Water Temperature
                          </Text>
                        </FormControl.Label>
                        <Input
                          height='50px'
                          fontSize='16'
                          placeholder='Numeric Value'
                          keyboardType='numeric'
                          onChangeText={handleChange('waterTemperature')}
                          onBlur={handleBlur('waterTemperature')}
                          value={values.waterTemperature}
                        />
                        {inputUnit(values.waterTemperatureUnit, setFieldValue)}
                        {calculateTempWarning(
                          Number(values.waterTemperature),
                          values.waterTemperatureUnit
                        )}
                        {touched.waterTemperature &&
                          errors.waterTemperature &&
                          RenderErrorMessage(errors, 'waterTemperature')}
                      </FormControl>
                      <FormControl w='1/4'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Water Turbidity
                          </Text>
                        </FormControl.Label>

                        <Input
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
                          QARanges.waterTurbidity.max && RenderWarningMessage()}
                        {touched.waterTurbidity &&
                          errors.waterTurbidity &&
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
export default connect(mapStateToProps)(TrapStatus)
