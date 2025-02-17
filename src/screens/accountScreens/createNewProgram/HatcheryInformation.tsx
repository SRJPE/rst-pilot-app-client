import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Formik } from 'formik'
import {
  Box,
  Center,
  FormControl,
  HStack,
  Heading,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
  View,
} from 'native-base'
import React, { useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import AppLogo from '../../../components/Shared/AppLogo'
import CustomSelect from '../../../components/Shared/CustomSelect'
import FilePreviewCard from '../../../components/Shared/FilePreviewCard'
import FormInputComponent from '../../../components/Shared/FormInputComponent'
import PdfPreviewScreen from '../../../components/Shared/PdfPreviewScreen'
import {
  EfficiencyTrialProtocolsInitialStateI,
  saveHatcheryInformationValues,
} from '../../../redux/reducers/createNewProgramSlices/efficiencyTrialProtocolsSlice'
import { AppDispatch, RootState } from '../../../redux/store'
import { hatcheryInformationSchema } from '../../../utils/helpers/yupValidations'
import useCacheDirectory from '../../../utils/hooks/useCacheDirectory'

const HatcheryInformation = ({
  efficiencyTrialProtocolsStore,
  navigation,
}: {
  efficiencyTrialProtocolsStore: EfficiencyTrialProtocolsInitialStateI
  navigation: any
}) => {
  const [agreementStartDate, setAgreementStartDate] = useState(
    efficiencyTrialProtocolsStore.values.agreementStartDate as Date
  )
  const [agreementEndDate, setAgreementEndDate] = useState(
    efficiencyTrialProtocolsStore.values.agreementEndDate as Date
  )
  const [renewalDate, setRenewalDate] = useState(
    efficiencyTrialProtocolsStore.values.renewalDate as Date
  )
  const [chooseFileModalOpen, setChooseFileModalOpen] = useState(
    false as boolean
  )
  const {
    handleFileRemoval,
    handleOpenPdfPreview,
    handleClosePdfPreview,
    files,
    activeFilePreview,
    openDocumentPicker,
  } = useCacheDirectory('hatcheryInformation')

  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const onStartDateChange = (event: any, selectedDate: any) => {
    setAgreementStartDate(selectedDate)
  }
  const onEndDateChange = (event: any, selectedDate: any) => {
    setAgreementEndDate(selectedDate)
  }
  const onRenewalDateChange = (event: any, selectedDate: any) => {
    setRenewalDate(selectedDate)
  }

  const handleEfficiencyTrialProtocolsSubmission = (values: any) => {
    dispatch(saveHatcheryInformationValues(values))
  }
  return (
    <>
      <Formik
        validationSchema={hatcheryInformationSchema}
        initialValues={efficiencyTrialProtocolsStore.values}
        onSubmit={values => {
          handleEfficiencyTrialProtocolsSubmission(values)
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
        }) => (
          <View h={'100%'} backgroundColor={'white'}>
            <ScrollView>
              <Box overflow='hidden' flex={1} bg='#fff'>
                <Center bg='primary' py='5%'>
                  <AppLogo imageSize={200} />
                </Center>
                <VStack py='5%' px='10%' space={5}>
                  <Heading alignSelf='center'>Hatchery Information</Heading>
                  <HStack space={10}>
                    <VStack space={2}>
                      <Text color='black' fontSize='md'>
                        Agreement Start Date
                      </Text>

                      <Box alignSelf='flex-start'>
                        <DateTimePicker
                          value={agreementStartDate}
                          mode='date'
                          onChange={onStartDateChange}
                          accentColor='#007C7C'
                        />
                      </Box>
                    </VStack>
                    <VStack space={2}>
                      <Text color='black' fontSize='md'>
                        Agreement Start Date
                      </Text>

                      <Box alignSelf='flex-start'>
                        <DateTimePicker
                          value={agreementEndDate}
                          mode='date'
                          onChange={onEndDateChange}
                          accentColor='#007C7C'
                        />
                      </Box>
                    </VStack>
                    <VStack space={2}>
                      <Text color='black' fontSize='md'>
                        Agreement Renewal Date
                      </Text>
                      <Box alignSelf='flex-start'>
                        <DateTimePicker
                          value={renewalDate}
                          mode='date'
                          onChange={onRenewalDateChange}
                          accentColor='#007C7C'
                        />
                      </Box>
                    </VStack>
                  </HStack>
                  <VStack space={4}>
                    <FormInputComponent
                      label={'Hatchery'}
                      placeholder='Enter Hatchery Name'
                      touched={touched}
                      errors={errors}
                      value={values.hatchery ? `${values.hatchery}` : ''}
                      camelName={'hatchery'}
                      onChangeText={handleChange('hatchery')}
                      onBlur={handleBlur('hatchery')}
                    />
                    <HStack space={5}>
                      <Box flex={1}>
                        <CustomSelect
                          label='Frequency of Receiving Fish'
                          selectedValue={values.frequencyOfReceivingFish}
                          placeholder={'Select Frequency'}
                          camelName='frequencyOfReceivingFish'
                          touched={touched}
                          errors={errors}
                          onValueChange={(value: any) =>
                            handleChange('frequencyOfReceivingFish')(value)
                          }
                          setFieldTouched={() =>
                            setFieldTouched('frequencyOfReceivingFish')
                          }
                          selectOptions={dropdownValues?.frequency}
                        />
                      </Box>

                      <FormInputComponent
                        label={'Expected # of Fish Received at Pickup'}
                        placeholder='0'
                        touched={touched}
                        errors={errors}
                        value={
                          values.expectedNumberOfFishReceivedAtEachPickup
                            ? `${values.expectedNumberOfFishReceivedAtEachPickup}`
                            : ''
                        }
                        camelName={'expectedNumberOfFishReceivedAtEachPickup'}
                        keyboardType={'numeric'}
                        onChangeText={handleChange(
                          'expectedNumberOfFishReceivedAtEachPickup'
                        )}
                        onBlur={handleBlur(
                          'expectedNumberOfFishReceivedAtEachPickup'
                        )}
                      />
                    </HStack>
                  </VStack>
                  <Text fontSize='lg' color='grey'>
                    Upload PDF of Agreement with Hatchery
                  </Text>
                  <Pressable
                    alignSelf='center'
                    onPress={() => openDocumentPicker()}
                  >
                    <Center
                      h='100'
                      w='650'
                      borderWidth='2'
                      borderColor='grey'
                      borderStyle='dotted'
                    >
                      <Icon
                        as={Ionicons}
                        name='cloud-upload'
                        size='5xl'
                        color='grey'
                      />
                      <Text fontSize='lg'>
                        Click to{' '}
                        <Text
                          style={{
                            textDecorationLine: 'underline',
                          }}
                          color={'primary'}
                        >
                          select file
                        </Text>
                      </Text>
                    </Center>
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
            </ScrollView>
            <CreateNewProgramNavButtons
              navigation={navigation}
              handleSubmit={handleSubmit}
              touched={touched}
              errors={errors}
            />
          </View>
        )}
      </Formik>

      {/* --------- Modals --------- */}
      {activeFilePreview?.uri && (
        <PdfPreviewScreen
          handleClosePdfPreview={handleClosePdfPreview}
          activeFilePreview={activeFilePreview}
        />
      )}
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    efficiencyTrialProtocolsStore: state.efficiencyTrialProtocols,
  }
}

export default connect(mapStateToProps)(HatcheryInformation)
