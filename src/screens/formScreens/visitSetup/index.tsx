import { useState } from 'react'
import { Formik } from 'formik'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  markVisitSetupCompleted,
  saveVisitSetup,
} from '../../../redux/reducers/visitSetupSlice'
import {
  Select,
  FormControl,
  CheckIcon,
  Heading,
  VStack,
  Text,
  View,
} from 'native-base'
import CrewDropDown from '../../../components/form/CrewDropDown'
import NavButtons from '../../../components/formContainer/NavButtons'
import { trapVisitSchema } from '../../../utils/helpers/yupValidations'
import { markStepCompleted } from '../../../redux/reducers/navigationSlice'

import renderErrorMessage from '../../../components/form/RenderErrorMessage'

const testStreams = [
  { label: 'Default Stream 1', value: 'DS1' },
  { label: 'Default Stream 2', value: 'DS2' },
  { label: 'Default Stream 3', value: 'DS3' },
  { label: 'Default Stream 4', value: 'DS4' },
  { label: 'Default Stream 5', value: 'DS5' },
]
const testSites = [
  { label: 'Default Site 1', value: 'DS1' },
  { label: 'Default Site 2', value: 'DS2' },
  { label: 'Default Site 3', value: 'DS3' },
]

const mapStateToProps = (state: RootState) => {
  return {
    reduxState: state.visitSetup,
  }
}

const VisitSetup = ({
  navigation,
  reduxState,
}: {
  navigation: any
  reduxState: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [crew, setCrew] = useState(reduxState.values.crew as Array<any>)

  const handleSubmit = (values: any) => {
    //add in additional values not using handleChange
    values.crew = [...crew]
    //dispatch to redux
    dispatch(saveVisitSetup(values))
    dispatch(markVisitSetupCompleted(true))
    dispatch(markStepCompleted(true))
    console.log('🚀 ~ handleSubmit ~ Visit', values)
  }

  return (
    <Formik
      validationSchema={trapVisitSchema}
      initialValues={reduxState.values}
      //hacky workaround to set the screen to touched (select cannot easily be passed handleBlur)
      initialTouched={{ stream: true }}
      initialErrors={{ stream: '' }}
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
            <VStack space={12}>
              <Heading mt='2'>Which stream are you trapping on?</Heading>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Stream
                  </Text>
                </FormControl.Label>
                <Select
                  height='50px'
                  fontSize='16'
                  selectedValue={values.stream}
                  accessibilityLabel='Stream'
                  placeholder='Stream'
                  _selectedItem={{
                    bg: 'secondary',
                    endIcon: <CheckIcon size='6' />,
                  }}
                  my={1}
                  onValueChange={handleChange('stream')}
                >
                  {testStreams.map((item, idx) => (
                    <Select.Item
                      key={idx}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Select>
                {touched.stream &&
                  errors.stream &&
                  renderErrorMessage(errors, 'stream')}
              </FormControl>
              {values.stream && (
                <>
                  <Heading fontSize='lg'>Confirm the following values:</Heading>
                  <FormControl>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Trap Site
                      </Text>
                    </FormControl.Label>
                    <Select
                      height='50px'
                      fontSize='16'
                      selectedValue={values.trapSite}
                      accessibilityLabel='Trap Site'
                      placeholder='Trap Site'
                      _selectedItem={{
                        bg: 'secondary',
                        endIcon: <CheckIcon size='6' />,
                      }}
                      mt={1}
                      onValueChange={handleChange('trapSite')}
                    >
                      {testSites.map((item, idx) => (
                        <Select.Item
                          key={idx}
                          label={item.label}
                          value={item.value}
                        />
                      ))}
                    </Select>
                    {touched.trapSite &&
                      errors.trapSite &&
                      renderErrorMessage(errors, 'trapSite')}
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>
                      <Text color='black' fontSize='xl'>
                        Crew
                      </Text>
                    </FormControl.Label>
                    <CrewDropDown
                      setCrew={setCrew}
                      // handleChange={handleChange}
                    />
                    {/* {touched.crew &&
                      errors.crew &&
                      renderErrorMessage(errors, 'crew')} */}
                  </FormControl>
                </>
              )}
            </VStack>
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

export default connect(mapStateToProps)(VisitSetup)
