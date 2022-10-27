import { useEffect, useState } from 'react'
import { Formik } from 'formik'
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
  IconButton,
  Icon,
} from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'
import { trapPostProcessingSchema } from '../../../utils/helpers/yupValidations'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Keyboard } from 'react-native'
import renderErrorMessage from '../../../components/form/RenderErrorMessage'
import { markStepCompleted } from '../../../redux/reducers/formSlices/navigationSlice'
import {
  markTrapPostProcessingCompleted,
  saveTrapPostProcessing,
} from '../../../redux/reducers/formSlices/trapPostProcessingSlice'
import { Ionicons } from '@expo/vector-icons'

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.trapPostProcessing,
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
    dispatch(saveTrapPostProcessing(values))
    dispatch(markTrapPostProcessingCompleted(true))
    dispatch(markStepCompleted(true))
    console.log('🚀 ~ handleSubmit ~ TrapPostProcessing', values)
  }

  return (
    <Formik
      validationSchema={trapPostProcessingSchema}
      initialValues={reduxState.values}
      initialTouched={{ debrisVolume: true }}
      initialErrors={reduxState.completed ? undefined : { debrisVolume: '' }}
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldTouched,
        setFieldValue,
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
              // accessible={false}
            > */}
            <VStack space={10}>
              <Heading>Trap Post-Processing</Heading>
              <FormControl w='1/2'>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Debris Volume
                    </Text>
                  </FormControl.Label>
                  {touched.debrisVolume &&
                    errors.debrisVolume &&
                    renderErrorMessage(errors, 'debrisVolume')}
                </HStack>
                <Input
                  height='50px'
                  fontSize='16'
                  placeholder='Numeric Value'
                  keyboardType='numeric'
                  onChangeText={handleChange('debrisVolume')}
                  onBlur={handleBlur('debrisVolume')}
                  value={values.debrisVolume}
                />
                <Text
                  color='#A1A1A1'
                  position='absolute'
                  top={50}
                  right={4}
                  fontSize={16}
                >
                  {'L'}
                </Text>
              </FormControl>

              <FormControl>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      RPM After Cleaning
                    </Text>
                  </FormControl.Label>
                  {((touched.rpm1 && errors.rpm1) ||
                    (touched.rpm2 && errors.rpm2) ||
                    (touched.rpm3 && errors.rpm3)) && (
                    <HStack space={1}>
                      <Icon
                        marginTop={'.5'}
                        as={Ionicons}
                        name='alert-circle-outline'
                        color='error'
                      />
                      <Text style={{ fontSize: 14, color: '#b71c1c' }}>
                        All Three measurements are required
                      </Text>
                    </HStack>
                  )}
                </HStack>

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
                  </FormControl>
                </HStack>
                <Text color='grey' my='5' fontSize='17'>
                  Please take 3 separate measures of cone rotations per minute
                  before cleaning the trap.
                </Text>
                <Text color='grey' my='5' fontSize='17'>
                  SET TRAP LOCATION PLACEHOLDER
                </Text>
              </FormControl>
              <FormControl w='30%'>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Trap Status at End
                  </Text>
                </FormControl.Label>
                <Radio.Group
                  name='endingTrapStatus'
                  accessibilityLabel='Ending Trap Status'
                  value={`${values.endingTrapStatus}`}
                  onChange={(nextValue: any) => {
                    setFieldTouched('endingTrapStatus', true)
                    if (nextValue === 'Reset Trap') {
                      setFieldValue('endingTrapStatus', 'Reset Trap')
                    } else {
                      setFieldValue('endingTrapStatus', 'End Trapping')
                    }
                  }}
                >
                  <Radio colorScheme='primary' value='Reset Trap' my={1}>
                    Reset Trap
                  </Radio>
                  <Radio colorScheme='primary' value='End Trapping' my={1}>
                    End Trapping
                  </Radio>
                </Radio.Group>
              </FormControl>
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
