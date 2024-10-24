import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Icon,
  Input,
  Radio,
  Text,
  View,
  VStack,
  ScrollView,
} from 'native-base'
import MarkRecaptureNavButtons from '../../components/markRecapture/MarkRecaptureNavButtons'
import { Formik } from 'formik'
import { AppDispatch, RootState } from '../../redux/store'
import { connect, useDispatch, useSelector } from 'react-redux'
import { releaseTrialSchema } from '../../utils/helpers/yupValidations'
import {
  markReleaseTrialCompleted,
  saveReleaseTrial,
} from '../../redux/reducers/markRecaptureSlices/releaseTrialSlice'
import renderErrorMessage from '../../components/Shared/RenderErrorMessage'
import { markActiveMarkRecaptureStepCompleted } from '../../redux/reducers/markRecaptureSlices/markRecaptureNavigationSlice'
import CustomSelect from '../../components/Shared/CustomSelect'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'

const mapStateToProps = (state: RootState) => {
  return {
    releaseTrialStore: state.releaseTrial,
  }
}

const ReleaseTrial = ({
  navigation,
  releaseTrialStore,
}: {
  navigation: any
  releaseTrialStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const { run } = dropdownValues.values

  const compareFishHoldingToWildCount = (wildCount: string) => {
    const message = `This value does not match the \npreviously confirmed value.`
    if (releaseTrialStore.totalFishHolding !== Number(wildCount)) {
      return <RenderWarningMessage messageToRender={message} />
    }
  }

  const handleSubmit = (values: any) => {
    dispatch(saveReleaseTrial(values))
    dispatch(markReleaseTrialCompleted(true))
    dispatch(markActiveMarkRecaptureStepCompleted(true))
    console.log('🚀 ~ handleSubmit ~ ReleaseTrial', values)
  }

  return (
    <Formik
      validationSchema={releaseTrialSchema}
      initialValues={releaseTrialStore.values}
      validateOnMount={false}
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      initialTouched={{
        willSupplement: false,
        wildCount: false,
        deadWildCount: false,
      }}
      onSubmit={values => {
        handleSubmit(values)
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
          <ScrollView flex={1} bg='themeGrey'>
            <VStack space={8} p='10'>
              <Box bg='#FFF'>
                <Center
                  bg='primary'
                  _text={{
                    alignSelf: 'flex-start',
                    color: '#FFF',
                    fontWeight: '700',
                    fontSize: 'xl',
                  }}
                  bottom='0'
                  px='3'
                  py='1.5'
                >
                  RELEASE TRIAL - WILD
                </Center>
                <VStack py='2%' px='4%' space={4}>
                  <FormControl>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Confirm number of wild fish used in release trial
                      </Text>
                    </FormControl.Label>
                    <HStack space={4}>
                      <Input
                        w='1/2'
                        height='50px'
                        fontSize='16'
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={handleChange('wildCount')}
                        onBlur={handleBlur('wildCount')}
                        value={`${values.wildCount}`}
                      />
                      {touched.wildCount &&
                        compareFishHoldingToWildCount(values.wildCount)}
                    </HStack>
                    {touched.wildCount &&
                      errors.wildCount &&
                      renderErrorMessage(errors, 'wildCount')}
                  </FormControl>
                  <FormControl w='1/2'>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Dead Count (wild)
                      </Text>
                    </FormControl.Label>
                    <Input
                      height='50px'
                      fontSize='16'
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                      onChangeText={handleChange('deadWildCount')}
                      onBlur={handleBlur('deadWildCount')}
                      value={`${values.deadWildCount}`}
                    />
                    {touched.deadWildCount &&
                      errors.deadWildCount &&
                      renderErrorMessage(errors, 'deadWildCount')}
                  </FormControl>
                  <HStack space={4}>
                    <FormControl>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Will you supplement with hatchery fish?{' '}
                        </Text>
                      </FormControl.Label>
                      <Radio.Group
                        name='willSupplement'
                        accessibilityLabel='Will supplement with hatchery?'
                        value={`${values.willSupplement}`}
                        onChange={(value: any) => {
                          if (value === 'true') {
                            setFieldValue('willSupplement', true)
                          } else {
                            setFieldValue('willSupplement', false)
                          }
                        }}
                      >
                        <Radio colorScheme='primary' value='true' my={1}>
                          Yes
                        </Radio>
                        <Radio colorScheme='primary' value='false' my={1}>
                          No
                        </Radio>
                      </Radio.Group>
                    </FormControl>
                  </HStack>
                </VStack>
              </Box>
              {values.willSupplement && (
                <Box bg='#FFF'>
                  <Center
                    bg='primary'
                    _text={{
                      alignSelf: 'flex-start',
                      color: '#FFF',
                      fontWeight: '700',
                      fontSize: 'xl',
                    }}
                    bottom='0'
                    px='3'
                    py='1.5'
                  >
                    RELEASE TRIAL - HATCHERY
                  </Center>
                  <VStack py='2%' px='4%' space={4}>
                    <FormControl>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Number of Hatchery Fish
                        </Text>
                      </FormControl.Label>
                      <Input
                        w='1/2'
                        height='50px'
                        fontSize='16'
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={handleChange('hatcheryCount')}
                        onBlur={handleBlur('hatcheryCount')}
                        value={values.hatcheryCount}
                      />
                      {touched.hatcheryCount &&
                        errors.hatcheryCount &&
                        renderErrorMessage(errors, 'hatcheryCount')}
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Run ID of Hatchery Fish
                        </Text>
                      </FormControl.Label>
                      <CustomSelect
                        selectedValue={values.runIDHatchery}
                        placeholder='Run ID'
                        onValueChange={handleChange('runIDHatchery')}
                        setFieldTouched={setFieldTouched}
                        selectOptions={run}
                      />
                      {touched.runIDHatchery &&
                        errors.runIDHatchery &&
                        renderErrorMessage(errors, 'runIDHatchery')}
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Run Weight Count (provided by hatchery)
                        </Text>
                      </FormControl.Label>
                      <Input
                        w='1/2'
                        height='50px'
                        fontSize='16'
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={handleChange('runWeightHatchery')}
                        onBlur={handleBlur('runWeightHatchery')}
                        value={values.runWeightHatchery}
                      />
                      {touched.runWeightHatchery &&
                        errors.runWeightHatchery &&
                        renderErrorMessage(errors, 'runWeightHatchery')}
                    </FormControl>
                    <FormControl>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Run Average Fork Length (provided by hatchery)
                        </Text>
                      </FormControl.Label>
                      <Input
                        w='1/2'
                        height='50px'
                        fontSize='16'
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={handleChange('runForkLengthHatchery')}
                        onBlur={handleBlur('runForkLengthHatchery')}
                        value={values.runForkLengthHatchery}
                      />
                      {touched.runForkLengthHatchery &&
                        errors.runForkLengthHatchery &&
                        renderErrorMessage(errors, 'runForkLengthHatchery')}
                    </FormControl>
                    <FormControl w='1/2'>
                      <FormControl.Label>
                        <Text color='black' fontSize='xl'>
                          Dead Count (hatchery)
                        </Text>
                      </FormControl.Label>
                      <Input
                        height='50px'
                        fontSize='16'
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={handleChange('deadHatcheryCount')}
                        onBlur={handleBlur('deadHatcheryCount')}
                        value={values.deadHatcheryCount}
                      />
                      {touched.deadHatcheryCount &&
                        errors.deadHatcheryCount &&
                        renderErrorMessage(errors, 'deadHatcheryCount')}
                    </FormControl>
                  </VStack>
                </Box>
              )}
            </VStack>
          </ScrollView>
          <MarkRecaptureNavButtons
            navigation={navigation}
            handleSubmit={handleSubmit}
            errors={errors}
            touched={touched}
          />
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(ReleaseTrial)
