import { useState } from 'react'
import { Formik } from 'formik'
import {
  markTrapOperationsCompleted,
  saveTrapOperations,
} from '../../../redux/reducers/trapOperationsSlice'
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
  Checkbox,
  WarningOutlineIcon,
  View,
} from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'
import { trapOperationsSchema } from '../../../utils/helpers/yupValidations'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Keyboard } from 'react-native'
import renderErrorMessage from '../../../components/form/RenderErrorMessage'
import { markStepCompleted } from '../../../redux/reducers/navigationSlice'

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.trapOperations,
  }
}

const TrapOperations = ({
  navigation,
  reduxState,
}: {
  navigation: any
  reduxState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [checked, setChecked] = useState(reduxState.values.checked as string)
  const [coneSetting, setConeSetting] = useState(
    reduxState.values.coneSetting as string
  )

  const handleSubmit = (values: any) => {
    values.checked = checked
    values.coneSetting = coneSetting
    dispatch(saveTrapOperations(values))
    dispatch(markTrapOperationsCompleted(true))
    dispatch(markStepCompleted(true))
    console.log('🚀 ~ handleSubmit ~ Operations', values)
  }

  return (
    <Formik
      validationSchema={trapOperationsSchema}
      initialValues={reduxState.values}
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
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
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
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
                    value={coneSetting}
                    onChange={(nextValue: any) => {
                      setConeSetting(nextValue)
                    }} // TODO: change to primary color
                  >
                    <Radio colorScheme='primary' value='Full' my={1}>
                      Full
                    </Radio>
                    <Radio colorScheme='primary' value='Half' my={1}>
                      Half
                    </Radio>
                  </Radio.Group>
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size='xs' />}
                  >
                    You must select a Prize.
                  </FormControl.ErrorMessage>
                </FormControl>
                <HStack space={6} alignItems='center'>
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
                  </FormControl>
                  <FormControl w='1/2'>
                    <HStack space={4} alignItems='center' pt='6'>
                      <Checkbox //this component currently has bugs
                        shadow={2}
                        onChange={(newValue: any) => setChecked(newValue)}
                        colorScheme='emerald' // TODO: change to primary color
                        value={checked}
                        accessibilityLabel='Collect total revolutions after fish processing Checkbox'
                      />
                      <FormControl.Label>
                        <Text color='black' fontSize='14'>
                          Collect total revolutions after fish processing
                        </Text>
                      </FormControl.Label>
                    </HStack>
                  </FormControl>
                </HStack>
                <FormControl>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      RPM Before Cleaning
                    </Text>
                  </FormControl.Label>
                  {/* <Text color='grey' my='5' fontSize='17'>
                    Please take 3 separate measures of cone rotations per minute
                    before cleaning the trap.
                  </Text> */}
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
            </TouchableWithoutFeedback>
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

export default connect(mapStateToProps)(TrapOperations)
