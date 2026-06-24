import { Formik } from 'formik'
import {
  Button,
  FormControl,
  HStack,
  Radio,
  ScrollView,
  Text,
  VStack,
} from 'native-base'
import { Alert, Linking } from 'react-native'
import { connect, useDispatch, useSelector } from 'react-redux'
import { showSlideAlert } from '../../redux/reducers/slideAlertSlice'
import { AppDispatch, RootState } from '../../redux/store'
import {
  addGeneticsSampleSchema,
  generateDynamicGeneticsSchema,
} from '../../utils/helpers/yupValidations'
import CustomModalHeader from '../Shared/CustomModalHeader'
import CustomSelect from '../Shared/CustomSelect'
import FormInputComponent from '../Shared/FormInputComponent'
import { formatGeneticsSampleId } from '../../utils/utils'
import { useEffect, useState } from 'react'
import ConditionalGeneticsFields from './ConditionalGeneticsFields'

const AddGeneticsModalContent = ({
  handleGeneticSampleFormSubmit,
  closeModal,
  crewMembers,
  previousGeneticSamples,
  species,
  reorderedTaxon,
  fishStore,
  trapOperationsState,
  selectedProgramObj,
  dropdownValues,
  activeTabId,
  fishRunValue,
  fishAdiposeClippedValue,
}: {
  handleGeneticSampleFormSubmit: any
  closeModal: any
  crewMembers: Array<any>
  previousGeneticSamples: Array<any>
  species: any
  reorderedTaxon: any
  fishStore: any
  trapOperationsState: any
  selectedProgramObj: any
  dropdownValues: any
  activeTabId: string
  fishRunValue?: string
  fishAdiposeClippedValue?: boolean
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const connectivityState = useSelector((state: any) => state.connectivity)
  const [initialFormValues, setInitialFormValues] = useState({
    sampleId: '',
    mucusSwab: false,
    finClip: false,
    crewMember: '',
    comments: '',
  })

  const [sectionFormFields, setSectionFormFields] = useState<any[]>([])
  const [validationSchema, setValidationSchema] = useState<any>(null)

  useEffect(() => {
    if (selectedProgramObj) {
      if (selectedProgramObj?.programFormFields?.length) {
        const geneticsFields = selectedProgramObj?.programFormFields.filter(
          (formField: any) => {
            return formField?.formSection === 'Genetics'
          }
        )
        setSectionFormFields(geneticsFields)
        const dynamicGeneticsSchema =
          generateDynamicGeneticsSchema(geneticsFields)
        setValidationSchema(dynamicGeneticsSchema)
      } else {
        setSectionFormFields([])
        setValidationSchema(addGeneticsSampleSchema)
      }
    }
  }, [selectedProgramObj.programFormFields])

  useEffect(() => {
    const fishStoreGeneticSamples = [] as any[]
    if (fishStore && Object.keys(fishStore).length > 0) {
      Object.keys(fishStore).forEach(key => {
        const fishData = fishStore[key]
        if (
          fishData &&
          fishData.geneticSamples &&
          fishData.geneticSamples.length > 0
        ) {
          fishStoreGeneticSamples.push(...fishData.geneticSamples)
        }
      })
    }

    const combinedGeneticSamples = [
      ...previousGeneticSamples,
      ...fishStoreGeneticSamples,
    ]

    if (species.value) {
      const defaultSampleIDNumber = formatGeneticsSampleId({
        programName: selectedProgramObj.programName,
        geneticSamplesArray: combinedGeneticSamples,
        species: species.value,
        taxonArray: reorderedTaxon,
        fishRunValue: fishRunValue,
        fishAdiposeClippedValue: fishAdiposeClippedValue,
        trapOperationsState,
        activeTabId,
      })
      console.log('🚀 ~ defaultSampleIDNumber', defaultSampleIDNumber)
      if (defaultSampleIDNumber) {
        setInitialFormValues({
          ...initialFormValues,
          sampleId: defaultSampleIDNumber,
        })
      }
    }
  }, [previousGeneticSamples, species])

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
        validationSchema={validationSchema}
        initialValues={initialFormValues}
        enableReinitialize={true}
        onSubmit={values => {
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
              showHeaderButton={false}
              closeModal={closeModal}
            />
            <>
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
                  <VStack space={4} w='100%' paddingRight='5'>
                    <FormInputComponent
                      camelName='sampleId'
                      value={values.sampleId}
                      touched={touched}
                      errors={errors}
                      placeholder='00000000'
                      label='Sample ID Number'
                      onChangeText={handleChange('sampleId')}
                      onBlur={handleBlur('sampleId')}
                    />

                    <ConditionalGeneticsFields
                      touched={touched}
                      errors={errors}
                      values={values}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      setFieldTouched={setFieldTouched}
                      dropdownValues={dropdownValues}
                      activePage={'Genetics'}
                      formFields={sectionFormFields}
                      setFieldValue={setFieldValue}
                      activeTabId={activeTabId}
                      validationSchema={addGeneticsSampleSchema}
                    />

                    <FormControl>
                      <FormControl.Label>
                        <Text color='black' fontSize='md'>
                          Confirm Mucus Swab Collected
                        </Text>
                      </FormControl.Label>
                      <Radio.Group
                        name='mucusSwab'
                        accessibilityLabel='Mucus Swab Collected'
                        value={`${values.mucusSwab}`}
                        onChange={(value: any) => {
                          if (value === 'true') {
                            setFieldValue('mucusSwab', true)
                          } else {
                            setFieldValue('mucusSwab', false)
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
                        <Text color='black' fontSize='md'>
                          Fin Clip Collected
                        </Text>
                      </FormControl.Label>
                      <Radio.Group
                        name='finClip'
                        accessibilityLabel='Fin Clip Collected'
                        value={`${values.finClip}`}
                        onChange={(value: any) => {
                          if (value === 'true') {
                            setFieldValue('finClip', true)
                          } else {
                            setFieldValue('finClip', false)
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

                    <CustomSelect
                      label='Crew Member'
                      camelName='crewMember'
                      touched={touched}
                      errors={errors}
                      selectedValue={values.crewMember}
                      placeholder={'Select Crew Member'}
                      // onValueChange={handleChange('crewMember')}
                      onValueChange={(itemValue: string) => {
                        setFieldValue('crewMember', itemValue).then(() => {
                          setFieldTouched('crewMember', true)
                        })
                      }}
                      // setFieldTouched={() => setFieldTouched('crewMember')}
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
                <FormInputComponent
                  camelName='comments'
                  value={values.comments}
                  touched={touched}
                  errors={errors}
                  placeholder='Write a comment'
                  label='Comments (optional)'
                  multiline={true}
                  onChangeText={handleChange('comments')}
                  onBlur={handleBlur('comments')}
                />
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
              </VStack>
            </>
          </>
        )}
      </Formik>
    </ScrollView>
  )
}
const mapStateToProps = (state: RootState) => {
  const activeTabId = state.tabSlice.activeTabId || 'placeholderId'
  let filteredResponses = [] as any[]

  if (activeTabId) {
    const programId = state.visitSetup[activeTabId].values.programId
    const responses = [] as any[]

    state.trapVisitFormPostBundler.previousCatchRawSubmissions.forEach(
      (item: any) => {
        if (item?.createdGeneticSamplingDataResponse) {
          responses.push(...item?.createdGeneticSamplingDataResponse)
        }
      }
    )
    // Filter responses by programId
    filteredResponses = responses.filter((response: any) => {
      return response?.programId === programId
    })
  }

  return {
    crewMembers: state.visitSetup?.[activeTabId]?.values.crew,
    previousGeneticSamples: filteredResponses,
    addGeneticSamples: state.addGeneticSamples,
    fishStore: state.fishInput?.[activeTabId]?.fishStore,
    visitSetupState: state.visitSetup?.[activeTabId]?.values,
    trapOperationsState: state.trapOperations,
  }
}

export default connect(mapStateToProps)(AddGeneticsModalContent)
