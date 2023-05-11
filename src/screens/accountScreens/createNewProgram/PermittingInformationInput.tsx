import React from 'react'
import {
  Box,
  Divider,
  FormControl,
  HStack,
  Icon,
  Input,
  Pressable,
  Radio,
  Text,
  VStack,
} from 'native-base'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import { Ionicons } from '@expo/vector-icons'
const PermittingInformationInput = ({ navigation }: { navigation: any }) => {
  const initialState = {
    dateIssued: '',
    dateExpired: '',
    waterTempThreshold: '',
    flowThreshold: '',
    trapCheckFrequency: '',
  }
  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Box
          bg='primary'
          _text={{
            color: '#FFF',
            fontWeight: '700',
            fontSize: '2xl',
          }}
          px='6'
          py='3'
        >
          Permitting Information
        </Box>
        <Text fontSize='2xl' color='grey' ml='5%' mt='5%'>
          Enter Based on your 4d Permit
        </Text>
        <Divider mb='5%' />
        <VStack px='10%' space={5}>
          <HStack space={10} justifyContent='space-between'>
            <FormControl w='45%'>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  Date Issued
                </Text>
              </FormControl.Label>
              <Input
                height='50px'
                fontSize='16'
                placeholder='Date Issued'
                // keyboardType='numeric'
                // onChange={debouncedOnChange}
                // onBlur={props.onBlur}
                value={initialState.dateIssued}
              />
            </FormControl>
            <FormControl w='45%'>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  Date Expired
                </Text>
              </FormControl.Label>
              <Input
                height='50px'
                fontSize='16'
                placeholder='Date Expired'
                // keyboardType='numeric'
                // onChange={debouncedOnChange}
                // onBlur={props.onBlur}
                value={initialState.dateExpired}
              />
            </FormControl>
          </HStack>
          <Text fontSize='2xl' color='grey'>
            Trap will be stopped when:
          </Text>
          <HStack space={10} justifyContent='space-between'>
            <FormControl w='45%'>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  Water temperature is above
                </Text>
              </FormControl.Label>
              <Input
                height='50px'
                fontSize='16'
                placeholder='Water Temperature Threshold'
                // keyboardType='numeric'
                // onChange={debouncedOnChange}
                // onBlur={props.onBlur}
                value={initialState.waterTempThreshold}
              />
            </FormControl>
            <FormControl w='45%'>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  Flow Threshold
                </Text>
              </FormControl.Label>
              <Input
                height='50px'
                fontSize='16'
                placeholder='Flow Threshold'
                // keyboardType='numeric'
                // onChange={debouncedOnChange}
                // onBlur={props.onBlur}
                value={initialState.flowThreshold}
              />
            </FormControl>
          </HStack>
          <Text fontSize='2xl' color='grey'>
            Frequency of trap checks during inclement weather
          </Text>
          <FormControl w='50%'>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Trap Check Frequency
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Trap Check Frequency'
              // keyboardType='numeric'
              // onChange={debouncedOnChange}
              // onBlur={props.onBlur}
              value={initialState.trapCheckFrequency}
            />
          </FormControl>
          <Text fontSize='2xl' color='grey'>
            Frequency of trap checks during inclement weather
          </Text>
          <Text fontSize='2xl' color='grey'>
            TABLE PLACEHOLDER
          </Text>
          <Pressable>
            <HStack alignItems='center'>
              <Icon
                as={Ionicons}
                name={'add-circle'}
                size='3xl'
                color='primary'
                marginRight='1'
              />
              <Text color='primary' fontSize='xl'>
                Add Row
              </Text>
            </HStack>
          </Pressable>
          <Pressable>
            <HStack alignItems='center'>
              <Icon
                as={Ionicons}
                name={'add-circle'}
                size='3xl'
                color='primary'
                marginRight='1'
              />
              <Text color='primary' fontSize='xl'>
                Upload PDF 4d permit
              </Text>
            </HStack>
          </Pressable>
        </VStack>
      </Box>
      <CreateNewProgramNavButtons navigation={navigation} />
    </>
  )
}
export default PermittingInformationInput
