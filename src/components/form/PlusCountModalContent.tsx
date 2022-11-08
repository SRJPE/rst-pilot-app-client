import { Formik } from 'formik'
import {
  FormControl,
  Input,
  ScrollView,
  VStack,
  Text,
  Button,
  Heading,
  HStack,
} from 'native-base'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savePlusCount } from '../../redux/reducers/formSlices/fishInputSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { addPlusCountsSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import renderErrorMessage from './RenderErrorMessage'

const initialFormValues = {
  species: '',
  lifeStage: '',
  run: '',
  count: '',
  plusCountMethod: '',
}

const speciesDictionary = [{ label: 'chinook', value: 'chinook' }]

const PlusCountModalContent = ({ closeModal }: { closeModal: any }) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  const handleFormSubmit = (values: any) => {
    dispatch(savePlusCount(values))
    console.log('🚀 ~ Plus Count Values: ', values)
  }

  return (
    <ScrollView>
      <Formik
        validationSchema={addPlusCountsSchema}
        initialValues={initialFormValues}
        onSubmit={(values) => handleFormSubmit(values)}
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
            <CustomModalHeader
              headerText={`Enter Plus Count`}
              showHeaderButton={true}
              closeModal={closeModal}
              headerButton={
                <Button
                  bg='primary'
                  mx='2'
                  px='10'
                  isDisabled={
                    (touched && Object.keys(touched).length === 0) ||
                    (errors && Object.keys(errors).length > 0)
                  }
                  onPress={() => {
                    handleSubmit()
                    closeModal()
                  }}
                >
                  <Text fontSize='xl' color='white'>
                    Save
                  </Text>
                </Button>
              }
            />
            <VStack space={5} paddingX='20' paddingTop='7' paddingBottom='3'>
              {/* <Heading fontSize='2xl'>
                {`You Counted ${'{#}'}${'{species}'}${'{run}'}.`}
              </Heading> */}
              <HStack space={6}>
                <FormControl w='31%'>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Species
                      </Text>
                    </FormControl.Label>

                    {touched.species &&
                      errors.species &&
                      renderErrorMessage(errors, 'species')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.species}
                    placeholder={'Species'}
                    onValueChange={handleChange('species')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={speciesDictionary}
                  />
                </FormControl>
                <FormControl w='31%'>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Life Stage
                      </Text>
                    </FormControl.Label>

                    {touched.lifeStage &&
                      errors.lifeStage &&
                      renderErrorMessage(errors, 'lifeStage')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.lifeStage}
                    placeholder={'Life stage'}
                    onValueChange={handleChange('lifeStage')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownValues.lifeStage.map(
                      (item: any) => ({
                        label: item.definition,
                        value: item.definition,
                      })
                    )}
                  />
                </FormControl>

                <FormControl w='31%'>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Run
                      </Text>
                    </FormControl.Label>

                    {touched.run &&
                      errors.run &&
                      renderErrorMessage(errors, 'run')}
                  </HStack>

                  <CustomSelect
                    selectedValue={values.run}
                    placeholder={'Run'}
                    onValueChange={handleChange('run')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownValues.run.map((item: any) => ({
                      label: item.definition,
                      value: item.definition,
                    }))}
                  />
                </FormControl>
              </HStack>
              <FormControl>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Count
                    </Text>
                  </FormControl.Label>

                  {touched.count &&
                    errors.count &&
                    renderErrorMessage(errors, 'count')}
                </HStack>
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Enter count'
                  keyboardType='numeric'
                  onChangeText={handleChange('count')}
                  onBlur={handleBlur('count')}
                  value={values.count}
                />
              </FormControl>

              <FormControl>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Plus Count Method
                    </Text>
                  </FormControl.Label>

                  {touched.plusCountMethod &&
                    errors.plusCountMethod &&
                    renderErrorMessage(errors, 'plusCountMethod')}
                </HStack>
                <CustomSelect
                  selectedValue={values.plusCountMethod}
                  placeholder={'Method'}
                  onValueChange={handleChange('plusCountMethod')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={dropdownValues?.plusCountMethodology.map((item: any) => ({
                    label: item.definition,
                    value: item.definition,
                  }))}
                />
              </FormControl>
            </VStack>
          </>
        )}
      </Formik>
    </ScrollView>
  )
}

export default PlusCountModalContent
