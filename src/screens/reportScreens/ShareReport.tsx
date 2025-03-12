import { Formik } from 'formik'
import {
  Checkbox,
  FormControl,
  Heading,
  HStack,
  Text,
  View,
  VStack,
} from 'native-base'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import yup from 'yup'
import GenerateReportNavButtons from '../../components/generateReport/GenerateReportNavButtons'
import { generateWordDocument } from '../../components/generateReport/ReportGenerator'
import EditAccountInfoModalContent from '../../components/generateReport/ReportPreviewModalContent'
import CustomModal from '../../components/Shared/CustomModal'
import CustomSelect from '../../components/Shared/CustomSelect'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import {
  sendBiWeeklyPassageSummary,
  updateMostRecentReportFilePath,
} from '../../redux/reducers/generateReportSlice'
import { type InitialStateI } from '../../redux/reducers/userCredentialsSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { shareReportSchema } from '../../utils/helpers/yupValidations'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'

type ShareReportProps = yup.InferType<typeof shareReportSchema>

const ShareReport = ({
  navigation,
  dropdownsState,
  userCredentialsStore,
}: {
  navigation: any
  dropdownsState: any
  userCredentialsStore: InitialStateI
}) => {
  const programDropdownOptions = userCredentialsStore.userPrograms.map(
    program => {
      return { value: `${program.programId}`, label: program.programName }
    }
  )

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
  const handleGenerateReport = async (
    values: yup.InferType<typeof shareReportSchema>
  ) => {
    setFilePath(null)
    return await dispatch(
      sendBiWeeklyPassageSummary({
        values,
        sender: {
          senderName: userCredentialsStore.displayName,
          senderEmail: userCredentialsStore.emailAddress,
        },
      })
    ) //change to selected program ID
  }

  const [reportPreviewModalOpen, setReportPreviewModalOpen] = useState(
    false as boolean
  )
  const [automatedReportChecked, setAutomatedReportChecked] = useState(
    false as boolean
  )
  const reportTitle = 'Biweekly Passage Summary'

  return (
    <Formik
      validationSchema={shareReportSchema}
      initialValues={{
        name: '',
        email: '',
        frequency: '',
        programId: '',
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        handleGenerateReport(values as ShareReportProps)
        setSubmitting(false)
        resetForm()
        showSlideAlert(
          dispatch,
          'Bi-weekly passage summary report successfully sent',
          'success',
          5000
        )
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldTouched,
        touched,
        errors,
        values,
        isValid,
        isSubmitting,
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
                    selectedValue={values.programId}
                    placeholder='Select a program'
                    label='What monitoring program are you generating a report for?'
                    camelName='programId'
                    onValueChange={handleChange('programId')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={programDropdownOptions}
                  />
                </FormControl>
              </VStack>

              <VStack space={2}>
                <HStack space={5} alignItems='center'>
                  <Text fontSize='2xl' fontWeight='500'>
                    Who do you want to share the report to?
                  </Text>
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
          </View>
          <GenerateReportNavButtons
            navigation={navigation}
            isDisabled={!isValid || isSubmitting}
            handleSubmit={handleSubmit}
          />
          {/* --------- Modals --------- */}
          <CustomModal
            isOpen={reportPreviewModalOpen}
            closeModal={() => setReportPreviewModalOpen(false)}
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
    userCredentialsStore: state.userCredentials,
  }
}

export default connect(mapStateToProps)(ShareReport)
