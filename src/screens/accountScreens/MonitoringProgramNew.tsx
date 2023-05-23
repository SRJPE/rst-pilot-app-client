import React, { useState } from 'react'
import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  Text,
  VStack,
} from 'native-base'
import AppLogo from '../../components/Shared/AppLogo'
import CustomSelect from '../../components/Shared/CustomSelect'
import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { saveNewProgramValues } from '../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'

const initialValues = {
  monitoringProgramName: '',
  streamName: '',
  fundingAgency: '',
}

const streamNamesTemp = [
  { id: 1, definition: 'Stream Name 1' },
  { id: 2, definition: 'Stream Name 2' },
]
const fundingAgenciesTemp = [
  { id: 1, definition: 'Funding Agency 1' },
  { id: 2, definition: 'Funding Agency 2' },
]
const MonitoringProgramNew = ({ navigation }: { navigation: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const SubmitNewMonitoringProgramValues = (values: any) => {
    dispatch(saveNewProgramValues(values))
  }
  return (
    <Box overflow='hidden' flex={1} bg='#fff'>
      <Center bg='primary' py='5%'>
        <AppLogo imageSize={200} />
      </Center>
      <Formik
        // validationSchema={releaseTrialSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          SubmitNewMonitoringProgramValues(values)
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
          <VStack alignItems='center' py='5%' px='15%' space={5}>
            <Heading alignSelf='center'>Set Up a new Program</Heading>
            <FormControl>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  Monitoring Program Name
                </Text>
              </FormControl.Label>
              <Input
                height='50px'
                fontSize='16'
                placeholder='Monitoring Program Name'
                onChangeText={handleChange('monitoringProgramName')}
                onBlur={handleBlur('monitoringProgramName')}
                value={`${values.monitoringProgramName}`}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  Stream Name
                </Text>
              </FormControl.Label>
              <CustomSelect
                selectedValue={values.streamName}
                placeholder='Stream Name'
                onValueChange={handleChange('streamName')}
                setFieldTouched={setFieldTouched}
                selectOptions={streamNamesTemp}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>
                <Text color='black' fontSize='xl'>
                  Funding Agency
                </Text>
              </FormControl.Label>
              <CustomSelect
                selectedValue={values.fundingAgency}
                placeholder='Funding Agency'
                onValueChange={handleChange('fundingAgency')}
                setFieldTouched={setFieldTouched}
                selectOptions={fundingAgenciesTemp}
              />
            </FormControl>
            <Text fontSize='2xl' color='grey'>
              Would you like to:
            </Text>
            <Button
              borderRadius={10}
              bg='primary'
              h='60px'
              w='450px'
              shadow='5'
              onPress={() => {
                handleSubmit()
                navigation.navigate('Monitoring Program', {
                  screen: 'Create New Program',
                })
              }}
            >
              <Text fontSize='xl' fontWeight='bold' color='white'>
                Add a new program
              </Text>
            </Button>
            <Button
              borderRadius={10}
              bg='primary'
              h='60px'
              w='450px'
              shadow='5'
              onPress={() => {
                handleSubmit()
                navigation.navigate('Monitoring Program', {
                  screen: 'Monitoring Program New Copy',
                })
              }}
            >
              <Text fontSize='xl' fontWeight='bold' color='white'>
                Copy values from existing program
              </Text>
            </Button>
            <Button
              borderRadius={10}
              bg='primary'
              h='60px'
              w='450px'
              mt='50'
              shadow='5'
              onPress={() => {
                navigation.goBack()
              }}
            >
              <Text fontSize='xl' fontWeight='bold' color='white'>
                Back
              </Text>
            </Button>
          </VStack>
        )}
      </Formik>
    </Box>
  )
}

export default MonitoringProgramNew
