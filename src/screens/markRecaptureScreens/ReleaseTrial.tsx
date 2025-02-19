import React from 'react'
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
import { markActiveMarkRecaptureStepCompleted } from '../../redux/reducers/markRecaptureSlices/markRecaptureNavigationSlice'
import CustomSelect from '../../components/Shared/CustomSelect'
import FormInputComponent, {
  TextInputAdornment,
} from '../../components/Shared/FormInputComponent'

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

  const fishHoldingEqualsWildCount = (wildCount: string) => {
    return releaseTrialStore.totalFishHolding === Number(wildCount)
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
      initialValues={{
        ...releaseTrialStore.values,
        wildCount: releaseTrialStore?.totalFishHolding?.toString(),
      }}
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
                  <FormInputComponent
                    label='# of wild fish used in release trial'
                    onChangeText={handleChange('wildCount')}
                    onBlur={handleBlur('wildCount')}
                    value={values.wildCount}
                    placeholder='0'
                    touched={touched}
                    errors={errors}
                    camelName='wildCount'
                    showWarning={!fishHoldingEqualsWildCount(values.wildCount)}
                    warningMessage='This value does not match the previously confirmed value.'
                  />
                  <FormInputComponent
                    label='Dead Count (wild)'
                    onChangeText={handleChange('deadWildCount')}
                    onBlur={handleBlur('deadWildCount')}
                    value={values.deadWildCount}
                    placeholder='0'
                    touched={touched}
                    errors={errors}
                    camelName='deadWildCount'
                  />

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
                    <FormInputComponent
                      label='# of Hatchery Fish'
                      onChangeText={handleChange('hatcheryCount')}
                      onBlur={handleBlur('hatcheryCount')}
                      value={values.hatcheryCount}
                      placeholder='0'
                      touched={touched}
                      errors={errors}
                      camelName='hatcheryCount'
                    />

                    <CustomSelect
                      label='Run ID of Hatchery Fish'
                      camelName='runIDHatchery'
                      selectedValue={values.runIDHatchery}
                      placeholder='Select Run ID'
                      onValueChange={handleChange('runIDHatchery')}
                      setFieldTouched={() =>
                        setFieldTouched('runIDHatchery', true)
                      }
                      selectOptions={run}
                      touched={touched}
                      errors={errors}
                    />
                    <FormInputComponent
                      label=' Run Weight Count (provided by hatchery)'
                      onChangeText={handleChange('runWeightHatchery')}
                      onBlur={handleBlur('runWeightHatchery')}
                      value={values.runWeightHatchery}
                      placeholder='0'
                      touched={touched}
                      errors={errors}
                      camelName='runWeightHatchery'
                      RightElement={<TextInputAdornment text='g' />}
                    />
                    <FormInputComponent
                      label='Run Average Fork Length (provided by hatchery)'
                      onChangeText={handleChange('runForkLengthHatchery')}
                      onBlur={handleBlur('runForkLengthHatchery')}
                      value={values.runForkLengthHatchery}
                      placeholder='0'
                      touched={touched}
                      errors={errors}
                      camelName='runForkLengthHatchery'
                      RightElement={<TextInputAdornment text='mm' />}
                    />
                    <FormInputComponent
                      label='Dead Count (hatchery)'
                      onChangeText={handleChange('deadHatcheryCount')}
                      onBlur={handleBlur('deadHatcheryCount')}
                      value={values.deadHatcheryCount}
                      placeholder='0'
                      touched={touched}
                      errors={errors}
                      camelName='deadHatcheryCount'
                    />
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
