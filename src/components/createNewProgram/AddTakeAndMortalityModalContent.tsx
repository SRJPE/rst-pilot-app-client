import { Formik } from 'formik'
import { Button, Divider, FormControl, HStack, Text, VStack } from 'native-base'
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
  deleteIndividualTakeAndMortality,
  saveIndividualTakeAndMortality,
  updateIndividualTakeAndMortality,
} from '../../redux/reducers/createNewProgramSlices/permitInformationSlice'
import { useEffect, useState } from 'react'

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
    dispatch(deleteIndividualTakeAndMortality(addTakeAndMortalityModalContent))
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
      }) => {
        return (
          <>
            <CustomModalHeader
              headerText={'Add Take and Mortality'}
              showHeaderButton={true}
              closeModal={closeModal}
              headerButton={
                <HStack space={8}>
                  {values?.uid && (
                    <Button
                      bg='error'
                      mx='2'
                      px='10'
                      shadow='3'
                      onPress={() => {
                        handleDelete()
                        closeModal()
                      }}
                    >
                      <Text fontSize='xl' color='white'>
                        Delete{' '}
                      </Text>
                    </Button>
                  )}
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
                      {modalDataTemp?.uid ? 'Save' : 'Add Protocol'}
                    </Text>
                  </Button>
                </HStack>
              }
            />
            <VStack mx='5%' my='2%' space={6}>
              <HStack justifyContent='space-evenly'>
                <FormControl w='45%'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Species
                    </Text>
                  </FormControl.Label>
                  <CustomSelect
                    selectedValue={values.species}
                    placeholder={'Species'}
                    onValueChange={(value: any) =>
                      handleChange('species')(value)
                    }
                    setFieldTouched={setFieldTouched}
                    selectOptions={reorderedTaxon.map((taxon: any) => ({
                      label: taxon?.commonname,
                      value: taxon?.commonname,
                    }))}
                  />
                </FormControl>
                <FormControl w='45%' ml='5'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Listing Unit or Stock
                    </Text>
                  </FormControl.Label>
                  <CustomSelect
                    selectedValue={values.listingUnitOrStock}
                    placeholder={'Listing Unit or Stock'}
                    onValueChange={(value: any) =>
                      handleChange('listingUnitOrStock')(value)
                    }
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownValues?.listingUnit}
                  />
                </FormControl>
              </HStack>

              <FormControl w='45%' ml='5'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Life Stage
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.lifeStage}
                  placeholder={'Life Stage'}
                  onValueChange={(value: any) =>
                    handleChange('lifeStage')(value)
                  }
                  setFieldTouched={setFieldTouched}
                  selectOptions={dropdownValues?.lifeStage}
                />
              </FormControl>

              <HStack justifyContent='space-evenly'>
                <FormInputComponent
                  label={'Expected Take'}
                  touched={touched}
                  errors={errors}
                  value={values.expectedTake ? `${values.expectedTake}` : ''}
                  camelName={'expectedTake'}
                  keyboardType={'numeric'}
                  width={'45%'}
                  onChangeText={handleChange('expectedTake')}
                  onBlur={handleBlur('expectedTake')}
                />
                <FormInputComponent
                  label={'Indirect Mortality'}
                  touched={touched}
                  errors={errors}
                  value={
                    values.indirectMortality
                      ? `${values.indirectMortality}`
                      : ''
                  }
                  camelName={'indirectMortality'}
                  keyboardType={'numeric'}
                  width={'45%'}
                  onChangeText={handleChange('indirectMortality')}
                  onBlur={handleBlur('indirectMortality')}
                />
              </HStack>
            </VStack>
          </>
        )
      }}
    </Formik>
  )
}

export default AddTakeAndMortalityModalContent
