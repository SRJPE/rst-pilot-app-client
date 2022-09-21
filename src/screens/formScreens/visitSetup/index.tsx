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
  View,
} from 'native-base'
import CrewDropDown from '../../../components/form/CrewDropDown'
import { TrapVisitInitialValues } from '../../../services/utils/interfaces'
import { trapVisitSchema } from '../../../services/utils/helpers/yupValidations'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import { useSelector } from 'react-redux'
import { saveVisitSetup } from '../../../redux/reducers/visitSetupSlice'

export default function VisitSetup({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>()
  const visitSetupState = useSelector((state: any) => state.visitSetup)

  const [stream, setStream] = useState('' as string)
  const [trapSite, setTrapSite] = useState('' as string)
  const [trapSubSite, setTrapSubSite] = useState('' as string)
  const [crew, setCrew] = useState([] as Array<any>)

  const [initialValues, setInitialValues] = useState({
    stream: '',
    trapSite: '',
    trapSubSite: '',
    crew: [],
  } as TrapVisitInitialValues)

  useEffect(() => {
    setInitialValues({ ...initialValues, crew })
  }, [crew])

  useEffect(() => {
    console.log(
      '🚀 ~ VisitSetup ~ visitSetupState.values',
      visitSetupState.values
    )
    return () => {
      console.log('unmount')
      dispatch({
        type: saveVisitSetup,
        payload: stream,
      })
    }
  }, [])

  return (
    <View>
      <>
        <Box h='full' bg='#fff' p='10%'>
          <VStack space={8}>
            <Heading>Which stream are you trapping on?</Heading>
            <FormControl>
              <FormControl.Label>Stream</FormControl.Label>
              <Select
                selectedValue={initialValues.stream}
                accessibilityLabel='Stream'
                placeholder='Stream'
                _selectedItem={{
                  bg: 'secondary',
                  endIcon: <CheckIcon size='6' />,
                }}
                mt={1}
                onValueChange={(selectedValue: any) =>
                  setInitialValues({
                    ...initialValues,
                    stream: selectedValue,
                  })
                }
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
            <Button
              bg='red'
              variant='solid'
              onPress={() => {
                console.log(initialValues)
                dispatch({
                  type: saveVisitSetup,
                  payload: stream,
                })
              }}
              _text={{
                color: 'black',
              }}
            >
              PRESS ME
            </Button>
            {initialValues.stream && (
              <>
                <Heading fontSize='lg'>Confirm the following values</Heading>
                <FormControl>
                  <FormControl.Label>Trap Site</FormControl.Label>
                  <Input
                    value={initialValues.trapSite}
                    placeholder='Default Trap Site value'
                    onChangeText={(currentText: any) =>
                      setInitialValues({
                        ...initialValues,
                        trapSite: currentText,
                      })
                    }
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Trap Sub Site</FormControl.Label>
                  <Input
                    value={initialValues.trapSubSite}
                    placeholder='Default Trap Site value'
                    onChangeText={(currentText: any) =>
                      setInitialValues({
                        ...initialValues,
                        trapSubSite: currentText,
                      })
                    }
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
      </>
    </View>
  )
}

// <Button
//   mt='300'
//   /*
//     // @ts-ignore */
//   onPress={handleSubmit}
//   title='Submit'
//   variant='solid'
//   backgroundColor='primary'
// >
//   SUBMIT
// </Button>
const testStreams = [
  { label: 'Default Stream 1', value: 'DS1' },
  { label: 'Default Stream 2', value: 'DS2' },
  { label: 'Default Stream 3', value: 'DS3' },
  { label: 'Default Stream 4', value: 'DS4' },
  { label: 'Default Stream 5', value: 'DS5' },
]
