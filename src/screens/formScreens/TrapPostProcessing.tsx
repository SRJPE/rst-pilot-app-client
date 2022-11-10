import { Formik } from 'formik'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import {
  Text,
  FormControl,
  Heading,
  Input,
  VStack,
  HStack,
  Radio,
  Icon,
  Button,
  Pressable,
} from 'native-base'
import NavButtons from '../../components/formContainer/NavButtons'
import { trapPostProcessingSchema } from '../../utils/helpers/yupValidations'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Keyboard } from 'react-native'
import RenderErrorMessage from '../../components/Shared/RenderErrorMessage'
import { markStepCompleted } from '../../redux/reducers/formSlices/navigationSlice'
import {
  markTrapPostProcessingCompleted,
  saveTrapPostProcessing,
} from '../../redux/reducers/formSlices/trapPostProcessingSlice'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'
import RenderWarningMessage from '../../components/Shared/RenderWarningMessage'
import { QARanges } from '../../utils/utils'

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.trapPostProcessing,
  }
}

const TrapPostProcessing = ({
  navigation,
  reduxState,
}: {
  navigation: any
  reduxState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()

  const getCurrentLocation = (setFieldTouched: any, setFieldValue: any) => {
    ;(async () => {
      try {
        let currentLocation = await Location.getCurrentPositionAsync({})
        setFieldValue('trapLatitude', currentLocation.coords.latitude)
        setFieldValue('trapLongitude', currentLocation.coords.longitude)
        setFieldTouched('trapLatitude', true)
        setFieldTouched('trapLongitude', true)
      } catch (error) {
        console.error(error)
      }
    })()
  }

  const handleSubmit = (values: any) => {
    dispatch(saveTrapPostProcessing(values))
    dispatch(markTrapPostProcessingCompleted(true))
    dispatch(markStepCompleted([true]))
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
          <Pressable
            flex={1}
            bg='#fff'
            p='6%'
            borderColor='themeGrey'
            borderWidth='15'
            onPress={Keyboard.dismiss}
          >
            <VStack space={10}>
              <Heading>Trap Post-Processing</Heading>
              <FormControl w='1/2'>
                <HStack space={4} alignItems='center'>
                  <FormControl.Label>
                    <Text color='black' fontSize='xl'>
                      Debris Volume
                    </Text>
                  </FormControl.Label>
                  {Number(values.debrisVolume) > QARanges.debrisVolume.max &&
                    RenderWarningMessage()}
                  {touched.debrisVolume &&
                    errors.debrisVolume &&
                    RenderErrorMessage(errors, 'debrisVolume')}
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
                      <Text style={{ fontSize: 16, color: '#b71c1c' }}>
                        All Three measurements are required
                      </Text>
                    </HStack>
                  )}
                </HStack>

                <HStack space={8} justifyContent='space-between'>
                  <FormControl w='30%'>
                    <VStack space={3}>
                      <Input
                        height='50px'
                        fontSize='16'
                        placeholder='Numeric Value'
                        keyboardType='numeric'
                        onChangeText={handleChange('rpm1')}
                        onBlur={handleBlur('rpm1')}
                        value={values.rpm1}
                      />
                      {/* {console.log('123123123', Number(values.rpm1))}
                      {console.log('098797890', Number(QARanges.RPM.max))}
                      {console.log(
                        '&&&&&&&&',
                        Number(values.rmp1) > Number(QARanges.RPM.max)
                      )} */}
                      {Number(values.rmp1) > 30 ? (
                        RenderWarningMessage()
                      ) : (
                        <></>
                      )}
                    </VStack>
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
                    {Number(values.rmp2) > QARanges.RPM.max &&
                      RenderWarningMessage()}
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
                    {Number(values.rmp3) > QARanges.RPM.max &&
                      RenderWarningMessage()}
                  </FormControl>
                </HStack>
                <Text color='grey' my='5' fontSize='17'>
                  Please take 3 separate measures of cone rotations per minute
                  before cleaning the trap.
                </Text>

                <HStack space={3} alignItems='center' mt='5'>
                  <Button
                    w='1/2'
                    bg='primary'
                    px='10'
                    isDisabled={true}
                    onPress={() => {
                      getCurrentLocation(setFieldTouched, setFieldValue)
                    }}
                  >
                    <Text fontSize='xl' color='white'>
                      Drop Pin at Current Location
                    </Text>
                  </Button>
                  {values.trapLatitude && (
                    <HStack space={3}>
                      <Text fontSize='xl' color='black'>
                        {`Lat: ${values.trapLatitude}`}
                      </Text>
                      <Text fontSize='xl' color='black'>
                        {`Long: ${values.trapLongitude}`}
                      </Text>
                    </HStack>
                  )}
                </HStack>
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
                    if (nextValue === 'Restart Trap') {
                      setFieldValue('endingTrapStatus', 'Restart Trap')
                    } else {
                      setFieldValue('endingTrapStatus', 'End Trapping')
                    }
                  }}
                >
                  <Radio
                    colorScheme='primary'
                    value='Restart Trap'
                    my={1}
                    _icon={{ color: 'primary' }}
                  >
                    Restart Trap
                  </Radio>
                  <Radio
                    colorScheme='primary'
                    value='End Trapping'
                    my={1}
                    _icon={{ color: 'primary' }}
                  >
                    End Trapping
                  </Radio>
                </Radio.Group>
              </FormControl>
            </VStack>
          </Pressable>
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

export default connect(mapStateToProps)(TrapPostProcessing)
