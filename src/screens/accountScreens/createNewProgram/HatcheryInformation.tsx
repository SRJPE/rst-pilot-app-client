import React, { useState } from 'react'
import {
  Box,
  Center,
  FormControl,
  HStack,
  Heading,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import AppLogo from '../../../components/Shared/AppLogo'
import { Feather } from '@expo/vector-icons'
import CreateNewProgramNavButtons from '../../../components/createNewProgram/CreateNewProgramNavButtons'
import CustomModal from '../../../components/Shared/CustomModal'
import ChooseFileModalContent from '../../../components/createNewProgram/ChooseFileModalContent'
import CustomSelect from '../../../components/Shared/CustomSelect'
import { Formik } from 'formik'
import { AppDispatch, RootState } from '../../../redux/store'
import { connect, useDispatch, useSelector } from 'react-redux'
import {
  EfficiencyTrialProtocolsInitialStateI,
  saveHatcheryInformationValues,
} from '../../../redux/reducers/createNewProgramSlices/efficiencyTrialProtocolsSlice'
import FormInputComponent from '../../../components/Shared/FormInputComponent'
import { hatcheryInformationSchema } from '../../../utils/helpers/yupValidations'
import DateTimePicker from '@react-native-community/datetimepicker'

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
    delete values.agreementStartDate
    delete values.agreementEndDate
    delete values.renewalDate
    console.log('🚀 ~ handleEfficiencyTrialProtocolsSubmission ~ values :', {
      ...values,
      expectedNumberOfFishReceivedAtEachPickup: Number(
        values.expectedNumberOfFishReceivedAtEachPickup
      ),
      agreementStartDate,
      agreementEndDate,
      renewalDate,
    })
    dispatch(
      saveHatcheryInformationValues({
        ...values,
        expectedNumberOfFishReceivedAtEachPickup: Number(
          values.expectedNumberOfFishReceivedAtEachPickup
        ),

        agreementStartDate,
        agreementEndDate,
        renewalDate,
      })
    )
  }
  return (
    <>
      <Formik
        validationSchema={hatcheryInformationSchema}
        initialValues={efficiencyTrialProtocolsStore.values}
        onSubmit={(values) => {
          handleEfficiencyTrialProtocolsSubmission(values)
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
              <Center bg='primary' py='5%'>
                <AppLogo imageSize={200} />
              </Center>
              <VStack py='5%' px='10%' space={5}>
                <Heading alignSelf='center'>Hatchery Information</Heading>
                <HStack space={10}>
                  <VStack space={2}>
                    <Text color='black' fontSize='xl'>
                      Agreement Start Date
                    </Text>
                    <Box alignSelf='flex-start' minWidth='220' ml='-95'>
                      <DateTimePicker
                        value={agreementStartDate}
                        mode='date'
                        onChange={onStartDateChange}
                        accentColor='#007C7C'
                      />
                    </Box>
                  </VStack>
                  <VStack space={2}>
                    <Text color='black' fontSize='xl'>
                      Agreement End Date
                    </Text>
                    <Box alignSelf='flex-start' minWidth='220' ml='-95'>
                      <DateTimePicker
                        value={agreementEndDate}
                        mode='date'
                        onChange={onEndDateChange}
                        accentColor='#007C7C'
                      />
                    </Box>
                  </VStack>
                  <VStack space={2}>
                    <Text color='black' fontSize='xl'>
                      Agreement Renewal Date
                    </Text>
                    <Box alignSelf='flex-start' minWidth='220' ml='-95'>
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
                    touched={touched}
                    errors={errors}
                    value={values.hatchery ? `${values.hatchery}` : ''}
                    camelName={'hatchery'}
                    onChangeText={handleChange('hatchery')}
                    onBlur={handleBlur('hatchery')}
                  />
                  <HStack space={10} alignItems='center'>
                    <FormControl width={'45%'}>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Frequency of receiving fish{' '}
                        </Text>
                      </FormControl.Label>
                      <CustomSelect
                        selectedValue={values.frequencyOfReceivingFish}
                        placeholder={'Frequency'}
                        onValueChange={(value: any) =>
                          handleChange('frequencyOfReceivingFish')(value)
                        }
                        setFieldTouched={() =>
                          setFieldTouched('frequencyOfReceivingFish')
                        }
                        selectOptions={dropdownValues?.frequency}
                      />
                    </FormControl>
                    <FormInputComponent
                      width={'45%'}
                      label={'Expected number of fish received at each pickup'}
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
                  Upload PDF of Efficiency Monitoring Protocols
                </Text>
                <Pressable
                  alignSelf='center'
                  onPress={() => setChooseFileModalOpen(true)}
                >
                  <Center
                    h='150'
                    w='650'
                    borderWidth='2'
                    borderColor='grey'
                    borderStyle='dotted'
                  >
                    <Icon as={Feather} name='plus' size='5xl' color='grey' />
                  </Center>
                </Pressable>
              </VStack>
            </Box>
            <CreateNewProgramNavButtons
              navigation={navigation}
              handleSubmit={handleSubmit}
              touched={touched}
              errors={errors}
            />
          </>
        )}
      </Formik>
      {/* --------- Modals --------- */}
      <CustomModal
        isOpen={chooseFileModalOpen}
        closeModal={() => setChooseFileModalOpen(false)}
        height='1/3'
      >
        <ChooseFileModalContent
          closeModal={() => setChooseFileModalOpen(false)}
        />
      </CustomModal>
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    efficiencyTrialProtocolsStore: state.efficiencyTrialProtocols,
  }
}

export default connect(mapStateToProps)(HatcheryInformation)
