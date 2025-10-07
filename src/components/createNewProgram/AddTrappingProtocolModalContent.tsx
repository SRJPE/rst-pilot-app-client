import { Formik } from 'formik'
import { Box, Button, HStack, Text, VStack } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormInputComponent from '../../components/Shared/FormInputComponent'
import {
  IndividualTrappingProtocolState,
  IndividualTrappingProtocolValuesI,
  saveIndividualTrappingProtocol,
  updateIndividualTrappingProtocol,
} from '../../redux/reducers/createNewProgramSlices/trappingProtocolsSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { trappingProtocolsSchema } from '../../utils/helpers/yupValidations'
import { reorderTaxon } from '../../utils/utils'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'

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
              showHeaderButton={false}
              closeModal={closeModal}
            />
            <VStack mx='5%' my='2%' space={5}>
              <HStack justifyContent='space-around' space={5}>
                <Box flex={1}>
                  <CustomSelect
                    touched={touched}
                    errors={errors}
                    camelName='species'
                    label='Species'
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
                    camelName='run'
                    errors={errors}
                    touched={touched}
                    label='Run'
                    selectedValue={values.run}
                    placeholder={'Select Run'}
                    onValueChange={(value: any) => handleChange('run')(value)}
                    setFieldTouched={() => setFieldTouched('run')}
                    selectOptions={dropdownValues?.run}
                  />
                </Box>
              </HStack>

              <HStack justifyContent='space-around' space={5}>
                <Box flex={1}>
                  <CustomSelect
                    label='Life Stage'
                    camelName='lifeStage'
                    errors={errors}
                    touched={touched}
                    selectedValue={values?.lifeStage}
                    placeholder={'Select Life Stage'}
                    onValueChange={(value: any) =>
                      handleChange('lifeStage')(value)
                    }
                    setFieldTouched={() => setFieldTouched('lifeStage')}
                    selectOptions={dropdownValues?.lifeStage}
                  />
                </Box>

                <FormInputComponent
                  label={'Number Measured'}
                  touched={touched}
                  errors={errors}
                  value={
                    values.numberMeasured ? `${values.numberMeasured}` : ''
                  }
                  placeholder='0'
                  camelName={'numberMeasured'}
                  keyboardType={'number-pad'}
                  width={'45%'}
                  onChangeText={handleChange('numberMeasured')}
                  onBlur={handleBlur('numberMeasured')}
                />
              </HStack>
              <Button
                bg='primary'
                mx='2'
                px='10'
                shadow='3'
                isDisabled={!trappingProtocolsSchema.isValidSync(values)}
                onPress={() => {
                  handleSubmit()
                  closeModal()
                }}
              >
                <Text fontSize='xl' color='white'>
                  Add Protocol
                </Text>
              </Button>
            </VStack>
          </>
        )
      }}
    </Formik>
  )
}

export default AddTrappingProtocolModalContent
