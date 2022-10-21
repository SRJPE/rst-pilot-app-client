import { useState } from 'react'
import { Formik } from 'formik'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  markVisitSetupCompleted,
  saveVisitSetup,
} from '../../../redux/reducers/formSlices/visitSetupSlice'
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
import { markStepCompleted } from '../../../redux/reducers/formSlices/navigationSlice'

import renderErrorMessage from '../../../components/form/RenderErrorMessage'
import CustomSelect from '../../../components/Shared/CustomSelect'

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
      // maybe this is not needed for first step in form?
      // initialTouched={{ trapSite: crew }}
      // initialErrors={reduxState.completed ? undefined : { crew: '' }}
      onSubmit={values => {
        handleSubmit(values)
      }}
    >
      {({
        handleChange,
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
            <VStack space={12}>
              <Heading mt='2'>Which stream are you trapping on?</Heading>
              <FormControl>
                <FormControl.Label>
                  <Text color='black' fontSize='xl'>
                    Stream
                  </Text>
                </FormControl.Label>
                <CustomSelect
                  selectedValue={values.stream}
                  placeholder='Stream'
                  onValueChange={handleChange('stream')}
                  setFieldTouched={setFieldTouched}
                  selectOptions={testStreams}
                />
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
                    <CustomSelect
                      selectedValue={values.trapSite}
                      placeholder='Trap Site'
                      onValueChange={handleChange('trapSite')}
                      setFieldTouched={setFieldTouched}
                      selectOptions={testSites}
                    />
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
                      setFieldValue={setFieldValue}
                      setFieldTouched={setFieldTouched}
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
