import {
  Button,
  Center,
  Checkbox,
  FormControl,
  Heading,
  HStack,
  Icon,
  Text,
  View,
  VStack,
} from 'native-base'
import { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AppDispatch, RootState } from '../../redux/store'
import { connect, useDispatch, useSelector } from 'react-redux'
import GenerateReportNavButtons from '../../components/generateReport/GenerateReportNavButtons'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import { Formik } from 'formik'
import CustomSelect from '../../components/Shared/CustomSelect'
import CustomModal from '../../components/Shared/CustomModal'
import EditAccountInfoModalContent from '../../components/generateReport/ReportPreviewModalContent'
import axios from 'axios'
import { postBiWeeklyPassageSummaryEmail } from '../../redux/reducers/generateReportSlice'

const ShareReport = ({
  navigation,
  dropdownsState,
}: {
  navigation: any
  dropdownsState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const generateReportsStore = useSelector(
    (state: RootState) => state.generateReports
  )

  const [reportPreviewModalOpen, setReportPreviewModalOpen] = useState(
    false as boolean
  )
  const [automatedReportChecked, setAutomatedReportChecked] = useState(
    false as boolean
  )
  const reportTitle = 'Biweekly Passage Summary'

  // const sendEmail = async (email: string, subject: string) => {
  //   try {
  //     const { mostRecentReportFilePath } = generateReportsStore
  //     console.log('🚀 ~ mostRecentReportFilePath:', mostRecentReportFilePath)
  //     const response = await axios.post(
  //       'http://localhost:8000/report/send-email',
  //       {
  //         to: email,
  //         subject: subject,
  //         filePath: mostRecentReportFilePath,
  //       }
  //     )

  //     console.log('Email sent:', response)
  //   } catch (error) {
  //     console.error('Error sending email:', error)
  //   }
  // }

  const handleSubmitReport = (values: any) => {
    const { mostRecentReportFilePath } = generateReportsStore

    dispatch(postBiWeeklyPassageSummaryEmail())
  }

  return (
    <Formik
      // validationSchema={setUpNewProgramSchema}
      initialValues={{
        name: '',
        email: '',
        frequency: '',
      }}
      onSubmit={(values) => {
        // handleSubmitReport(values)
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
          <View
            flex={1}
            bg='#fff'
            p='6%'
            borderColor='themeGrey'
            borderWidth='15'
          >
            <VStack space={5}>
              <Heading>{`${reportTitle} Preview `}</Heading>

              <VStack h='370' w='100%'>
                <Center
                  h='80%'
                  borderColor='grey'
                  borderWidth='3'
                  borderRadius='3'
                  borderBottomRadius='0'
                >
                  <Text fontSize='2xl'>Report Preview Placeholder</Text>
                </Center>

                <HStack
                  borderColor='#ccc'
                  borderBottomWidth='3'
                  borderRightWidth='3'
                  borderLeftWidth='3'
                  borderRadius='3'
                  borderTopRadius='0'
                  alignSelf='center'
                  h='20%'
                  w='100%'
                  justifyContent='space-evenly'
                >
                  <Text fontSize='xl' alignSelf='center'>
                    Biweekly Passage Summary
                  </Text>

                  <Button
                    bg='white'
                    leftIcon={
                      <Icon
                        as={MaterialCommunityIcons}
                        mr='2'
                        name='clipboard-text'
                        size='12'
                        color='primary'
                      />
                    }
                    onPress={() => setReportPreviewModalOpen(true)}
                  >
                    <Text fontSize='xl'>Preview</Text>
                  </Button>
                </HStack>
              </VStack>

              <VStack space={2}>
                <HStack space={5} alignItems='center'>
                  <Text fontSize='2xl' fontWeight='500'>
                    Who do you want to share report to?
                  </Text>
                  <Button bg='primary' onPress={handleSubmitReport}>
                    test email
                  </Button>
                </HStack>
                <FormInputComponent
                  label={'Name (First Last)'}
                  touched={touched}
                  errors={errors}
                  value={values.name ? `${values.name}` : ''}
                  camelName={'name'}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                <FormInputComponent
                  label={'Email Address'}
                  touched={touched}
                  errors={errors}
                  value={values.email ? `${values.email}` : ''}
                  camelName={'email'}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
              </VStack>

              <HStack space={5} alignItems='center'>
                <Text fontSize='2xl' fontWeight='500'>
                  Would you like to set up an automated report schedule?
                </Text>
                <Checkbox
                  value={`${automatedReportChecked}`}
                  accessibilityLabel='copy values check box'
                  size='lg'
                  _checked={{ bg: 'primary', borderColor: 'primary' }}
                  isChecked={automatedReportChecked}
                  onChange={() =>
                    setAutomatedReportChecked(!automatedReportChecked)
                  }
                ></Checkbox>
              </HStack>
              {automatedReportChecked && (
                <FormControl>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      How often do you want to share report?
                    </Text>
                  </FormControl.Label>
                  <CustomSelect
                    selectedValue={values.frequency}
                    placeholder='Frequency'
                    onValueChange={handleChange('frequency')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownsState.values.frequency}
                  />
                </FormControl>
              )}
            </VStack>
          </View>
          <GenerateReportNavButtons navigation={navigation} />
          {/* --------- Modals --------- */}
          <CustomModal
            isOpen={reportPreviewModalOpen}
            closeModal={() => setReportPreviewModalOpen(false)}
            // height='1/1'
          >
            <EditAccountInfoModalContent
              closeModal={() => setReportPreviewModalOpen(false)}
            />
          </CustomModal>
        </>
      )}
    </Formik>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    dropdownsState: state.dropdowns,
  }
}

export default connect(mapStateToProps)(ShareReport)
