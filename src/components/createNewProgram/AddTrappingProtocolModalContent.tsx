import { Formik } from 'formik'
import {
  Button,
  Divider,
  FormControl,
  HStack,
  KeyboardAvoidingView,
  Text,
  VStack,
} from 'native-base'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { trappingProtocolsSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import {
  IndividualTrappingProtocolState,
  IndividualTrappingProtocolValuesI,
  deleteIndividualTrappingProtocol,
  saveIndividualTrappingProtocol,
  updateIndividualTrappingProtocol,
} from '../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import CustomSelect from '../Shared/CustomSelect'
import { reorderTaxon } from '../../utils/utils'
import { useEffect, useState } from 'react'

const AddTrappingProtocolModalContent = ({
  closeModal,
  addTrappingProtocolsModalContent,
}: {
  closeModal: any
  addTrappingProtocolsModalContent: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )
  const reorderedTaxon = reorderTaxon(dropdownValues.taxon)
  const [modalDataTemp, setModalDataTemp] = useState(
    IndividualTrappingProtocolState as IndividualTrappingProtocolValuesI
  )

  useEffect(() => {
    if (addTrappingProtocolsModalContent.uid) {
      setModalDataTemp(addTrappingProtocolsModalContent)
    }
  }, [addTrappingProtocolsModalContent])

  const handleAddTrappingProtocolSubmission = (
    values: IndividualTrappingProtocolValuesI
  ) => {
    if (values?.uid) {
      dispatch(updateIndividualTrappingProtocol(values))
    } else {
      dispatch(saveIndividualTrappingProtocol(values))
    }
  }
  const handleDelete = () => {
    dispatch(deleteIndividualTrappingProtocol(addTrappingProtocolsModalContent))
    setModalDataTemp(IndividualTrappingProtocolState)
  }

  const checkIfValid = (values: any) => {}

  return (
    <Formik
      validationSchema={trappingProtocolsSchema}
      initialValues={modalDataTemp}
      enableReinitialize
      onSubmit={(values, { resetForm, setSubmitting }) => {
        handleAddTrappingProtocolSubmission(values)
        resetForm()
        setSubmitting(false)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldTouched,
        setValues,
        touched,
        errors,
        values,
        isValid,
      }) => {
        return (
          <KeyboardAvoidingView flex='1' behavior='padding'>
            <CustomModalHeader
              headerText={'Species Measured'}
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
                      // disabled b/c has not been touched and is not an edit
                      (Object.values(touched).length === 0 &&
                        !values.species) ||
                      // disabled b/c formik says it is invalid
                      !isValid
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
              <HStack justifyContent='space-around'>
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
                <FormControl w='45%'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Run
                    </Text>
                  </FormControl.Label>
                  <CustomSelect
                    selectedValue={values.run}
                    placeholder={'Run'}
                    onValueChange={(value: any) => handleChange('run')(value)}
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownValues?.run}
                  />
                </FormControl>
              </HStack>

              <HStack justifyContent='space-around'>
                <FormControl w='45%'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Life Stage
                    </Text>
                  </FormControl.Label>
                  <CustomSelect
                    selectedValue={values?.lifeStage}
                    placeholder={'Life Stage'}
                    onValueChange={(value: any) =>
                      handleChange('lifeStage')(value)
                    }
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownValues?.lifeStage}
                  />
                </FormControl>

                <FormInputComponent
                  label={'Number Measured'}
                  touched={touched}
                  errors={errors}
                  value={
                    values.numberMeasured ? `${values.numberMeasured}` : ''
                  }
                  camelName={'numberMeasured'}
                  keyboardType={'numeric'}
                  width={'45%'}
                  onChangeText={handleChange('numberMeasured')}
                  onBlur={handleBlur('numberMeasured')}
                />
              </HStack>
            </VStack>
          </KeyboardAvoidingView>
        )
      }}
    </Formik>
  )
}

export default AddTrappingProtocolModalContent
