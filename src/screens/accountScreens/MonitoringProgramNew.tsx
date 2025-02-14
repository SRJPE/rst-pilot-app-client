import React, { useState } from 'react'
import {
  Box,
  Center,
  Checkbox,
  FormControl,
  HStack,
  Heading,
  Text,
  VStack,
  Radio,
} from 'native-base'
import AppLogo from '../../components/Shared/AppLogo'
import CustomSelect from '../../components/Shared/CustomSelect'
import { Formik } from 'formik'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { saveNewProgramValues } from '../../redux/reducers/createNewProgramSlices/createNewProgramHomeSlice'
import MonitoringProgramNavButtons from '../../components/monitoringProgram/MonitoringProgramNavButtons'
import { setUpNewProgramSchema } from '../../utils/helpers/yupValidations'
import FormInputComponent from '../../components/Shared/FormInputComponent'

import { ScrollView } from 'react-native'

const streamNamesTemp = [
  { id: 1, definition: 'Stream Name 1' },
  { id: 2, definition: 'Stream Name 2' },
]
const programsTemp = [
  { id: 1, definition: 'Program 1' },
  { id: 2, definition: 'Program 2' },
]
// const fundingAgenciesTemp = [
//   { id: 1, definition: 'Funding Agency 1' },
//   { id: 2, definition: 'Funding Agency 2' },
// ]

type CopyExistingProgramValue = 'true' | 'false'

const MonitoringProgramNew = ({
  navigation,
  createNewProgramHomeStore,
}: {
  navigation: any
  createNewProgramHomeStore: any
}) => {
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const dispatch = useDispatch<AppDispatch>()

  const SubmitNewMonitoringProgramValues = (values: any) => {
    dispatch(saveNewProgramValues(values))
  }

  return (
    <>
      <Center bg='primary' py='5%'>
        <AppLogo imageSize={200} />
      </Center>
      <Formik
        validationSchema={setUpNewProgramSchema}
        initialValues={createNewProgramHomeStore.values}
        onSubmit={values => {
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
          setFieldError,
        }) => {
          console.log(
            '🚀 ~ file: MonitoringProgramNew.tsx:79 ~ values:',
            values
          )

          console.log(
            '🚀 ~ file: MonitoringProgramNew.tsx:81 ~ errors:',
            errors
          )
          const copyExistingProgram = values.copyExistingProgram === 'true'

          return (
            <Box h={'75%'} backgroundColor={'white'}>
              <ScrollView>
                <Box overflow='hidden' flex={1} bg='#fff'>
                  <VStack py='5%' px='10%' space={2}>
                    <Heading alignSelf='center'>Set Up a New Program</Heading>
                    <FormInputComponent
                      label={'Monitoring Program Name'}
                      placeholder='Enter Monitoring Program Name'
                      touched={touched}
                      errors={errors}
                      value={
                        values.monitoringProgramName
                          ? `${values.monitoringProgramName}`
                          : ''
                      }
                      camelName={'monitoringProgramName'}
                      onChangeText={newValue =>
                        setFieldValue('monitoringProgramName', newValue)
                      }
                      onBlur={handleBlur('monitoringProgramName')}
                    />
                    <FormInputComponent
                      label={'Stream Name'}
                      placeholder='Enter Stream Name'
                      touched={touched}
                      errors={errors}
                      value={values.streamName ? `${values.streamName}` : ''}
                      camelName={'streamName'}
                      onChangeText={newValue =>
                        setFieldValue('streamName', newValue)
                      }
                      onBlur={handleBlur('streamName')}
                    />
                    <CustomSelect
                      dataType='fundingAgency'
                      label='Funding Agency'
                      camelName='fundingAgency'
                      touched={touched}
                      errors={errors}
                      selectedValue={values.fundingAgency}
                      placeholder='Select Funding Agency'
                      onValueChange={handleChange('fundingAgency')}
                      setFieldTouched={() => setFieldTouched('fundingAgency')}
                      selectOptions={dropdownValues?.fundingAgency}
                    />
                    <VStack space={5}>
                      <Text fontSize='md'>
                        Would you like to copy values from an existing program?
                      </Text>
                      {/* <Checkbox
                        value={`${copyValuesChecked}`}
                        accessibilityLabel='copy values check box'
                        size='lg'
                        _checked={{ bg: 'primary', borderColor: 'primary' }}
                        isChecked={copyValuesChecked}
                        onChange={() => setCopyValuesChecked(!copyValuesChecked)}
                      ></Checkbox> */}
                      <Radio.Group
                        name='copyExistingProgram'
                        value={values.copyExistingProgram}
                        onChange={newValue => {
                          setFieldValue('copyExistingProgram', newValue)
                          if (newValue === 'false') {
                            setFieldError('program', '')
                            setFieldTouched('program', false)
                            setFieldValue('program', null)
                          }
                        }}
                      >
                        <Radio value='false' my={1}>
                          <Text>No</Text>
                        </Radio>
                        <Radio value='true' my={1}>
                          <Text>Yes</Text>
                        </Radio>
                      </Radio.Group>
                    </VStack>
                    {copyExistingProgram && (
                      <CustomSelect
                        errors={errors}
                        touched={touched}
                        label='Existing Program'
                        camelName='program'
                        selectedValue={values.program}
                        placeholder='Select Existing Program'
                        onValueChange={handleChange('program')}
                        setFieldTouched={() => setFieldTouched('program')}
                        selectOptions={programsTemp}
                      />
                    )}
                  </VStack>
                </Box>
              </ScrollView>
              <MonitoringProgramNavButtons
                navigation={navigation}
                handleSubmit={handleSubmit}
                touched={touched}
                errors={errors}
              />
            </Box>
          )
        }}
      </Formik>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    createNewProgramHomeStore: state.createNewProgramHome,
  }
}

export default connect(mapStateToProps)(MonitoringProgramNew)
