import { useState } from 'react'
import {
  View,
  Box,
  Select,
  FormControl,
  CheckIcon,
  Heading,
  Input,
  VStack,
  Button,
} from 'native-base'
import CrewDropDown from '../../../components/form/CrewDropDown'
import { Formik } from 'formik'

const testStreams = [
  { label: 'Default Stream 1', value: 'DS1' },
  { label: 'Default Stream 2', value: 'DS2' },
  { label: 'Default Stream 3', value: 'DS3' },
  { label: 'Default Stream 4', value: 'DS4' },
  { label: 'Default Stream 5', value: 'DS5' },
]

export default function VisitSetup() {
  const [stream, setStream] = useState('' as string)
  const [crew, setCrew] = useState([] as Array<any>)

  return (
    <Formik
      initialValues={{
        stream: '',
        trapSite: '',
        trapSubSite: '',
        crew: [],
      }}
      onSubmit={(values: any) => {
        values.stream = stream
        values.crew = [...crew]

        console.log('🚀 ~ VisitSetup ~ crew', crew)
        console.log('🚀 ~ TrapStatus ~ values', values)

        // currently not displaying proper values on submission
        // need to improve validation
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <>
          <Box h='full' bg='#fff' p='50'>
            <VStack space={4}>
              <Heading>Which stream are you trapping on?</Heading>
              <FormControl w='3/4' isRequired>
                <FormControl.Label>Stream</FormControl.Label>
                <Select
                  selectedValue={stream}
                  minWidth='200'
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
                  <FormControl w='3/4'>
                    <FormControl.Label>Trap Site</FormControl.Label>
                    <Input
                      onChangeText={handleChange('trapSite')}
                      onBlur={handleBlur('trapSite')}
                      value={values.trapSite}
                    >
                      Default Trap Site value
                    </Input>
                  </FormControl>
                  <FormControl w='3/4'>
                    <FormControl.Label>Trap Sub Site</FormControl.Label>
                    <Input
                      onChangeText={handleChange('trapSubSite')}
                      onBlur={handleBlur('trapSubSite')}
                      value={values.trapSubSite}
                    >
                      Default Trap Site value
                    </Input>
                  </FormControl>
                  <FormControl w='3/4'>
                    <FormControl.Label>Crew</FormControl.Label>
                    <CrewDropDown setCrew={setCrew} />
                  </FormControl>
                </>
              )}
            </VStack>
            <Button
              mt='300'
              /* 
              // @ts-ignore */
              onPress={handleSubmit}
              title='Submit'
              variant='solid'
              backgroundColor='amber.400'
            >
              SUBMIT
            </Button>
          </Box>
        </>
      )}
    </Formik>
  )
}
