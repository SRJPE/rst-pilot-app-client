import {
  Box,
  Center,
  CheckIcon,
  FormControl,
  Input,
  KeyboardAvoidingView,
  Radio,
  Select,
  Text,
  VStack,
} from 'native-base'
const testRunIDs = [
  { label: 'Spring', value: 'Spring' },
  { label: 'Summer', value: 'Summer' },
  { label: 'Fall', value: 'Fall' },
  { label: 'Winter', value: 'Winter' },
]

const ReleaseTrialHatchery = () => {
  return (
    <KeyboardAvoidingView bg='#FFF'>
      <Center
        bg='primary'
        _text={{
          alignSelf: 'flex-start',
          color: '#FFF',
          fontWeight: '700',
          fontSize: 'xl',
        }}
        // position='absolute'
        bottom='0'
        px='3'
        py='1.5'
      >
        RELEASE TRIAL - HATCHERY
      </Center>
      <VStack py='2%' px='4%' space={4}>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Number of Hatchery Fish
            </Text>
          </FormControl.Label>
          <Input
            w='1/2'
            height='50px'
            fontSize='16'
            placeholder='Numeric Value'
            keyboardType='numeric'
            // onChangeText={handleChange('coneDepth')}
            // onBlur={handleBlur('coneDepth')}
            // value={values.coneDepth}
          />
          {/* {touched.coneDepth &&
            errors.coneDepth &&
            renderErrorMessage(errors, 'coneDepth')} */}
        </FormControl>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Run ID of Hatchery Fish
            </Text>
          </FormControl.Label>
          <Select
            height='50px'
            fontSize='16'
            // selectedValue={values.trapStatus}
            accessibilityLabel='Trap Status'
            placeholder='Trap Status'
            _selectedItem={{
              bg: 'secondary',
              endIcon: <CheckIcon size='5' />,
            }}
            mt={1}
            // onValueChange={handleChange('trapStatus')}
          >
            {testRunIDs.map((item: any) => (
              <Select.Item
                key={item.id}
                label={item.label}
                value={item.value}
              />
            ))}
          </Select>
          {/* {touched.trapStatus &&
            errors.trapStatus &&
            renderErrorMessage(errors, 'trapStatus')} */}
        </FormControl>
        <FormControl>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Run Weight Count (provided by hatchery)
            </Text>
          </FormControl.Label>
          <Input
            w='1/2'
            height='50px'
            fontSize='16'
            placeholder='Numeric Value'
            keyboardType='numeric'
            // onChangeText={handleChange('coneDepth')}
            // onBlur={handleBlur('coneDepth')}
            // value={values.coneDepth}
          />
          {/* {touched.coneDepth &&
            errors.coneDepth &&
            renderErrorMessage(errors, 'coneDepth')} */}
        </FormControl>
        <FormControl w='1/2'>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Dead Count (hatchery)
            </Text>
          </FormControl.Label>
          <Input
            height='50px'
            fontSize='16'
            placeholder='Numeric Value'
            keyboardType='numeric'
            // onChangeText={handleChange('coneDepth')}
            // onBlur={handleBlur('coneDepth')}
            // value={values.coneDepth}
          />
          {/* {touched.coneDepth &&
            errors.coneDepth &&
            renderErrorMessage(errors, 'coneDepth')} */}
        </FormControl>
      </VStack>
    </KeyboardAvoidingView>
  )
}

export default ReleaseTrialHatchery
