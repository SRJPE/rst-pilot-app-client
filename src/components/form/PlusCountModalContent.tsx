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
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
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
const plusCountMethods = [
  { label: 'Method 1', value: 'Method 1', definition: 'Method 1' },
  { label: 'Method 2', value: ' Method 2', definition: 'Method 2' },
  { label: 'Method 3', value: ' Method 3', definition: 'Method 3' },
]

const PlusCountModalContent = ({
  handleMarkFishFormSubmit,
  closeModal,
}: {
  handleMarkFishFormSubmit?: any
  closeModal: any
}) => {
  const handleFormSubmit = (values: any) => console.log('Values: ', values)
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  return (
    <ScrollView>
      <Formik
        validationSchema={addPlusCountsSchema}
        initialValues={initialFormValues}
        onSubmit={values => handleFormSubmit(values)}
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
              <Heading fontSize='2xl'>
                {`You Counted ${'{#}'}${'{species}'}${'{run}'}.`}
              </Heading>
              <FormControl>
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
              <FormControl>
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
                  selectOptions={dropdownValues.lifeStage.map((item: any) => ({
                    label: item.definition,
                    value: item.definition,
                  }))}
                />
              </FormControl>

              <FormControl>
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
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Calculated from fork length (disabled)'
                  keyboardType='numeric'
                  onChangeText={handleChange('run')}
                  onBlur={handleBlur('run')}
                  value={values.run}
                />
              </FormControl>
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
                  selectOptions={plusCountMethods.map((item: any) => ({
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
