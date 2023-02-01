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
  Divider,
} from 'native-base'

import { Linking, Alert } from 'react-native'
import { connect, useDispatch, useSelector } from 'react-redux'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import { addGeneticsSampleSchema } from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import RenderErrorMessage from '../Shared/RenderErrorMessage'

const initialFormValues = {
  sampleIdNumber: '',
  mucusSwabCollected: false,
  finClipCollected: false,
  crewMemberCollectingSample: '',
  comments: '',
}

const AddGeneticsModalContent = ({
  handleGeneticSampleFormSubmit,
  closeModal,
  crewMembers,
}: {
  handleGeneticSampleFormSubmit: any
  closeModal: any
  crewMembers: Array<any>
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const connectivityState = useSelector((state: any) => state.connectivity)

  const handleFormSubmit = (values: any) => {
    handleGeneticSampleFormSubmit(values)
    showSlideAlert(dispatch, 'Genetic sample')
  }

  const OpenURLButton = () => {
    if (connectivityState.isConnected === true) {
      Linking.openURL('https://gvl.ucdavis.edu/protocols')
    } else {
      Alert.alert(`No Network Connection`)
    }
  }

  return (
    <ScrollView>
      <Formik
        validationSchema={addGeneticsSampleSchema}
        initialValues={initialFormValues}
        onSubmit={(values) => {
          console.log('🚀 ~  Genetic Sample values', values)
          handleFormSubmit(values)
        }}
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
                  shadow='3'
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
            <>
              <Divider my={2} thickness='3' />
              <VStack paddingX='10' paddingTop='3' paddingBottom='10'>
                <HStack justifyContent='space-between' marginBottom='5'>
                  <Button
                    bg='primary'
                    flex={1}
                    marginRight={5}
                    height='50px'
                    fontSize='16'
                    shadow='3'
                    isDisabled={true}
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
                    shadow='3'
                    isDisabled={connectivityState.isConnected !== true}
                    onPress={() => {
                      OpenURLButton()
                    }}
                  >
                    <Text fontSize='xl' color='primary'>
                      Watch Video
                    </Text>
                  </Button>
                </HStack>

                <HStack>
                  <VStack space={4} w='1/2' paddingRight='5'>
                    <FormControl>
                      <HStack space={4} alignItems='center'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Sample ID Number:
                          </Text>
                        </FormControl.Label>

                        {touched.sampleIdNumber &&
                          errors.sampleIdNumber &&
                          RenderErrorMessage(errors, 'sampleIdNumber')}
                      </HStack>
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

                    <FormControl>
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
                        <Radio
                          colorScheme='primary'
                          value='true'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          Yes
                        </Radio>
                        <Radio
                          colorScheme='primary'
                          value='false'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          No
                        </Radio>
                      </Radio.Group>
                    </FormControl>

                    <FormControl>
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
                        <Radio
                          colorScheme='primary'
                          value='true'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          Yes
                        </Radio>
                        <Radio
                          colorScheme='primary'
                          value='false'
                          my={1}
                          _icon={{ color: 'primary' }}
                        >
                          No
                        </Radio>
                      </Radio.Group>
                    </FormControl>

                    <FormControl>
                      <HStack space={4} alignItems='center'>
                        <FormControl.Label>
                          <Text color='black' fontSize='xl'>
                            Crew Member Collecting Samples
                          </Text>
                        </FormControl.Label>

                        {touched.crewMemberCollectingSample &&
                          errors.crewMemberCollectingSample &&
                          RenderErrorMessage(
                            errors,
                            'crewMemberCollectingSample'
                          )}
                      </HStack>
                      <CustomSelect
                        selectedValue={values.crewMemberCollectingSample}
                        placeholder={'Crew Member'}
                        onValueChange={handleChange(
                          'crewMemberCollectingSample'
                        )}
                        setFieldTouched={setFieldTouched}
                        selectOptions={
                          crewMembers.length
                            ? crewMembers.map((item: any) => ({
                                label: item,
                                value: item,
                              }))
                            : [
                                {
                                  label: 'No crew members found',
                                  value: 'null',
                                },
                              ]
                        }
                      />
                    </FormControl>
                  </VStack>

                  {/* <View w='1/2' h='full' paddingLeft='5'>
                    <Box w='full' borderWidth='2' borderColor='grey'>
                      <VStack alignItems='center'>
                        <Text fontSize='xl' marginBottom='2'>
                          Sampling Bin Progress:
                        </Text>
                        <Divider marginBottom='10' />
                      </VStack>
                    </Box>
                  </View> */}
                </HStack>

                <FormControl mt='2'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Comments
                    </Text>
                  </FormControl.Label>
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
            </>
          </>
        )}
      </Formik>
    </ScrollView>
  )
}
const mapStateToProps = (state: RootState) => {
  return {
    crewMembers: state.visitSetup.values.crew,
  }
}

export default connect(mapStateToProps)(AddGeneticsModalContent)
