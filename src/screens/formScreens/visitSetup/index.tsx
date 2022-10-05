import { useState } from 'react'
import { Formik } from 'formik'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../../redux/store'
import {
  markVisitSetupCompleted,
  saveVisitSetup,
} from '../../../redux/reducers/visitSetupSlice'
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
import NavButtons from '../../../components/formContainer/NavButtons'

const testStreams = [
  { label: 'Default Stream 1', value: 'DS1' },
  { label: 'Default Stream 2', value: 'DS2' },
  { label: 'Default Stream 3', value: 'DS3' },
  { label: 'Default Stream 4', value: 'DS4' },
  { label: 'Default Stream 5', value: 'DS5' },
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
  const [stream, setStream] = useState(reduxState.values.stream as string)
  const [crew, setCrew] = useState(reduxState.values.crew as Array<any>)

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
      initialValues={reduxState.values}
      onSubmit={values => {
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
                  selectedValue={stream}
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

export default connect(mapStateToProps)(VisitSetup)
