import { Formik } from 'formik'
import {
  FormControl,
  HStack,
  Input,
  ScrollView,
  VStack,
  Text,
  Button,
  Radio,
  Box,
  View,
  Divider,
} from 'native-base'
import React from 'react'
import { addGeneticsSampleSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'

const initialFormValues = {
  sampleIdNumber: '',
  mucusSwabCollected: false,
  finClipCollected: false,
  crewMemberCollectingSample: '',
  comments: '',
}

const crewMemberDropdownOptions = [
  { label: 'Crew Member 1', value: 'Crew Member 1' },
  { label: 'Crew Member 2', value: 'Crew Member 2' },
  { label: 'Crew Member 3', value: 'Crew Member 3' },
  { label: 'Crew Member 4', value: 'Crew Member 4' },
  { label: 'Crew Member 5', value: 'Crew Member 5' },
]

const AddGeneticsModalContent = ({
  handleGeneticSampleFormSubmit,
  closeModal,
}: {
  handleGeneticSampleFormSubmit: any
  closeModal: any
}) => {
  const handleFormSubmit = (values: any) =>
    handleGeneticSampleFormSubmit(values)

  return (
    <ScrollView>
      <Formik
        validationSchema={addGeneticsSampleSchema}
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
              headerText={'Collect a genetic sample'}
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
            <VStack paddingX='10' paddingTop='7' paddingBottom='10'>
              <HStack justifyContent='space-between' marginBottom='5'>
                <Button
                  bg='primary'
                  flex={1}
                  marginRight={5}
                  height='50px'
                  fontSize='16'
                >
                  <Text fontSize='xl' color='white'>
                    View Genetic Sampling Protocols
                  </Text>
                </Button>

                <Button
                  bg='secondary'
                  flex={1}
                  marginLeft={5}
                  height='50px'
                  fontSize='16'
                >
                  <Text fontSize='xl' color='primary'>
                    Watch Video
                  </Text>
                </Button>
              </HStack>

              <HStack>
                <VStack w='1/2' paddingRight='5'>
                  <VStack w='full' marginBottom={5}>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Sample ID Number:
                      </Text>
                    </FormControl.Label>
                    <FormControl>
                      <Input
                        height='50px'
                        fontSize='16'
                        placeholder='Write a comment'
                        keyboardType='default'
                        onChangeText={handleChange('sampleIdNumber')}
                        onBlur={handleBlur('sampleIdNumber')}
                        value={values.sampleIdNumber}
                      />
                    </FormControl>
                  </VStack>

                  <VStack w='full' marginBottom={5}>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Confirm Mucus Swab Collected
                      </Text>
                    </FormControl.Label>
                    <Radio.Group
                      name='mucusSwabCollected'
                      accessibilityLabel='Mucus Swab Collected'
                      value={`${values.mucusSwabCollected}`}
                      onChange={(value: any) => {
                        if (value === 'true') {
                          setFieldValue('mucusSwabCollected', true)
                        } else {
                          setFieldValue('mucusSwabCollected', false)
                        }
                      }}
                    >
                      <Radio colorScheme='primary' value='true' my={1}>
                        True
                      </Radio>
                      <Radio colorScheme='primary' value='false' my={1}>
                        False
                      </Radio>
                    </Radio.Group>
                  </VStack>

                  <VStack w='full' marginBottom={5}>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Fin Clip Collected
                      </Text>
                    </FormControl.Label>
                    <Radio.Group
                      name='finClipCollected'
                      accessibilityLabel='Fin Clip Collected'
                      value={`${values.finClipCollected}`}
                      onChange={(value: any) => {
                        if (value === 'true') {
                          setFieldValue('finClipCollected', true)
                        } else {
                          setFieldValue('finClipCollected', false)
                        }
                      }}
                    >
                      <Radio colorScheme='primary' value='true' my={1}>
                        True
                      </Radio>
                      <Radio colorScheme='primary' value='false' my={1}>
                        False
                      </Radio>
                    </Radio.Group>
                  </VStack>

                  <VStack w='full' marginBottom={5}>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Crew Member Collecting Samples
                      </Text>
                    </FormControl.Label>
                    <FormControl>
                      <CustomSelect
                        selectedValue={values.crewMemberCollectingSample}
                        placeholder={'Crew Member'}
                        onValueChange={handleChange(
                          'crewMemberCollectingSample'
                        )}
                        setFieldTouched={setFieldTouched}
                        selectOptions={crewMemberDropdownOptions}
                      />
                    </FormControl>
                  </VStack>
                </VStack>

                <View w='1/2' h='full' paddingLeft='5'>
                  <Box w='full' borderWidth='2' borderColor='black'>
                    <VStack alignItems='center'>
                      <Text fontSize='xl' marginBottom='2'>
                        Sampling Bin Progress:
                      </Text>
                      <Divider marginBottom='10' />
                    </VStack>
                  </Box>
                </View>
              </HStack>

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

export default AddGeneticsModalContent
