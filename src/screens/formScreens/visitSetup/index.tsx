import { useCallback, useEffect, useState } from 'react'
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
import { useFocusEffect } from '@react-navigation/native'

export default function VisitSetup({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>()
  const visitSetupState = useSelector((state: any) => state.visitSetup)
  const [crew, setCrew] = useState([] as Array<any>)
  const [visitSetupFormValues, setVisitSetupFormValues] = useState({
    stream: '',
    trapSite: '',
    trapSubSite: '',
    crew: [],
  } as TrapVisitInitialValues)

  useEffect(() => {
    setVisitSetupFormValues({ ...visitSetupFormValues, crew })
  }, [crew])

  // useFocusEffect(
  //   useCallback(() => {
  //     return () => {
  //       dispatch({
  //         type: saveVisitSetup,
  //         payload: visitSetupFormValues,
  //       })
  //     }
  //   }, [])
  // )

  useEffect(() => {
    const saveOnUnmount = navigation.addListener('blur', () => {
      dispatch({
        type: saveVisitSetup,
        payload: visitSetupFormValues,
      })
    })

    return saveOnUnmount
  }, [navigation])

  return (
    <View>
      <>
        <Box h='full' bg='#fff' p='10%'>
          <VStack space={8}>
            <Heading>Which stream are you trapping on?</Heading>
            <FormControl>
              <FormControl.Label>Stream</FormControl.Label>
              <Select
                selectedValue={visitSetupFormValues.stream}
                accessibilityLabel='Stream'
                placeholder='Stream'
                _selectedItem={{
                  bg: 'secondary',
                  endIcon: <CheckIcon size='6' />,
                }}
                mt={1}
                onValueChange={(selectedValue: any) =>
                  setVisitSetupFormValues({
                    ...visitSetupFormValues,
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
            {/* <Button
              variant='solid'
              onPress={() => {
                console.log(visitSetupFormValues)
                dispatch({
                  type: saveVisitSetup,
                  payload: visitSetupFormValues,
                })
              }}
              backgroundColor='primary'
            >
              Submit
            </Button> */}
            <Button
              variant='solid'
              onPress={() => {
                console.log('logVALUES:', visitSetupState.values)
                dispatch({
                  type: saveVisitSetup,
                  payload: visitSetupFormValues,
                })
              }}
              backgroundColor='primary'
            >
              log
            </Button>
            {visitSetupFormValues.stream && (
              <>
                <Heading fontSize='lg'>Confirm the following values</Heading>
                <FormControl>
                  <FormControl.Label>Trap Site</FormControl.Label>
                  <Input
                    value={visitSetupFormValues.trapSite}
                    placeholder='Default Trap Site value'
                    onChangeText={(currentText: any) =>
                      setVisitSetupFormValues({
                        ...visitSetupFormValues,
                        trapSite: currentText,
                      })
                    }
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Trap Sub Site</FormControl.Label>
                  <Input
                    value={visitSetupFormValues.trapSubSite}
                    placeholder='Default Trap Site value'
                    onChangeText={(currentText: any) =>
                      setVisitSetupFormValues({
                        ...visitSetupFormValues,
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
