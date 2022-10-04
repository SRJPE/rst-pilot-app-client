import { useEffect, useState } from 'react'
import {
  Box,
  Select,
  FormControl,
  CheckIcon,
  Heading,
  Input,
  VStack,
  View,
  Button,
} from 'native-base'
import CrewDropDown from '../../../components/form/CrewDropDown'
import { Formik } from 'formik'

import { useDispatch, useSelector } from 'react-redux'
import { trapVisitFormValuesI } from '../../../redux/reducers/formSlice'
import { TrapVisitInitialValues } from '../../../utils/interfaces'
import NavButtons from '../../../components/formContainer/NavButtons'
import { AppDispatch } from '../../../redux/store'
import {
  markVisitSetupCompleted,
  saveVisitSetup,
} from '../../../redux/reducers/visitSetupSlice'

export default function VisitSetup({
  route,
  navigation,
}: {
  route: any
  navigation: any
}) {
  const dispatch = useDispatch<AppDispatch>()
  const reduxState = useSelector((state: any) => state.values?.trapVisit)
  const [initialFormValues, setInitialFormValues] = useState({} as any)
  const [stream, setStream] = useState('' as string)
  const [crew, setCrew] = useState([] as Array<any>)

  //sets initial values to redux state on load
  useEffect(() => {
    setInitialFormValues(reduxState)
  }, [])

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ initialFormValues Visit', initialFormValues)
  }, [initialFormValues])

  const handleSubmit = (values: any) => {
    //add in additional values not using handleChange
    values.stream = stream
    values.crew = [...crew]
    //dispatch to redux
    dispatch(saveVisitSetup(values))
    dispatch(markVisitSetupCompleted(true))
    console.log('🚀 ~ handleSubmit ~ values', values)
  }

  return (
    <Formik
      // validationSchema={{ test: '' }}
      initialValues={initialFormValues}
      onSubmit={async values => {
        handleSubmit(values)
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <>
          <Box h='90%' bg='#fff' p='10%'>
            <VStack space={8}>
              <Heading>Which stream are you trapping on?</Heading>
              <FormControl>
                <FormControl.Label>Stream</FormControl.Label>
                <Select
                  selectedValue={reduxState?.stream}
                  accessibilityLabel='Stream'
                  placeholder='Stream'
                  _selectedItem={{
                    bg: 'secondary',
                    endIcon: <CheckIcon size='6' />,
                  }}
                  mt={1}
                  onValueChange={itemValue => setStream(itemValue)}
                >
                  {testStreams.map((item, idx) => (
                    <Select.Item
                      key={idx}
                      label={item.label}
                      value={item.value}
                    />
                  ))}
                </Select>
              </FormControl>
              {stream && (
                <>
                  <Heading fontSize='lg'>Confirm the following values</Heading>
                  <FormControl>
                    <FormControl.Label>Trap Site</FormControl.Label>
                    <Input
                      placeholder='Default Trap Site value'
                      value={values.trapSite}
                      onChangeText={handleChange('trapSite')}
                      onBlur={handleBlur('trapSite')}
                    ></Input>
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Trap Sub Site</FormControl.Label>
                    <Input
                      placeholder='Default Trap Site value'
                      value={values.trapSubSite}
                      onChangeText={handleChange('trapSubSite')}
                      onBlur={handleBlur('trapSubSite')}
                    ></Input>
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Crew</FormControl.Label>
                    <CrewDropDown setCrew={setCrew} />
                  </FormControl>
                </>
              )}
            </VStack>
          </Box>
          <NavButtons navigation={navigation} handleSubmit={handleSubmit} />
        </>
      )}
    </Formik>
  )
}

const testStreams = [
  { label: 'Default Stream 1', value: 'DS1' },
  { label: 'Default Stream 2', value: 'DS2' },
  { label: 'Default Stream 3', value: 'DS3' },
  { label: 'Default Stream 4', value: 'DS4' },
  { label: 'Default Stream 5', value: 'DS5' },
]

// const {
//   step,
//   activeFormState,
//   passToActiveFormState,
//   resetActiveFormState,
//   reduxFormState,
// } = route.params

// useEffect(() => {
//   resetActiveFormState(navigation, reduxState)
//   console.log('🚀 ~ activeFormState useEffect', activeFormState)
// }, [])

// useEffect(() => {
//if form is marked completed??
//
// if () {
//   navigation.setParams({
//     activeFormState: reduxFormState,
//   })
// }
// if () {
//   passToActiveFormState(navigation, step, reduxState)
// } else {
//   passToActiveFormState(navigation, step, initialFormValues)
// }
//   passToActiveFormState(navigation, step, activeFormState)
// }, [])

// useEffect(() => {
//   passToActiveFormState(navigation, step, { ...activeFormState, crew })
// }, [crew, navigation.activeStep])
