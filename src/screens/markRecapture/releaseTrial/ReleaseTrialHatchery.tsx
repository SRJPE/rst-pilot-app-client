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
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTrapVisitDropdownValues } from '../../../redux/reducers/dropdownsSlice'
import { AppDispatch } from '../../../redux/store'

const ReleaseTrialHatchery = () => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  console.log('🚀 ~ dropdownValues', dropdownValues)

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
  }, [])
  const { run } = dropdownValues.values

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
            {run.map((item: any) => (
              <Select.Item
                key={item.id}
                label={item.definition}
                value={item.definition}
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
