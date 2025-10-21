import { Formik } from 'formik'
import { Button, HStack, Text, VStack, KeyboardAvoidingView } from 'native-base'

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import {
  deleteIndividualTrapSite,
  individualTrappingSiteState,
  IndividualTrappingSiteValuesI,
  saveIndividualTrapSite,
  updateIndividualTrapSite,
} from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { AppDispatch } from '../../redux/store'
import { trappingSitesSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'

const AddTrapModalContent = ({
  closeModal,
  addTrapModalContent,
}: {
  closeModal: any
  addTrapModalContent?: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [modalDataTemp, setModalDataTemp] = useState(
    individualTrappingSiteState as IndividualTrappingSiteValuesI
  )

  const handleAddTrapSubmission = (values: IndividualTrappingSiteValuesI) => {
    if (values?.uid) {
      dispatch(updateIndividualTrapSite(values))
    } else {
      dispatch(saveIndividualTrapSite(values))
    }
  }

  useEffect(() => {
    if (addTrapModalContent?.uid) {
      setModalDataTemp(addTrapModalContent)
    }
  }, [addTrapModalContent])

  const handleDelete = () => {
    dispatch(deleteIndividualTrapSite(addTrapModalContent))
    setModalDataTemp(individualTrappingSiteState)
  }

  return (
    <Formik
      validationSchema={trappingSitesSchema}
      enableReinitialize
      initialValues={modalDataTemp}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        handleAddTrapSubmission(values)
        resetForm()
        setSubmitting(false)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        touched,
        errors,
        values,
      }) => {
        return (
          <KeyboardAvoidingView flex='1' behavior='padding'>
            <CustomModalHeader
              headerText={'Add Traps'}
              showHeaderButton={false}
              closeModal={closeModal}
            />
            <VStack mx='5%' my='2%' space={5}>
              <FormInputComponent
                label={'Trap Name'}
                placeholder='Enter Trap Name'
                touched={touched}
                errors={errors}
                value={values.trapName ? `${values.trapName}` : ''}
                camelName={'trapName'}
                onChangeText={handleChange('trapName')}
                onBlur={handleBlur('trapName')}
              />

              <HStack space={5}>
                <FormInputComponent
                  label={'Trap Latitude'}
                  placeholder='00.000'
                  touched={touched}
                  errors={errors}
                  value={values.trapLatitude ? `${values.trapLatitude}` : ''}
                  camelName={'trapLatitude'}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('trapLatitude')}
                  onBlur={handleBlur('trapLatitude')}
                />
                <FormInputComponent
                  label={'Trap Longitude'}
                  placeholder='00.000'
                  touched={touched}
                  errors={errors}
                  value={values.trapLongitude ? `${values.trapLongitude}` : ''}
                  camelName={'trapLongitude'}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('trapLongitude')}
                  onBlur={handleBlur('trapLongitude')}
                />
              </HStack>

              <HStack space={5}>
                <FormInputComponent
                  label={'Cone Size'}
                  placeholder='0'
                  touched={touched}
                  errors={errors}
                  value={values.coneSize ? `${values.coneSize}` : ''}
                  camelName={'coneSize'}
                  keyboardType={'number-pad'}
                  width={'40%'}
                  onChangeText={handleChange('coneSize')}
                  onBlur={handleBlur('coneSize')}
                />

                <FormInputComponent
                  label={'USGS Station Number'}
                  placeholder='00000000'
                  touched={touched}
                  errors={errors}
                  value={
                    values.USGSStationNumber
                      ? `${values.USGSStationNumber}`
                      : ''
                  }
                  camelName={'USGSStationNumber'}
                  keyboardType={'number-pad'}
                  width={'40%'}
                  onChangeText={handleChange('USGSStationNumber')}
                  onBlur={handleBlur('USGSStationNumber')}
                />
              </HStack>
              <HStack>
                <FormInputComponent
                  label={'Release Site Name'}
                  placeholder='Enter Release Site Name'
                  touched={touched}
                  errors={errors}
                  value={
                    values.releaseSiteName ? `${values.releaseSiteName}` : ''
                  }
                  camelName={'releaseSiteName'}
                  onChangeText={handleChange('releaseSiteName')}
                  onBlur={handleBlur('releaseSiteName')}
                />
              </HStack>

              <HStack space={5} alignItems='center'>
                <FormInputComponent
                  label={'Release Site Latitude'}
                  placeholder='00.000'
                  touched={touched}
                  errors={errors}
                  value={
                    values.releaseSiteLatitude
                      ? `${values.releaseSiteLatitude}`
                      : ''
                  }
                  camelName={'releaseSiteLatitude'}
                  keyboardType={'number-pad'}
                  width={'40%'}
                  onChangeText={handleChange('releaseSiteLatitude')}
                  onBlur={handleBlur('releaseSiteLatitude')}
                  stackDirection={'column'}
                />
                <FormInputComponent
                  label={'Release Site Longitude'}
                  touched={touched}
                  placeholder='00.000'
                  errors={errors}
                  value={
                    values.releaseSiteLongitude
                      ? `${values.releaseSiteLongitude}`
                      : ''
                  }
                  camelName={'releaseSiteLongitude'}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('releaseSiteLongitude')}
                  onBlur={handleBlur('releaseSiteLongitude')}
                  stackDirection={'column'}
                />
              </HStack>
              <Button
                bg='primary'
                mx='2'
                px='10'
                shadow='3'
                isDisabled={!trappingSitesSchema.isValidSync(values)}
                onPress={() => {
                  handleSubmit()
                  closeModal()
                }}
              >
                <Text fontSize='xl' color='white'>
                  Save Trap
                </Text>
              </Button>
            </VStack>
          </KeyboardAvoidingView>
        )
      }}
    </Formik>
  )
}

export default AddTrapModalContent
