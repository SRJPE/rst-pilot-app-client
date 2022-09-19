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
} from 'native-base'
import { trapStatusSchema } from '../../../services/utils/helpers/yupValidations'
import { TrapStatusInitialValues } from '../../../services/utils/interfaces'
import { Button as RNButton } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import {
  getTrapVisitDropdownValues,
  clearValuesFromDropdown,
} from '../../../redux/reducers/dropdownsSlice'

const reasonsForTrapNotFunctioning = [
  { label: 'High Rain', value: 'High Rain' },
  { label: 'Broken Trap', value: 'Broken Trap' },
  { label: 'Debris in Trap', value: 'Debris in Trap' },
]

export default function TrapStatus({ navigation }: { navigation: any }) {
  const [status, setStatus] = useState('' as string)
  const [reasonNotFunc, setReasonNotFunc] = useState('' as string)
  const [initialValues] = useState({
    trapStatus: '',
    reasonNotFunc: '',
    flowMeasure: '',
    waterTemperature: '',
    waterTurbidity: '',
  } as TrapStatusInitialValues)

  const handlePressTestFlow = () => {
    navigation.navigate('High Flows')
  }
  const handlePressTestTemp = () => {
    navigation.navigate('High Temperatures')
  }
  const handlePressTestNonFunc = () => {
    navigation.navigate('Non Functional Trap')
  }

  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)

  useEffect(() => {
    console.log('dropdown values on initial load: ', dropdownValues)
    // Dispatch reducers' actions to make changes to that reducer's state
    // Parameters can be passed to these actions and will be recognized as the 'action.payload'
    dispatch(getTrapVisitDropdownValues())
  }, [])
  const { trapFunctionality } = dropdownValues.values

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={trapStatusSchema}
      onSubmit={(values: any) => {
        values.trapStatus = status
        values.reasonNotFunc = reasonNotFunc
        console.log('🚀 ~ TrapStatus ~ values', values)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <Box h='full' bg='#fff' p='10%'>
          <VStack space={8}>
            <Heading>Is the Trap functioning normally?</Heading>
            <FormControl w='3/4'>
              <FormControl.Label>Trap Status</FormControl.Label>
              <Select
                selectedValue={status}
                width='135%'
                accessibilityLabel='Status'
                placeholder='Status'
                _selectedItem={{
                  bg: 'primary',
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
              <FormControl w='3/4'>
                <FormControl.Label>
                  Reason For Trap Not Functioning
                </FormControl.Label>
                <Select
                  selectedValue={reasonNotFunc}
                  minWidth='200'
                  accessibilityLabel='Reason'
                  placeholder='Reason'
                  _selectedItem={{
                    bg: 'primary',
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
            {status.length > 0 && (
              <>
                <Heading fontSize='lg'>Environmental Conditions</Heading>
                <HStack space={5} width='125%'>
                  <FormControl w='1/4'>
                    <FormControl.Label>Flow Measure</FormControl.Label>
                    <Input
                      onChangeText={handleChange('flowMeasure')}
                      onBlur={handleBlur('flowMeasure')}
                      value={values.flowMeasure}
                      placeholder='Populated from CDEC'
                      keyboardType='numeric'
                    />
                  </FormControl>
                  <FormControl w='1/4'>
                    <FormControl.Label>Water Temperature</FormControl.Label>
                    <Input
                      onChangeText={handleChange('waterTemperature')}
                      onBlur={handleBlur('waterTemperature')}
                      value={values.waterTemperature}
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                    />
                  </FormControl>
                  <FormControl w='1/4'>
                    <FormControl.Label>Water Turbidity</FormControl.Label>
                    <Input
                      onChangeText={handleChange('waterTurbidity')}
                      onBlur={handleBlur('waterTurbidity')}
                      value={values.waterTurbidity}
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                    />
                  </FormControl>
                </HStack>
              </>
            )}
            <HStack space={4}>
              <Button
                rounded='xs'
                bg='primary'
                alignSelf='center'
                py='3'
                px='16'
                borderRadius='5'
                onPress={handlePressTestFlow}
              >
                <Text
                  textTransform='uppercase'
                  fontSize='sm'
                  fontWeight='bold'
                  color='#FFFFFF'
                >
                  TEST FLOW
                </Text>
              </Button>
              <Button
                rounded='xs'
                bg='primary'
                alignSelf='center'
                py='3'
                px='16'
                borderRadius='5'
                onPress={handlePressTestTemp}
              >
                <Text
                  textTransform='uppercase'
                  fontSize='sm'
                  fontWeight='bold'
                  color='#FFFFFF'
                >
                  TEST TEMP
                </Text>
              </Button>
              <Button
                rounded='xs'
                bg='primary'
                alignSelf='center'
                py='3'
                px='16'
                borderRadius='5'
                onPress={handlePressTestNonFunc}
              >
                <Text
                  textTransform='uppercase'
                  fontSize='sm'
                  fontWeight='bold'
                  color='#FFFFFF'
                >
                  TEST NON-FUNC
                </Text>
              </Button>
            </HStack>
            <Button
              /* 
              // @ts-ignore */
              onPress={handleSubmit}
              title='Submit'
              variant='solid'
              backgroundColor='primary'
            >
              SUBMIT
            </Button>
          </VStack>

          <RNButton
            title='Log dropdown values from redux'
            onPress={() => console.log(dropdownValues)}
          />
          <RNButton
            title='Empty "markType" from redux state'
            onPress={() => dispatch(clearValuesFromDropdown('markType'))}
          />
        </Box>
      )}
    </Formik>
  )
}
