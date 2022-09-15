import { useState } from 'react'
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
} from 'native-base'
import { trapStatusSchema } from '../../../services/utils/helpers/yupValidations'
import { TrapStatusInitialValues } from '../../../services/utils/interfaces'

const trapStatuses = [
  { label: 'Trap Functioning Normally', value: 'TFN' },
  { label: 'Trap Functioning but not Normally', value: 'TFNN' },
  { label: 'Trap Not Functioning', value: 'TNF' },
  { label: 'Trap Not in Service', value: 'TNS' },
]
const reasonsForTrapNotFunctioning = [
  { label: 'High Rain', value: 'HR' },
  { label: 'Broken Trap', value: 'BT' },
  { label: 'Debris in Trap', value: 'DT' },
]

export default function TrapStatus() {
  const [status, setStatus] = useState('' as string)
  const [reasonNotFunc, setReasonNotFunc] = useState('' as string)
  const [flowMeasure, setFlowMeasure] = useState('' as string)
  const [temp, setTemp] = useState('' as string)
  const [turbidity, setTurbidity] = useState('' as string)
  const [initialValues, setInitialvalues] = useState(
    {} as TrapStatusInitialValues
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={trapStatusSchema}
      onSubmit={result => console.log('RESULT:', result)}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <Box h='full' bg='#fff' p='15'>
          <VStack space={4}>
            <Heading fontSize='lg'>Is the Trap functioning normally?</Heading>
            <FormControl w='3/4'>
              <FormControl.Label>Trap Status</FormControl.Label>
              <Select
                selectedValue={status}
                minWidth='200'
                accessibilityLabel='Status'
                placeholder='Status'
                _selectedItem={{
                  bg: 'primary',
                  endIcon: <CheckIcon size='5' />,
                }}
                mt={1}
                onValueChange={itemValue => setStatus(itemValue)}
              >
                {trapStatuses.map((item, idx) => (
                  <Select.Item
                    key={idx}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Select>
            </FormControl>
            {status === 'TFNN' && (
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
                    bg: 'teal.600',
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
                <HStack space={6}>
                  <FormControl w='1/4'>
                    <FormControl.Label>Flow Measure</FormControl.Label>
                    <Input
                      onChangeText={setFlowMeasure}
                      value={flowMeasure}
                      placeholder='Populated from CDEC'
                      keyboardType='numeric'
                    />
                  </FormControl>
                  <FormControl w='1/4'>
                    <FormControl.Label>Water Temperature</FormControl.Label>
                    <Input
                      onChangeText={setTemp}
                      value={temp}
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                    />
                  </FormControl>
                  <FormControl w='1/4'>
                    <FormControl.Label>Water Turbidity</FormControl.Label>
                    <Input
                      onChangeText={setTurbidity}
                      value={turbidity}
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                    />
                  </FormControl>
                </HStack>
              </>
            )}
          </VStack>
          {/*           
// @ts-ignore */}
          {/* <Button onPress={handleSubmit} colorScheme='pink'>
            Submit
          </Button> */}
          {/* <Button onPress={handleSubmit}>Submit</Button> */}
        </Box>
      )}
    </Formik>
  )
}
