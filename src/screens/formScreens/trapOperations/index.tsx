import { useState } from 'react'
import { Formik } from 'formik'
import {
  markTrapOperationsCompleted,
  saveTrapOperations,
} from '../../../redux/reducers/trapOperationsSlice'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  Box,
  Text,
  FormControl,
  Heading,
  Input,
  VStack,
  HStack,
  Radio,
  Checkbox,
  WarningOutlineIcon,
} from 'native-base'
import NavButtons from '../../../components/formContainer/NavButtons'

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
    console.log('🚀 ~ TrapStatus ~ values', values)
  }

  return (
    <Formik
      // validationSchema={{ test: '' }}
      initialValues={reduxState.values}
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <>
          <Box h='90%' bg='#fff' p='10%'>
            <VStack space={8}>
              <Heading>Trap Pre-Processing</Heading>
              <FormControl w='1/2'>
                <FormControl.Label>Cone Depth</FormControl.Label>
                <Input
                  placeholder='Numeric Value'
                  keyboardType='numeric'
                  onChangeText={handleChange('coneDepth')}
                  onBlur={handleBlur('coneDepth')}
                  value={values.coneDepth}
                />
              </FormControl>
              <FormControl w='1/4'>
                <FormControl.Label>Cone Setting</FormControl.Label>
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
                  <FormControl.Label>Total Revolutions</FormControl.Label>
                  <Input
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
                      Collect total revolutions after fish processing
                    </FormControl.Label>
                  </HStack>
                </FormControl>
              </HStack>
              <FormControl>
                <FormControl.Label>RPM Before Cleaning</FormControl.Label>
                <HStack space={8} justifyContent='space-between'>
                  <FormControl w='1/4'>
                    <FormControl.Label>Measurement 1</FormControl.Label>
                    <Input
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                      onChangeText={handleChange('rpm1')}
                      onBlur={handleBlur('rpm1')}
                      value={values.rpm1}
                    ></Input>
                  </FormControl>
                  <FormControl w='1/4'>
                    <FormControl.Label>Measurement 2</FormControl.Label>
                    <Input
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                      onChangeText={handleChange('rpm2')}
                      onBlur={handleBlur('rpm2')}
                      value={values.rpm2}
                    ></Input>
                  </FormControl>
                  <FormControl w='1/4'>
                    <FormControl.Label>Measurement 3</FormControl.Label>
                    <Input
                      placeholder='Numeric Value'
                      keyboardType='numeric'
                      onChangeText={handleChange('rpm3')}
                      onBlur={handleBlur('rpm3')}
                      value={values.rpm3}
                    ></Input>
                  </FormControl>
                </HStack>
              </FormControl>
              <Text color='grey'>
                Please take 3 separate measures of cone rotations per minute
                before cleaning the trap.
              </Text>
            </VStack>
            <Heading alignSelf='center' fontSize='lg' mt='300'>
              Remove debris and begin fish processing
            </Heading>
          </Box>
          <NavButtons navigation={navigation} handleSubmit={handleSubmit} />
        </>
      )}
    </Formik>
  )
}

export default connect(mapStateToProps)(TrapOperations)
