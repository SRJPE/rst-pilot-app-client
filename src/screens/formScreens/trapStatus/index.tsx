import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
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
import { trapStatusSchema } from '../../../utils/helpers/yupValidations'
import { TrapStatusInitialValues } from '../../../utils/interfaces'
import { Button as RNButton } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import {
  getTrapVisitDropdownValues,
  clearValuesFromDropdown,
} from '../../../redux/reducers/dropdownsSlice'

import NavButtons from '../../../components/formContainer/NavButtons'
import {
  markTrapStatusCompleted,
  saveTrapStatus,
} from '../../../redux/reducers/trapStatusSlice'

export default function TrapStatus({
  route,
  navigation,
}: {
  route: any
  navigation: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const reduxState = useSelector((state: any) => state.values?.trapStatus)
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const [initialFormValues, setInitialFormValues] = useState({} as any)
  const [status, setStatus] = useState('' as string)
  const [reasonNotFunc, setReasonNotFunc] = useState('' as string)

  useEffect(() => {
    if (reduxState) setInitialFormValues(reduxState)
  }, [])
  useEffect(() => {
    console.log('🚀 ~ useEffect ~ initialFormValues Status', initialFormValues)
  }, [initialFormValues])

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
  }, [])
  const { trapFunctionality } = dropdownValues.values

  const handleSubmit = (values: any) => {
    values.trapStatus = status
    values.reasonNotFunc = reasonNotFunc
    dispatch(saveTrapStatus(values))
    dispatch(markTrapStatusCompleted(true))
    console.log('🚀 ~ TrapStatus ~ values', values)
  }

  return (
    <Formik
      // validationSchema={{ test: '' }}
      initialValues={initialFormValues}
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <>
          <Box h='90%' bg='#fff' p='10%'>
            <VStack space={8}>
              <Heading>Is the Trap functioning normally?</Heading>
              <FormControl>
                <FormControl.Label>Trap Status</FormControl.Label>
                <Select
                  selectedValue={reduxState?.status}
                  accessibilityLabel='Status'
                  placeholder='Status'
                  _selectedItem={{
                    bg: 'secondary',
                    endIcon: <CheckIcon size='5' />,
                  }}
                  mt={1}
                  onValueChange={itemValue => setStatus(itemValue)}
                >
                  {trapFunctionality.map((item: any) => (
                    <Select.Item
                      key={item.id}
                      label={item.definition}
                      value={item.definition}
                    />
                  ))}
                </Select>
              </FormControl>
              {status === 'Trap functioning, but not normally' && (
                <FormControl>
                  <FormControl.Label>
                    Reason For Trap Not Functioning
                  </FormControl.Label>
                  <Select
                    selectedValue={reduxState?.reasonNotFunc}
                    accessibilityLabel='Reason Not Functioning.'
                    placeholder='Reason'
                    _selectedItem={{
                      bg: 'secondary',
                      endIcon: <CheckIcon size='5' />,
                    }}
                    mt={1}
                    onValueChange={itemValue => setReasonNotFunc(itemValue)}
                  >
                    {reasonsForTrapNotFunctioning.map((item, idx) => (
                      <Select.Item
                        key={idx}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Select>
                </FormControl>
              )}
              {status?.length > 0 && (
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
                    </FormControl>
                  </HStack>
                </>
              )}
            </VStack>
          </Box>
          <NavButtons navigation={navigation} handleSubmit={handleSubmit} />
        </>
      )}
    </Formik>
  )
}

const reasonsForTrapNotFunctioning = [
  { label: 'High Rain', value: 'High Rain' },
  { label: 'Broken Trap', value: 'Broken Trap' },
  { label: 'Debris in Trap', value: 'Debris in Trap' },
]

// const {
//   step,
//   activeFormState,
//   passToActiveFormState,
//   resetActiveFormState,
//   reduxFormState,
// } = route.params

/* 
      <RNButton
        title='Log dropdown values from redux'
        onPress={() => console.log(dropdownValues)}
      />
      <RNButton
        title='Log all of  redux state'
        onPress={() => console.log('redux state: ', reduxState)}
      />
      <RNButton
        title='Empty "markType" from redux state'
        onPress={() => dispatch(clearValuesFromDropdown('markType'))}
      /> */

// console.log('🚀 ~ activeFormState trap status', activeFormState)
// console.log('🚀 ~ route PARAMS Trap Status', route.params)

// useEffect(() => {
// passToActiveFormState(navigation, step, initialFormState, step)
// if (Object.keys(activeFormState).length > 1) {
//   navigation.setParams({
//     activeFormState: previousFormState,
//   })
// }
// if (Object.keys(activeFormState).length > 1) {
//   passToActiveFormState(navigation, step, previousFormState)
// } else {
//   passToActiveFormState(navigation, step, initialFormValues)
// }
//   passToActiveFormState(navigation, step, activeFormState)
// }, [])
