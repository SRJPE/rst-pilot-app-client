import { Formik } from 'formik'
import { Button, Divider, FormControl, HStack, Text, VStack } from 'native-base'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { trappingProtocolsSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import {
  IndividualTrappingProtocolState,
  IndividualTrappingProtocolValuesI,
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
  const [modalDataTemp, setModalDataTemp] = useState({} as any)

  useEffect(() => {
    setModalDataTemp(addTrappingProtocolsModalContent)
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

  return (
    <Formik
      validationSchema={trappingProtocolsSchema}
      initialValues={IndividualTrappingProtocolState}
      onSubmit={(values, { resetForm }) => {
        handleAddTrappingProtocolSubmission(values)
        resetForm()
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
      }) => {
        useEffect(() => {
          setValues(modalDataTemp)
        }, [modalDataTemp])
        return (
          <>
            <CustomModalHeader
              headerText={'Species Measured'}
              showHeaderButton={true}
              closeModal={closeModal}
              headerButton={
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
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
                    Add Protocol
                  </Text>
                </Button>
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
          </>
        )
      }}
    </Formik>
  )
}

export default AddTrappingProtocolModalContent
