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

  const [copyValuesChecked, setCopyValuesChecked] = useState(false as boolean)

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
          <>
            <Box overflow='hidden' flex={1} bg='#fff'>
              <VStack py='5%' px='10%' space={5}>
                <Heading alignSelf='center'>Set Up a New Program</Heading>
                <FormInputComponent
                  label={'Monitoring Program Name'}
                  touched={touched}
                  errors={errors}
                  value={
                    values.monitoringProgramName
                      ? `${values.monitoringProgramName}`
                      : ''
                  }
                  camelName={'monitoringProgramName'}
                  onChangeText={handleChange('monitoringProgramName')}
                  onBlur={handleBlur('monitoringProgramName')}
                />
                <FormInputComponent
                  label={'Stream Name'}
                  touched={touched}
                  errors={errors}
                  value={values.streamName ? `${values.streamName}` : ''}
                  camelName={'streamName'}
                  onChangeText={handleChange('streamName')}
                  onBlur={handleBlur('streamName')}
                />
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
                    selectOptions={dropdownValues?.fundingAgency}
                  />
                </FormControl>
                <HStack alignItems='center' space={8}>
                  <Text fontSize='2xl' color='grey'>
                    Would you like to copy values from an existing Program?
                  </Text>
                  <Checkbox
                    value={`${copyValuesChecked}`}
                    accessibilityLabel='copy values check box'
                    size='lg'
                    _checked={{ bg: 'primary', borderColor: 'primary' }}
                    isChecked={copyValuesChecked}
                    onChange={() => setCopyValuesChecked(!copyValuesChecked)}
                  ></Checkbox>
                </HStack>
                {copyValuesChecked && (
                  <FormControl>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Program{' '}
                      </Text>
                    </FormControl.Label>
                    <CustomSelect
                      selectedValue={values.program}
                      placeholder='Choose Program'
                      onValueChange={handleChange('program')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={programsTemp}
                    />
                  </FormControl>
                )}
              </VStack>
            </Box>
            <MonitoringProgramNavButtons
              navigation={navigation}
              handleSubmit={handleSubmit}
              touched={touched}
              errors={errors}
            />
          </>
        )}
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
