import React, { useState } from 'react'
import {
  Box,
  Divider,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import DateTimePicker from '@react-native-community/datetimepicker'

import CreateNewProgramNavButtons from '../../components/createNewProgram/CreateNewProgramNavButtons'
import { Ionicons } from '@expo/vector-icons'
import CustomModal from '../../components/Shared/CustomModal'
import ChooseFileModalContent from '../../components/createNewProgram/ChooseFileModalContent'
import AddTakeAndMortalityModalContent from '../../components/createNewProgram/AddTakeAndMortalityModalContent'
import TakeAndMortalityDataTable from '../../components/createNewProgram/TakeAndMortalityDataTable'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { Formik } from 'formik'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import { savePermitInformationValues } from '../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { permittingInformationSchema } from '../../utils/helpers/yupValidations'
const PermittingInformationInput = ({
  navigation,
  permitInformationStore,
}: {
  navigation: any
  permitInformationStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [chooseFileModalOpen, setChooseFileModalOpen] = useState(
    false as boolean
  )
  const [addTakeAndMortalityModalOpen, setAddTakeAndMortalityModalOpen] =
    useState(false as boolean)
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
  const { waterTemperatureThreshold, flowThreshold, trapCheckFrequency } =
    permitInformationStore.values

  const handleAddPermittingInformationSubmission = (values: any) => {
    dispatch(
      savePermitInformationValues({
        ...values,
        dateIssued,
        dateExpired: expirationDate,
      })
    )
  }
  return (
    <>
      <Formik
        validationSchema={permittingInformationSchema}
        initialValues={{
          waterTemperatureThreshold,
          flowThreshold,
          trapCheckFrequency,
        }}
        onSubmit={(values) => {
          handleAddPermittingInformationSubmission(values)
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
              <Divider mb='5%' />
              <VStack px='5%' space={3}>
                <HStack space={260}>
                  <VStack space={2}>
                    <Text color='black' fontSize='xl'>
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
                  <VStack space={2}>
                    <Text color='black' fontSize='xl'>
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
                <HStack space={10} justifyContent='space-between'>
                  <FormInputComponent
                    label={'Water temperature'}
                    touched={touched}
                    errors={errors}
                    value={
                      values.waterTemperatureThreshold
                        ? `${values.waterTemperatureThreshold}`
                        : ''
                    }
                    camelName={'waterTemperatureThreshold'}
                    keyboardType={'numeric'}
                    width={'40%'}
                    onChangeText={handleChange('waterTemperatureThreshold')}
                    onBlur={handleBlur('waterTemperatureThreshold')}
                  />
                  <FormInputComponent
                    label={'Flow Threshold'}
                    touched={touched}
                    errors={errors}
                    value={
                      values.flowThreshold ? `${values.flowThreshold}` : ''
                    }
                    camelName={'flowThreshold'}
                    keyboardType={'numeric'}
                    width={'40%'}
                    onChangeText={handleChange('flowThreshold')}
                    onBlur={handleBlur('flowThreshold')}
                  />
                </HStack>
                <Text fontSize='2xl' color='grey'>
                  Frequency of trap checks during inclement weather
                </Text>
                <FormInputComponent
                  label={'Trap Check Frequency'}
                  touched={touched}
                  errors={errors}
                  value={
                    values.trapCheckFrequency
                      ? `${values.trapCheckFrequency}`
                      : ''
                  }
                  camelName={'trapCheckFrequency'}
                  keyboardType={'numeric'}
                  width={'40%'}
                  onChangeText={handleChange('trapCheckFrequency')}
                  onBlur={handleBlur('trapCheckFrequency')}
                />
                <Text fontSize='2xl' color='grey'>
                  Frequency of trap checks during inclement weather
                </Text>
                <ScrollView h={150}>
                  <TakeAndMortalityDataTable />
                </ScrollView>
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
                <Pressable onPress={() => setChooseFileModalOpen(true)}>
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
              </VStack>
            </Box>
            <CreateNewProgramNavButtons
              navigation={navigation}
              handleSubmit={handleSubmit}
            />
          </>
        )}
      </Formik>

      {/* --------- Modals --------- */}
      <CustomModal
        isOpen={addTakeAndMortalityModalOpen}
        closeModal={() => setAddTakeAndMortalityModalOpen(false)}
        height='1/2'
      >
        <AddTakeAndMortalityModalContent
          closeModal={() => setAddTakeAndMortalityModalOpen(false)}
        />
      </CustomModal>
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
    permitInformationStore: state.permitInformation,
  }
}
export default connect(mapStateToProps)(PermittingInformationInput)
