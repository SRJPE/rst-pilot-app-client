import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import { useSelector, useDispatch, connect } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { getTrapVisitDropdownValues } from '../../../redux/reducers/dropdownsSlice'

import {
  Select,
  FormControl,
  CheckIcon,
  Heading,
  Input,
  VStack,
  HStack,
  Text,
  View,
} from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'
import { trapStatusSchema } from '../../../utils/helpers/yupValidations'
import renderErrorMessage from '../../../components/form/RenderErrorMessage'
import { markStepCompleted } from '../../../redux/reducers/navigationSlice'
import CustomSelect from '../../../components/Shared/CustomSelect'
import {
  markTrapStatusCompleted,
  saveTrapStatus,
} from '../../../redux/reducers/formSlices/trapStatusSlice'

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
  const handleSubmit = (values: any, errors: any) => {
    console.log('🚀 ~ handleSubmit ~ errors', errors.trapStatus)
    dispatch(saveTrapStatus(values))
    dispatch(markTrapStatusCompleted(true))
    dispatch(markStepCompleted(true))
    console.log('🚀 ~ handleSubmit ~ Status', values)
  }
  return (
    <Formik
      validationSchema={trapStatusSchema}
      initialValues={reduxState.values}
      initialTouched={{ trapStatus: true }}
      // //only create initial error when form is not completed
      // initialErrors={reduxState.completed ? undefined : { trapStatus: '' }}
      onSubmit={(values: any, errors: any) => {
        handleSubmit(values, errors)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
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
              <Heading>Is the Trap functioning normally?</Heading>
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
                  selectOptions={trapFunctionality}
                />
                {touched.trapStatus &&
                  errors.trapStatus &&
                  renderErrorMessage(errors, 'trapStatus')}
              </FormControl>
              {values.trapStatus === 'Trap functioning, but not normally' && (
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
                      {touched.flowMeasure &&
                        errors.flowMeasure &&
                        renderErrorMessage(errors, 'flowMeasure')}
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
