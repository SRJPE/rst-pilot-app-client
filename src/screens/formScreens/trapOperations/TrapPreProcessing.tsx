import { useState } from 'react'
import { Formik } from 'formik'
import {
  markTrapPreProcessingCompleted,
  saveTrapPreProcessing,
} from '../../../redux/reducers/formSlices/trapPreProcessingSlice'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  Text,
  FormControl,
  Heading,
  Input,
  VStack,
  HStack,
  Radio,
  View,
} from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'
import { trapPreProcessingSchema } from '../../../utils/helpers/yupValidations'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Keyboard } from 'react-native'
import renderErrorMessage from '../../../components/form/RenderErrorMessage'
import { markStepCompleted } from '../../../redux/reducers/formSlices/navigationSlice'

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.trapPreProcessing,
  }
}

const TrapPreProcessing = ({
  navigation,
  reduxState,
}: {
  navigation: any
  reduxState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = (values: any) => {
    dispatch(saveTrapPreProcessing(values))
    dispatch(markTrapPreProcessingCompleted(true))
    dispatch(markStepCompleted(true))
    console.log('🚀 ~ handleSubmit ~ TrapPreProcessing', values)
  }

  return (
    <Formik
      validationSchema={trapPreProcessingSchema}
      initialValues={reduxState.values}
      initialTouched={{ coneDepth: true }}
      initialErrors={reduxState.completed ? undefined : { coneDepth: '' }}
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
          <View
            flex={1}
            bg='#fff'
            p='6%'
            borderColor='themeGrey'
            borderWidth='15'
          >
            {/* <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            > */}
            <VStack space={10}>
              <Heading>Trap Pre-Processing</Heading>
              <FormControl w='1/2'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Cone Depth
                  </Text>
                </FormControl.Label>
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Numeric Value'
                  keyboardType='numeric'
                  onChangeText={handleChange('coneDepth')}
                  onBlur={handleBlur('coneDepth')}
                  value={values.coneDepth}
                />
                {touched.coneDepth &&
                  errors.coneDepth &&
                  renderErrorMessage(errors, 'coneDepth')}
              </FormControl>
              <FormControl w='30%'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Cone Setting
                  </Text>
                </FormControl.Label>
                <Radio.Group
                  name='coneSetting'
                  accessibilityLabel='cone setting'
                  value={`${values.coneSetting}`}
                  onChange={(value: any) => {
                    setFieldTouched('coneSetting', true)
                    if (value === 'full') {
                      setFieldValue('coneSetting', 'full')
                    } else {
                      setFieldValue('coneSetting', 'half')
                    }
                  }}
                >
                  <Radio colorScheme='primary' value='full' my={1}>
                    Full
                  </Radio>
                  <Radio colorScheme='primary' value='half' my={1}>
                    Half
                  </Radio>
                </Radio.Group>
                {touched.coneSetting &&
                  errors.coneSetting &&
                  renderErrorMessage(errors, 'coneSetting')}
              </FormControl>
              <FormControl w='1/2'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Total Revolutions
                  </Text>
                </FormControl.Label>
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Numeric Value'
                  keyboardType='numeric'
                  onChangeText={handleChange('totalRevolutions')}
                  onBlur={handleBlur('totalRevolutions')}
                  value={values.totalRevolutions}
                />
                {touched.totalRevolutions &&
                  errors.totalRevolutions &&
                  renderErrorMessage(errors, 'totalRevolutions')}
              </FormControl>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    RPM Before Cleaning
                  </Text>
                </FormControl.Label>
                <HStack space={8} justifyContent='space-between'>
                  <FormControl w='30%'>
                    <Input
                      height='50px'
                      fontSize='16'
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                      onChangeText={handleChange('rpm1')}
                      onBlur={handleBlur('rpm1')}
                      value={values.rpm1}
                    />
                    {touched.rpm1 &&
                      errors.rpm1 &&
                      renderErrorMessage(errors, 'rpm1')}
                    {/* {touched.rpm2 &&
                      (values.rpm2 > 2000 || values.rpm2 < 50) && (
                        <Text style={{ fontSize: 12, color: 'orange' }}>
                          VALUE OUT OF RANGE
                        </Text>
                      )} */}
                  </FormControl>
                  <FormControl w='30%'>
                    <Input
                      height='50px'
                      fontSize='16'
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                      onChangeText={handleChange('rpm2')}
                      onBlur={handleBlur('rpm2')}
                      value={values.rpm2}
                    />
                    {touched.rpm2 &&
                      errors.rpm2 &&
                      renderErrorMessage(errors, 'rpm2')}
                  </FormControl>
                  <FormControl w='30%'>
                    <Input
                      height='50px'
                      fontSize='16'
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                      onChangeText={handleChange('rpm3')}
                      onBlur={handleBlur('rpm3')}
                      value={values.rpm3}
                    />
                    {touched.rpm3 &&
                      errors.rpm3 &&
                      renderErrorMessage(errors, 'rpm3')}
                  </FormControl>
                </HStack>
                <Text color='grey' my='5' fontSize='17'>
                  Please take 3 separate measures of cone rotations per minute
                  before cleaning the trap.
                </Text>
              </FormControl>
              <Text color='black' fontSize='xl' alignSelf='center'>
                - Remove debris and begin fish processing -
              </Text>
            </VStack>
            {/* </TouchableWithoutFeedback> */}
          </View>
          <NavButtons
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

export default connect(mapStateToProps)(TrapPreProcessing)
