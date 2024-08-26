import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
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
import { getAllProgramRelatedContent } from '../../redux/reducers/createNewProgramSlices/existingProgramsSlice'
import { postMonitoringProgramSubmissions } from '../../redux/reducers/postSlices/monitoringProgramPostBundler'
import { updateEntireCrewMembersStore } from '../../redux/reducers/createNewProgramSlices/crewMembersSlice'

const MonitoringProgramNew = ({
  navigation,
  createNewProgramHomeStore,
  existingProgramStore,
}: {
  navigation: any
  createNewProgramHomeStore: any
  existingProgramStore: any
}) => {
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const dispatch = useDispatch<AppDispatch>()
  // const [dataFetched, setDataFetched] = useState(false as boolean)
  const [copyValuesChecked, setCopyValuesChecked] = useState(false as boolean)
  const SubmitNewMonitoringProgramValues = (values: any) => {
    dispatch(saveNewProgramValues(values))
  }
  const fetchAllProgramRelatedContent = (values: any) => {
    dispatch(getAllProgramRelatedContent(values))
    // setDataFetched(true)
    // updateEntireCrewMembersStore()
  }
  // useEffect(() => {
  //   // if (existingProgramStore.status === 'fulfilled') {
  //   updateEntireCrewMembersStore(
  //     existingProgramStore.allProgramContents.Personnel
  //   )

  //   // }
  // }, [existingProgramStore, dataFetched])

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
                    Would you like to copy values from an existing program?
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
                  <>
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
                        selectOptions={dropdownValues?.programs.map(
                          (item: any) => ({
                            label: item.programName,
                            value: item.programName,
                          })
                        )}
                      />
                    </FormControl>
                    <Button
                      bg='primary'
                      w='40'
                      h='10'
                      onPress={() => {
                        fetchAllProgramRelatedContent(1)
                      }}
                    >
                      TEST SAVE
                    </Button>
                  </>
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
    existingProgramStore: state.existingProgram,
  }
}

export default connect(mapStateToProps)(MonitoringProgramNew)
