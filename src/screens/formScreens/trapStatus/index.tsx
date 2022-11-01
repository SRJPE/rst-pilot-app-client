import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { useSelector, useDispatch, connect } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  FormControl,
  Heading,
  Input,
  VStack,
  HStack,
  Text,
  View,
  IconButton,
  Icon,
  Popover,
} from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'
import { trapStatusSchema } from '../../../utils/helpers/yupValidations'
import renderErrorMessage from '../../../components/form/RenderErrorMessage'
import { markStepCompleted } from '../../../redux/reducers/formSlices/navigationSlice'
import CustomSelect from '../../../components/Shared/CustomSelect'
import {
  markTrapStatusCompleted,
  saveTrapStatus,
} from '../../../redux/reducers/formSlices/trapStatusSlice'
import { MaterialIcons } from '@expo/vector-icons'

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

  const handleSubmit = (values: any, errors: any) => {
    dispatch(saveTrapStatus(values))
    dispatch(markTrapStatusCompleted(true))
    dispatch(markStepCompleted(true))
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
          <View
            flex={1}
            bg='#fff'
            p='6%'
            borderColor='themeGrey'
            borderWidth='15'
          >
            <VStack space={12}>
              <HStack space={2} alignItems='center'>
                <Heading>Is the Trap functioning normally?</Heading>
                <Popover
                  trigger={triggerProps => {
                    return (
                      <IconButton
                        {...triggerProps}
                        icon={
                          <Icon
                            as={MaterialIcons}
                            name='info-outline'
                            size='xl'
                          />
                        }
                      ></IconButton>
                    )
                  }}
                >
                  <Popover.Content accessibilityLabel='Trap Stats Info' w='56'>
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Header>Trap Status</Popover.Header>
                    <Popover.Body>
                      <Text>{`Please select one of the trap functioning dropdowns based on a visual inspection of the trap. 
Trap Functioning Normally: Trap rotating normally in the expected location in river
Trap Not Functioning: Trap not rotating or displaced in the river. 
Trap Functioning but not normally: The trap appears to be rotating but not consistently. There may be high flows or high debris levels that are affecting the trap. 
Trap Not in Service: Trap not set up for fishing upon arrival. 


`}</Text>
                    </Popover.Body>
                  </Popover.Content>
                </Popover>
              </HStack>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Trap Status
                  </Text>
                </FormControl.Label>
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
                  renderErrorMessage(errors, 'trapStatus')}
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
                    renderErrorMessage(errors, 'reasonNotFunc')}
                </FormControl>
              )}
              {values.trapStatus.length > 0 && (
                <>
                  <Heading fontSize='2xl'>Environmental Conditions:</Heading>
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
                      {/* {touched.flowMeasure &&
                        errors.flowMeasure &&
                        renderErrorMessage(errors, 'flowMeasure')} */}
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
                      {touched.waterTemperature &&
                        errors.waterTemperature &&
                        renderErrorMessage(errors, 'waterTemperature')}
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
                      {touched.waterTurbidity &&
                        errors.waterTurbidity &&
                        renderErrorMessage(errors, 'waterTurbidity')}
                    </FormControl>
                  </HStack>
                </>
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
export default connect(mapStateToProps)(TrapStatus)
