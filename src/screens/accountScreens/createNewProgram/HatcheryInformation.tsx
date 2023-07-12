import React, { useState } from 'react'
import {
  Box,
  Center,
  FormControl,
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

const HatcheryInformation = ({
  efficiencyTrialProtocolsStore,
  navigation,
}: {
  efficiencyTrialProtocolsStore: EfficiencyTrialProtocolsInitialStateI
  navigation: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const [chooseFileModalOpen, setChooseFileModalOpen] = useState(
    false as boolean
  )
  const handleEfficiencyTrialProtocolsSubmission = (values: any) => {
    dispatch(saveHatcheryInformationValues(values))
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
                  <FormControl>
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
