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
} from 'native-base'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { addMarksOrTagsSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import renderErrorMessage from './RenderErrorMessage'

const initialFormValues = {
  type: '',
  number: '',
  position: '',
  crewMemberTagging: '',
  comments: '',
}

const crewMemberDropdownOptions = [
  { label: 'Crew Member 1', value: 'Crew Member 1' },
  { label: 'Crew Member 2', value: 'Crew Member 2' },
  { label: 'Crew Member 3', value: 'Crew Member 3' },
  { label: 'Crew Member 4', value: 'Crew Member 4' },
  { label: 'Crew Member 5', value: 'Crew Member 5' },
]

const markTypeDictionary = [
  { label: 'No marks or tags', value: 'No marks or tags' },
  { label: 'Elastomer', value: 'Elastomer' },
  { label: 'Fin clip', value: 'Fin clip' },
  { label: 'Pigment / dye', value: 'Pigment / dye' },
  { label: 'Coded wire tag (CWT)', value: 'Coded wire tag (CWT)' },
  { label: 'Freeze brand (bar)', value: 'Freeze brand (bar)' },
  { label: 'Freeze brand (dot)', value: 'Freeze brand (dot)' },
  { label: 'PIT tag', value: 'PIT tag' },
  { label: 'Acoustic telemetry tag', value: 'Acoustic telemetry tag' },
  { label: 'Radio telemetry tag', value: 'Radio telemetry tag' },
  { label: 'Floy tag', value: 'Floy tag' },
  { label: 'Photonic Dye', value: 'Photonic Dye' },
  { label: 'Other', value: 'Other' },
  { label: 'Not recorded', value: 'Not recorded' },
  { label: 'Not applicable (n/a)', value: 'Not applicable (n/a)' },
  { label: 'Unknown', value: 'Unknown' },
  { label: 'See Comments', value: 'See Comments' },
  { label: 'Not yet assigned', value: 'Not yet assigned' },
]

const MarkFishModalContent = ({
  handleMarkFishFormSubmit,
  closeModal,
}: {
  handleMarkFishFormSubmit: any
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
              headerText={'Mark or Tag a Fish'}
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
            <VStack space={5} paddingX='10' paddingTop='7' paddingBottom='3'>
              <VStack w='full'>
                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Type
                      </Text>
                    </FormControl.Label>

                    {touched.type &&
                      errors.type &&
                      renderErrorMessage(errors, 'type')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.type}
                    placeholder={'Type'}
                    onValueChange={handleChange('type')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={dropdownValues.markType.map((item: any) => ({
                      label: item.definition,
                      value: item.definition,
                    }))}
                  />
                </FormControl>
              </VStack>

              <VStack w='full'>
                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Number
                      </Text>
                    </FormControl.Label>

                    {touched.number &&
                      errors.number &&
                      renderErrorMessage(errors, 'number')}
                  </HStack>
                  <Input
                    height='50px'
                    fontSize='16'
                    placeholder='Enter number'
                    keyboardType='numeric'
                    onChangeText={handleChange('number')}
                    onBlur={handleBlur('number')}
                    value={values.number}
                  />
                </FormControl>
              </VStack>

              <VStack w='full'>
                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Position
                      </Text>
                    </FormControl.Label>

                    {touched.position &&
                      errors.position &&
                      renderErrorMessage(errors, 'position')}
                  </HStack>

                  <CustomSelect
                    selectedValue={values.position}
                    placeholder={'Mark Position'}
                    onValueChange={handleChange('position')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={
                      dropdownValues.bodyPart
                        ? dropdownValues.bodyPart.map((item: any) => ({
                            label: item.definition,
                            value: item.definition,
                          }))
                        : []
                    }
                  />
                </FormControl>
              </VStack>

              <HStack alignItems='center'>
                <Icon
                  as={Ionicons}
                  name={'add-circle'}
                  size='3xl'
                  opacity={0.75}
                  color='primary'
                  marginRight='1'
                />
                <Text color='primary' fontSize='xl'>
                  Add another tag
                </Text>
              </HStack>

              <VStack w='full'>
                <FormControl>
                  <HStack space={4} alignItems='center'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Crew Member Tagging
                      </Text>
                    </FormControl.Label>

                    {touched.crewMemberTagging &&
                      errors.crewMemberTagging &&
                      renderErrorMessage(errors, 'crewMemberTagging')}
                  </HStack>
                  <CustomSelect
                    selectedValue={values.crewMemberTagging}
                    placeholder={'Crew Member'}
                    onValueChange={handleChange('crewMemberTagging')}
                    setFieldTouched={setFieldTouched}
                    selectOptions={crewMemberDropdownOptions}
                  />
                </FormControl>
              </VStack>

              <VStack w='full'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Comments
                  </Text>
                </FormControl.Label>
                <FormControl>
                  <Input
                    height='50px'
                    fontSize='16'
                    placeholder='Write a comment'
                    keyboardType='default'
                    onChangeText={handleChange('comments')}
                    onBlur={handleBlur('comments')}
                    value={values.comments}
                  />
                </FormControl>
              </VStack>
            </VStack>
          </>
        )}
      </Formik>
    </ScrollView>
  )
}

export default MarkFishModalContent
