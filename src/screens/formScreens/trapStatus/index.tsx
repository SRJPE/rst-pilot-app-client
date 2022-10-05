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
  const [trapStatus, setTrapStatus] = useState(
    reduxState.values.trapStatus as string
  )
  const [reasonNotFunc, setReasonNotFunc] = useState(
    reduxState.values.reasonNotFunc as string
  )

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
  }, [])
  const { trapFunctionality } = dropdownValues.values

  const navigateFlow = (values: any) => {
    if (values.trapStatus === 'Trap stopped functioning') {
      navigation.navigate('Trap Visit Form', {
        screen: 'Non Functional Trap',
      })
    } else if (values.flowMeasure > 1000) {
      navigation.navigate('Trap Visit Form', { screen: 'High Flows' })
    } else if (values.waterTemperature > 30) {
      navigation.navigate('Trap Visit Form', { screen: 'High Temperatures' })
    }
  }

  const handleSubmit = (values: any) => {
    values.trapStatus = trapStatus
    values.reasonNotFunc = reasonNotFunc
    dispatch(saveTrapStatus(values))
    dispatch(markTrapStatusCompleted(true))
    console.log('🚀 ~ TrapStatus ~ values', values)
    navigateFlow(values)
  }

  return (
    <Formik
      // validationSchema={{ test: '' }}
      initialValues={reduxState.values}
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
                  selectedValue={trapStatus}
                  accessibilityLabel='Trap Status'
                  placeholder='Trap Status'
                  _selectedItem={{
                    bg: 'secondary',
                    endIcon: <CheckIcon size='5' />,
                  }}
                  mt={1}
                  onValueChange={itemValue => setTrapStatus(itemValue)}
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
              {trapStatus === 'Trap functioning, but not normally' && (
                <FormControl>
                  <FormControl.Label>
                    Reason For Trap Not Functioning
                  </FormControl.Label>
                  <Select
                    selectedValue={reasonNotFunc}
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
              {trapStatus.length > 0 && (
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

export default connect(mapStateToProps)(TrapStatus)
