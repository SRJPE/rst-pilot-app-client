import { MaterialIcons } from '@expo/vector-icons'
import { Formik } from 'formik'
import {
  Button,
  Divider,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'

import { useDispatch } from 'react-redux'
import {
  individualTrappingSiteState,
  IndividualTrappingSiteValuesI,
  saveIndividualTrapSite,
  updateIndividualTrapSite,
} from '../../redux/reducers/createNewProgramSlices/trappingSitesSlice'
import { AppDispatch } from '../../redux/store'
import { trappingSitesSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import { useEffect, useState } from 'react'
import RenderErrorMessage from '../Shared/RenderErrorMessage'

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
          <>
            <CustomModalHeader
              headerText={'Add Traps'}
              showHeaderButton={true}
              closeModal={closeModal}
              headerButton={
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
                  shadow='3'
                  isDisabled={
                    (Object.values(touched).length === 0 && !values.uid) ||
                    (Object.values(touched).length > 0 &&
                      Object.values(errors).length > 0)
                  }
                  onPress={() => {
                    handleSubmit()
                    closeModal()
                  }}
                >
                  <Text fontSize='xl' color='white'>
                    Add Trap
                  </Text>
                </Button>
              }
            />
            <VStack mx='5%' my='2%' space={6}>
              <FormInputComponent
                label={'Trap Name'}
                touched={touched}
                errors={errors}
                value={values.trapName ? `${values.trapName}` : ''}
                camelName={'trapName'}
                onChangeText={handleChange('trapName')}
                onBlur={handleBlur('trapName')}
              />

              <HStack space={10} alignItems='center'>
                <FormInputComponent
                  label={'Trap Latitude'}
                  touched={touched}
                  errors={errors}
                  value={values.trapLatitude ? `${values.trapLatitude}` : ''}
                  camelName={'trapLatitude'}
                  keyboardType={'numeric'}
                  width={'40%'}
                  onChangeText={handleChange('trapLatitude')}
                  onBlur={handleBlur('trapLatitude')}
                />
                <FormInputComponent
                  label={'Trap Longitude'}
                  touched={touched}
                  errors={errors}
                  value={values.trapLongitude ? `${values.trapLongitude}` : ''}
                  camelName={'trapLongitude'}
                  keyboardType={'numeric'}
                  width={'40%'}
                  onChangeText={handleChange('trapLongitude')}
                  onBlur={handleBlur('trapLongitude')}
                />
                {/* <Pressable alignSelf='flex-end'>
                  <Icon
                    as={MaterialIcons}
                    name={'add-location-alt'}
                    size='16'
                    color='primary'
                  />
                </Pressable> */}
              </HStack>

              <HStack space={10}>
                <FormInputComponent
                  label={'Cone Size'}
                  touched={touched}
                  errors={errors}
                  value={values.coneSize ? `${values.coneSize}` : ''}
                  camelName={'coneSize'}
                  keyboardType={'numeric'}
                  width={'40%'}
                  onChangeText={handleChange('coneSize')}
                  onBlur={handleBlur('coneSize')}
                />

                <FormInputComponent
                  label={'USGS Station Number'}
                  touched={touched}
                  errors={errors}
                  value={
                    values.USGSStationNumber
                      ? `${values.USGSStationNumber}`
                      : ''
                  }
                  camelName={'USGSStationNumber'}
                  keyboardType={'numeric'}
                  width={'40%'}
                  onChangeText={handleChange('USGSStationNumber')}
                  onBlur={handleBlur('USGSStationNumber')}
                />
              </HStack>
              <FormInputComponent
                label={'Release Site Name'}
                touched={touched}
                errors={errors}
                value={
                  values.releaseSiteName ? `${values.releaseSiteName}` : ''
                }
                camelName={'releaseSiteName'}
                onChangeText={handleChange('releaseSiteName')}
                onBlur={handleBlur('releaseSiteName')}
              />

              <HStack space={10} alignItems='center'>
                <FormInputComponent
                  label={'Release Site Latitude'}
                  touched={touched}
                  errors={errors}
                  value={
                    values.releaseSiteLatitude
                      ? `${values.releaseSiteLatitude}`
                      : ''
                  }
                  camelName={'releaseSiteLatitude'}
                  keyboardType={'numeric'}
                  width={'40%'}
                  onChangeText={handleChange('releaseSiteLatitude')}
                  onBlur={handleBlur('releaseSiteLatitude')}
                  stackDirection={'column'}
                />
                <FormInputComponent
                  label={'Release Site Longitude'}
                  touched={touched}
                  errors={errors}
                  value={
                    values.releaseSiteLongitude
                      ? `${values.releaseSiteLongitude}`
                      : ''
                  }
                  camelName={'releaseSiteLongitude'}
                  keyboardType={'numeric'}
                  width={'40%'}
                  onChangeText={handleChange('releaseSiteLongitude')}
                  onBlur={handleBlur('releaseSiteLongitude')}
                  stackDirection={'column'}
                />

                {/* <Pressable alignSelf='flex-end'>
                  <Icon
                    as={MaterialIcons}
                    name={'add-location-alt'}
                    size='16'
                    color='primary'
                  />
                </Pressable> */}
              </HStack>
            </VStack>
          </>
        )
      }}
    </Formik>
  )
}

export default AddTrapModalContent
