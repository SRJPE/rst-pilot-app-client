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
import React, { useState, useEffect } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { AppDispatch, RootState } from '../../redux/store'
import { connect, useDispatch, useSelector } from 'react-redux'
import GenerateReportNavButtons from '../../components/generateReport/GenerateReportNavButtons'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import { Formik } from 'formik'
import CustomSelect from '../../components/Shared/CustomSelect'
import CustomModal from '../../components/Shared/CustomModal'
import EditAccountInfoModalContent from '../../components/generateReport/ReportPreviewModalContent'
import {
  postBiWeeklyPassageSummaryEmail,
  updateMostRecentReportFilePath,
  getBiWeeklyPassageSummary,
} from '../../redux/reducers/generateReportSlice'
import { generateWordDocument } from '../../components/generateReport/ReportGenerator'
import DocumentViewer from '../../components/Shared/DocumentViewer'

const ShareReport = ({
  navigation,
  dropdownsState,
}: {
  navigation: any
  dropdownsState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const biWeeklyPassageSummaryStore = useSelector(
    (state: RootState) => state.generateReports
  )
  const [filePath, setFilePath] = useState<string | null>(null)

  const handleGenerateDocument = async (documentData: any) => {
    const path = await generateWordDocument(documentData)
    setFilePath(path)
    dispatch(updateMostRecentReportFilePath(path))
  }

  // once store has been updated
  // this use effect runs to generate document
  useEffect(() => {
    if (!filePath && biWeeklyPassageSummaryStore.status === 'fulfilled') {
      handleGenerateDocument(biWeeklyPassageSummaryStore)
    }
  }, [biWeeklyPassageSummaryStore])

  // this happens on "generate pdf" button press
  // retrieves data back from db
  // updates store with all of the information needed to generate the report
  const handleGenerateReport = () => {
    setFilePath(null)
    dispatch(getBiWeeklyPassageSummary(1)) //change to selected program ID
  }

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
        programName: '',
      }}
      onSubmit={values => {
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
              <Heading>{`${reportTitle}`}</Heading>

              <VStack space={2}>
                <FormControl>
                  <CustomSelect
                    selectedValue={values.programName}
                    placeholder='Program name'
                    label='What monitoring program are you generating a report for?'
                    camelName='programName'
                    onValueChange={handleChange('programName')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={[
                      { id: 1, definition: 'Mill Creek RST Monitoring' },
                      { id: 2, definition: 'Deer Creek RST Monitoring' },
                    ]}
                  />
                </FormControl>
              </VStack>

              <VStack space={2}>
                <HStack space={5} alignItems='center'>
                  <Text fontSize='2xl' fontWeight='500'>
                    Who do you want to share the report to?
                  </Text>
                  <Button bg='primary' onPress={handleSubmitReport}>
                    test email
                  </Button>
                </HStack>
                <HStack space={4} paddingRight='5'>
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
                </HStack>
              </VStack>
            </VStack>
            <VStack space={2} marginTop={10}>
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
                  <CustomSelect
                    selectedValue={values.frequency}
                    label='How often do you want to share the report?'
                    placeholder='Frequency'
                    camelName='frequency'
                    onValueChange={handleChange('frequency')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownsState.values.frequency}
                  />
                </FormControl>
              )}
            </VStack>
            <VStack space={2} marginTop={10}>
              <Button bg='primary' onPress={handleGenerateReport}>
                TEST - Generate PDF
              </Button>
              {filePath && <DocumentViewer filePath={filePath} />}
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
