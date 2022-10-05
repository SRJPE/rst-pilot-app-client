import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { useSelector, useDispatch, connect } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { getTrapVisitDropdownValues } from '../../../redux/reducers/dropdownsSlice'
import {
  markTrapStatusCompleted,
  saveTrapStatus,
} from '../../../redux/reducers/trapStatusSlice'
import {
  Box,
  Select,
  FormControl,
  CheckIcon,
  Heading,
  Input,
  VStack,
  HStack,
  Button,
  Text,
  View,
} from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'
import { trapStatusSchema } from '../../../utils/helpers/yupValidations'

const reasonsForTrapNotFunctioning = [
  { label: 'High Rain', value: 'High Rain' },
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
  const dropdownValues = useSelector((state: any) => state.dropdowns)

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
  }, [])
  const { trapFunctionality } = dropdownValues.values

  const handleSubmit = (values: any) => {
    dispatch(saveTrapStatus(values))
    dispatch(markTrapStatusCompleted(true))
    console.log('🚀 ~ handleSubmit ~ Status', values)
  }

  return (
    <Formik
      validationSchema={trapStatusSchema}
      initialValues={reduxState.values}
      onSubmit={(values: any) => {
        handleSubmit(values)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        validateForm,
        touched,
        errors,
        values,
      }) => (
        <>
          <Box h='90%' bg='#fff' p='10%'>
            <VStack space={8}>
              <Heading>Is the Trap functioning normally?</Heading>
              <FormControl>
                <FormControl.Label>Trap Status</FormControl.Label>
                <Select
                  selectedValue={values.trapStatus}
                  accessibilityLabel='Trap Status'
                  placeholder='Trap Status'
                  _selectedItem={{
                    bg: 'secondary',
                    endIcon: <CheckIcon size='5' />,
                  }}
                  mt={1}
                  onValueChange={handleChange('trapStatus')}
                >
                  {trapFunctionality.map((item: any) => (
                    <Select.Item
                      key={item.id}
                      label={item.definition}
                      value={item.definition}
                    />
                  ))}
                </Select>
                {touched.trapStatus && errors.trapStatus && (
                  <Text style={{ fontSize: 12, color: 'red' }}>
                    {errors.trapStatus as string}
                  </Text>
                )}
              </FormControl>
              {values.trapStatus === 'Trap functioning, but not normally' && (
                <FormControl>
                  <FormControl.Label>
                    Reason For Trap Not Functioning
                  </FormControl.Label>
                  <Select
                    selectedValue={values.reasonNotFunc}
                    accessibilityLabel='Reason Not Functioning.'
                    placeholder='Reason'
                    _selectedItem={{
                      bg: 'secondary',
                      endIcon: <CheckIcon size='5' />,
                    }}
                    mt={1}
                    onValueChange={itemValue => handleChange('reasonNotFunc')}
                  >
                    {reasonsForTrapNotFunctioning.map((item, idx) => (
                      <Select.Item
                        key={idx}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Select>
                  {touched.reasonNotFunc && errors.reasonNotFunc && (
                    <Text style={{ fontSize: 12, color: 'red' }}>
                      {errors.reasonNotFunc as string}
                    </Text>
                  )}
                </FormControl>
              )}
              {values.trapStatus.length > 0 && (
                <>
                  <Heading fontSize='lg'>Environmental Conditions</Heading>
                  <HStack space={5} width='125%'>
                    <FormControl w='1/4'>
                      <FormControl.Label>Flow Measure</FormControl.Label>
                      <Input
                        placeholder='Populated from CDEC'
                        keyboardType='numeric'
                        onChangeText={handleChange('flowMeasure')}
                        onBlur={handleBlur('flowMeasure')}
                        value={values.flowMeasure}
                      />
                      {touched.flowMeasure && errors.flowMeasure && (
                        <Text style={{ fontSize: 12, color: 'red' }}>
                          {errors.flowMeasure as string}
                        </Text>
                      )}
                    </FormControl>
                    <FormControl w='1/4'>
                      <FormControl.Label>Water Temperature</FormControl.Label>
                      <Input
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={handleChange('waterTemperature')}
                        onBlur={handleBlur('waterTemperature')}
                        value={values.waterTemperature}
                      />
                      {touched.waterTemperature && errors.waterTemperature && (
                        <Text style={{ fontSize: 12, color: 'red' }}>
                          {errors.waterTemperature as string}
                        </Text>
                      )}
                    </FormControl>
                    <FormControl w='1/4'>
                      <FormControl.Label>Water Turbidity</FormControl.Label>
                      <Input
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={handleChange('waterTurbidity')}
                        onBlur={handleBlur('waterTurbidity')}
                        value={values.waterTurbidity}
                      />
                      {touched.waterTurbidity && errors.waterTurbidity && (
                        <Text style={{ fontSize: 12, color: 'red' }}>
                          {errors.waterTurbidity as string}
                        </Text>
                      )}
                    </FormControl>
                  </HStack>
                </>
              )}
            </VStack>
          </Box>
          <NavButtons
            navigation={navigation}
            handleSubmit={handleSubmit}
            errors={errors}
            touched={touched}
            values={values}
            // validation={validateForm(values)}
          />
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(TrapStatus)
