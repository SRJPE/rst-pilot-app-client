import { Formik } from 'formik'
import {
  Box,
  Button,
  Divider,
  FormControl,
  HStack,
  Text,
  VStack,
  KeyboardAvoidingView,
} from 'native-base'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { takeAndMortalitySchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import CustomSelect from '../Shared/CustomSelect'
import { reorderTaxon } from '../../utils/utils'
import {
  IndividualTakeAndMortalityState,
  IndividualTakeAndMortalityStateI,
  // deleteIndividualTakeAndMortality,
  saveIndividualTakeAndMortality,
  updateIndividualTakeAndMortality,
} from '../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import React, { useEffect, useState } from 'react'

const AddTakeAndMortalityModalContent = ({
  closeModal,
  addTakeAndMortalityModalContent,
}: {
  closeModal: any
  addTakeAndMortalityModalContent: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const reorderedTaxon = reorderTaxon(dropdownValues.taxon)

  const [modalDataTemp, setModalDataTemp] = useState(
    IndividualTakeAndMortalityState as IndividualTakeAndMortalityStateI
  )

  useEffect(() => {
    if (addTakeAndMortalityModalContent?.uid) {
      setModalDataTemp(addTakeAndMortalityModalContent)
    }
  }, [addTakeAndMortalityModalContent])

  const handleAddTakeAndMortalitySubmission = (
    values: IndividualTakeAndMortalityStateI
  ) => {
    if (values?.uid) {
      dispatch(updateIndividualTakeAndMortality(values))
    } else {
      dispatch(saveIndividualTakeAndMortality(values))
    }
  }
  const handleDelete = () => {
    // dispatch(deleteIndividualTakeAndMortality(addTakeAndMortalityModalContent))
    setModalDataTemp(IndividualTakeAndMortalityState)
  }

  return (
    <Formik
      validationSchema={takeAndMortalitySchema}
      enableReinitialize
      initialValues={modalDataTemp}
      onSubmit={(values, { resetForm, setSubmitting }) => {
        handleAddTakeAndMortalitySubmission(values)
        resetForm()
        setSubmitting(false)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setValues,
        setFieldTouched,
        touched,
        errors,
        values,
        resetForm,
      }) => {
        return (
          <KeyboardAvoidingView flex='1' behavior='padding'>
            <CustomModalHeader
              headerText={'Add Take and Mortality'}
              showHeaderButton={false}
              closeModal={() => {
                closeModal()
                resetForm()
              }}
            />
            <VStack mx='5%' my='2%' space={6}>
              <HStack justifyContent='space-evenly' space={5}>
                <Box flex={1}>
                  <CustomSelect
                    label='Species'
                    camelName='species'
                    errors={errors}
                    touched={touched}
                    selectedValue={values.species}
                    placeholder={'Select Species'}
                    onValueChange={(value: any) =>
                      handleChange('species')(value)
                    }
                    setFieldTouched={() => setFieldTouched('species')}
                    selectOptions={reorderedTaxon.map((taxon: any) => ({
                      label: taxon?.commonname,
                      value: taxon?.commonname,
                    }))}
                  />
                </Box>

                <Box flex={1}>
                  <CustomSelect
                    label='Listing Unit or Stock'
                    camelName='listingUnitOrStock'
                    errors={errors}
                    touched={touched}
                    selectedValue={values.listingUnitOrStock}
                    placeholder={'Select Listing Unit or Stock'}
                    onValueChange={(value: any) =>
                      handleChange('listingUnitOrStock')(value)
                    }
                    setFieldTouched={() =>
                      setFieldTouched('listingUnitOrStock')
                    }
                    selectOptions={dropdownValues?.listingUnit}
                  />
                </Box>
              </HStack>

              <CustomSelect
                label='Life Stage'
                camelName='lifeStage'
                errors={errors}
                touched={touched}
                selectedValue={values.lifeStage}
                placeholder={'Select Life Stage'}
                onValueChange={(value: any) => handleChange('lifeStage')(value)}
                setFieldTouched={() => setFieldTouched('lifeStage')}
                selectOptions={dropdownValues?.lifeStage}
              />

              <HStack justifyContent='space-evenly' space={5}>
                <FormInputComponent
                  label={'Expected Take'}
                  placeholder='0'
                  touched={touched}
                  errors={errors}
                  value={values.expectedTake ? `${values.expectedTake}` : ''}
                  camelName={'expectedTake'}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('expectedTake')}
                  onBlur={handleBlur('expectedTake')}
                />
                <FormInputComponent
                  placeholder='0'
                  label={'Indirect Mortality'}
                  touched={touched}
                  errors={errors}
                  value={
                    values.indirectMortality
                      ? `${values.indirectMortality}`
                      : ''
                  }
                  camelName={'indirectMortality'}
                  keyboardType={'number-pad'}
                  onChangeText={handleChange('indirectMortality')}
                  onBlur={handleBlur('indirectMortality')}
                />
              </HStack>
              <Button
                bg='primary'
                mx='2'
                px='10'
                mt={3}
                shadow='3'
                isDisabled={
                  Object.values(touched).length === 0 ||
                  (Object.values(touched).length > 0 &&
                    Object.values(errors).length > 0)
                }
                onPress={() => {
                  handleSubmit()
                  closeModal()
                }}
              >
                <Text fontSize='xl' color='white'>
                  Save Add Take and Mortality
                </Text>
              </Button>
            </VStack>
          </KeyboardAvoidingView>
        )
      }}
    </Formik>
  )
}

export default AddTakeAndMortalityModalContent
