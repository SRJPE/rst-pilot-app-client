import Ionicons from '@expo/vector-icons/Ionicons'
import { Formik } from 'formik'
import {
  FormControl,
  HStack,
  Icon,
  Input,
  ScrollView,
  VStack,
  Text,
  Button,
  Heading,
} from 'native-base'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { addMarksOrTagsSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'

const initialFormValues = {
  count: '',
  plusCountMethod: '',
}

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
  const handleFormSubmit = (values: any) => handleMarkFishFormSubmit(values)
  const dropdownValues = useSelector(
    (state: RootState) => state.dropdowns.values
  )

  return (
    <ScrollView>
      <Formik
        validationSchema={addMarksOrTagsSchema}
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
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Count
                  </Text>
                </FormControl.Label>
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
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Plus Count Method
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.plusCountMethod}
                  placeholder={'Type'}
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
