import { useEffect, useState } from 'react'
import { Formik } from 'formik'
import {
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
import { TrapVisitInitialValues } from '../../../services/utils/interfaces'
import { trapVisitSchema } from '../../../services/utils/helpers/yupValidations'

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
  const [initialValues] = useState({
    stream: '',
    trapSite: '',
    trapSubSite: '',
    crew: [],
  } as TrapVisitInitialValues)

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={trapVisitSchema}
      onSubmit={(values: any) => {
        values.stream = stream
        values.crew = [...crew]
        console.log('🚀 ~ VisitSetup ~ values', values)
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
          <Box h='full' bg='#fff' p='10%'>
            <VStack space={8}>
              <Heading>Which stream are you trapping on?</Heading>
              <FormControl w='3/4'>
                <FormControl.Label>Stream</FormControl.Label>
                <Select
                  selectedValue={stream}
                  width='133%'
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
                      onChangeText={handleChange('trapSite')}
                      onBlur={handleBlur('trapSite')}
                      value={values.trapSite}
                      placeholder='Default Trap Site value'
                    ></Input>
                  </FormControl>
                  <FormControl>
                    <FormControl.Label>Trap Sub Site</FormControl.Label>
                    <Input
                      onChangeText={handleChange('trapSubSite')}
                      onBlur={handleBlur('trapSubSite')}
                      value={values.trapSubSite}
                      placeholder='Default Trap Site value'
                    ></Input>
                  </FormControl>
                  <FormControl>
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
              backgroundColor='primary'
            >
              SUBMIT
            </Button>
          </Box>
        </>
      )}
    </Formik>
  )
}
