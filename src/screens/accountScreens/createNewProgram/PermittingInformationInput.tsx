import React, { useState } from 'react'
import {
  Box,
  Divider,
  FormControl,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import DateTimePicker from '@react-native-community/datetimepicker'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import { Ionicons } from '@expo/vector-icons'
import CustomModal from '../../../components/Shared/CustomModal'
import ChooseFileModalContent from '../../../components/createNewProgram/ChooseFileModalContent'
import AddTakeAndMortalityModalContent from '../../../components/createNewProgram/AddTakeAndMortalityModalContent'
import TakeAndMortalityDataTable from '../../../components/createNewProgram/TakeAndMortalityDataTable'
import { connect, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import { Formik } from 'formik'
import FormInputComponent from '../../../components/Shared/FormInputComponent'
import {
  IndividualTakeAndMortalityState,
  savePermitInformationValues,
} from '../../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { permittingInformationSchema } from '../../../utils/helpers/yupValidations'
import CustomSelect from '../../../components/Shared/CustomSelect'
import useCacheDirectory, {
  postMonitoringProgramFilesToDB,
} from '../../../utils/hooks/useCacheDirectory'
import FilePreviewCard from '../../../components/Shared/FilePreviewCard'
import PdfPreviewScreen from '../../../components/Shared/PdfPreviewScreen'

const PermittingInformationInput = ({
  navigation,
  permitInformationStore,
}: {
  navigation: any
  permitInformationStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const [chooseFileModalOpen, setChooseFileModalOpen] = useState(
    false as boolean
  )
  const [addTakeAndMortalityModalOpen, setAddTakeAndMortalityModalOpen] =
    useState(false as boolean)

  const [addTakeAndMortalityModalContent, setAddTakeAndMortalityModalContent] =
    useState(IndividualTakeAndMortalityState as any)

  const handleShowTableModal = (selectedRowData: any) => {
    const modalDataContainer = {} as any
    Object.keys(selectedRowData).forEach((key: string) => {
      modalDataContainer[key] = selectedRowData[key].toString()
    })
    setAddTakeAndMortalityModalContent(modalDataContainer)
    setAddTakeAndMortalityModalOpen(true)
  }

  const [dateIssued, setDateIssued] = useState(
    permitInformationStore.values.dateIssued as Date
  )
  const [expirationDate, setExpirationDate] = useState(
    permitInformationStore.values.dateExpired as Date
  )

  const onDateIssuedChange = (event: any, selectedDate: any) => {
    setDateIssued(selectedDate)
  }
  const onExpirationDateChange = (event: any, selectedDate: any) => {
    setExpirationDate(selectedDate)
  }

  const handleAddPermittingInformationSubmission = (values: any) => {
    delete values.dateIssued
    delete values.dateExpired
    dispatch(
      savePermitInformationValues({
        ...values,
        dateIssued,
        dateExpired: expirationDate,
      })
    )
  }

  const {
    handleFileRemoval,
    handleOpenPdfPreview,
    handleClosePdfPreview,
    files,
    activeFilePreview,
    openDocumentPicker,
  } = useCacheDirectory('permitInformation')

  const addTakeAndMortalityValues = useSelector(
    (state: RootState) => state.permitInformation.takeAndMortalityValues
  )

  const addTakeAndMortalityValuesArray = Object.values(
    addTakeAndMortalityValues
  )

  const addTakeAndMortalityErrors =
    addTakeAndMortalityValuesArray.length === 0
      ? { addTakeAndMortality: 'Please add take and mortality values' }
      : {}

  return (
    <>
      <Formik
        validationSchema={permittingInformationSchema}
        initialValues={permitInformationStore.values}
        onSubmit={values => {
          handleAddPermittingInformationSubmission(values)
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
        }) => {
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
                <Divider mb='2' />
                <VStack px='5%' py='2' space={3}>
                  <HStack mb={5}>
                    <VStack space={2} flex={1}>
                      <Text color='black' fontSize='md'>
                        Date Issued
                      </Text>
                      <Box alignSelf='flex-start' minWidth='220' ml='-95'>
                        <DateTimePicker
                          value={dateIssued}
                          mode='date'
                          onChange={onDateIssuedChange}
                          accentColor='#007C7C'
                        />
                      </Box>
                    </VStack>
                    <VStack space={2} flex={1}>
                      <Text color='black' fontSize='md'>
                        Expiration Date
                      </Text>
                      <Box alignSelf='flex-start' minWidth='220' ml='-95'>
                        <DateTimePicker
                          value={expirationDate}
                          mode='date'
                          onChange={onExpirationDateChange}
                          accentColor='#007C7C'
                        />
                      </Box>
                    </VStack>
                  </HStack>
                  <Text fontSize='2xl' color='grey'>
                    Trap will be stopped when:
                  </Text>
                  <HStack space={5}>
                    <FormInputComponent
                      label={'Water Temperature (ºF)'}
                      placeholder='0'
                      touched={touched}
                      errors={errors}
                      value={
                        values.waterTemperatureThreshold
                          ? `${values.waterTemperatureThreshold}`
                          : ''
                      }
                      camelName={'waterTemperatureThreshold'}
                      keyboardType={'number-pad'}
                      width={'40%'}
                      onChangeText={handleChange('waterTemperatureThreshold')}
                      onBlur={handleBlur('waterTemperatureThreshold')}
                    />
                    <FormInputComponent
                      label={'Flow Threshold'}
                      placeholder='0'
                      touched={touched}
                      errors={errors}
                      value={
                        values.flowThreshold ? `${values.flowThreshold}` : ''
                      }
                      camelName={'flowThreshold'}
                      keyboardType={'number-pad'}
                      width={'40%'}
                      onChangeText={handleChange('flowThreshold')}
                      onBlur={handleBlur('flowThreshold')}
                    />
                  </HStack>
                  <Text fontSize='2xl' color='grey'>
                    Frequency of trap checks during inclement weather
                  </Text>

                  <CustomSelect
                    label='Trap Check Frequency'
                    camelName='trapCheckFrequency'
                    touched={touched}
                    errors={errors}
                    selectedValue={values.trapCheckFrequency}
                    placeholder={'Select Trap Check Frequency'}
                    onValueChange={(value: any) =>
                      handleChange('trapCheckFrequency')(value)
                    }
                    setFieldTouched={() =>
                      setFieldTouched('trapCheckFrequency')
                    }
                    selectOptions={dropdownValues?.frequency}
                  />

                  <Text fontSize='2xl' color='grey' mt={5}>
                    Expected take and indirect mortality for RST
                  </Text>
                </VStack>
                <ScrollView h={150}>
                  <TakeAndMortalityDataTable
                    handleShowTableModal={handleShowTableModal}
                  />
                </ScrollView>
                <Divider my='1%' />
                <VStack py='5%' px='10%' space={5}>
                  <Pressable
                    onPress={() => setAddTakeAndMortalityModalOpen(true)}
                  >
                    <HStack alignItems='center'>
                      <Icon
                        as={Ionicons}
                        name={'add-circle'}
                        size='3xl'
                        color='primary'
                        marginRight='1'
                      />
                      <Text color='primary' fontSize='xl'>
                        Add Expected Take and Indirect Mortality
                      </Text>
                    </HStack>
                  </Pressable>
                  <Pressable onPress={() => openDocumentPicker()}>
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
                  {files.map((file, index) => (
                    <FilePreviewCard
                      key={index + file.name}
                      handleFileRemoval={handleFileRemoval}
                      handleOpenPdfPreview={handleOpenPdfPreview}
                      file={file}
                    />
                  ))}
                </VStack>
              </Box>
              <CreateNewProgramNavButtons
                navigation={navigation}
                handleSubmit={handleSubmit}
                touched={touched}
                errors={{ ...errors, ...addTakeAndMortalityErrors }}
              />
            </>
          )
        }}
      </Formik>

      {/* --------- Modals --------- */}
      {activeFilePreview?.uri && (
        <PdfPreviewScreen
          handleClosePdfPreview={handleClosePdfPreview}
          activeFilePreview={activeFilePreview}
        />
      )}
      {addTakeAndMortalityModalOpen && (
        <CustomModal
          isOpen={addTakeAndMortalityModalOpen}
          closeModal={() => setAddTakeAndMortalityModalOpen(false)}
          height='1/2'
        >
          <AddTakeAndMortalityModalContent
            addTakeAndMortalityModalContent={addTakeAndMortalityModalContent}
            closeModal={() => setAddTakeAndMortalityModalOpen(false)}
          />
        </CustomModal>
      )}
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    permitInformationStore: state.permitInformation,
  }
}
export default connect(mapStateToProps)(PermittingInformationInput)
