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
} from 'native-base'
import CrewDropDown from '../../../components/form/CrewDropDown'
import { TrapVisitInitialValues } from '../../../services/utils/interfaces'
import { useSelector } from 'react-redux'

export default function VisitSetup({
  route,
  navigation,
}: {
  route: any
  navigation: any
}) {
  const step = route.params.step
  const activeFormState = route.params.activeFormState
  const passToActiveFormState = route.params.passToActiveFormState
  const initialFormState = {
    stream: '',
    trapSite: '',
    trapSubSite: '',
    crew: [],
  } as TrapVisitInitialValues
  const [crew, setCrew] = useState([] as Array<any>)

  const reduxState = useSelector((state: any) => state)
  console.log('🚀 ~ reduxState visitSetup.values', reduxState.visitSetup.values)

  useEffect(() => {
    passToActiveFormState(navigation, step, initialFormState)
  }, [])

  useEffect(() => {
    passToActiveFormState(navigation, step, { ...activeFormState, crew })
  }, [crew])

  return (
    <View>
      <>
        <Box h='full' bg='#fff' p='10%'>
          <VStack space={8}>
            <Heading>Which stream are you trapping on?</Heading>
            <FormControl>
              <FormControl.Label>Stream</FormControl.Label>
              <Select
                selectedValue={activeFormState?.stream}
                accessibilityLabel='Stream'
                placeholder='Stream'
                _selectedItem={{
                  bg: 'secondary',
                  endIcon: <CheckIcon size='6' />,
                }}
                mt={1}
                onValueChange={(selectedValue: any) =>
                  passToActiveFormState(navigation, step, {
                    ...activeFormState,
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
            {activeFormState.stream && (
              <>
                <Heading fontSize='lg'>Confirm the following values</Heading>
                <FormControl>
                  <FormControl.Label>Trap Site</FormControl.Label>
                  <Input
                    value={activeFormState.trapSite}
                    placeholder='Default Trap Site value'
                    onChangeText={(currentText: any) =>
                      passToActiveFormState(navigation, step, {
                        ...activeFormState,
                        trapSite: currentText,
                      })
                    }
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormControl.Label>Trap Sub Site</FormControl.Label>
                  <Input
                    value={activeFormState.trapSubSite}
                    placeholder='Default Trap Site value'
                    onChangeText={(currentText: any) =>
                      passToActiveFormState(navigation, step, {
                        ...activeFormState,
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

const testStreams = [
  { label: 'Default Stream 1', value: 'DS1' },
  { label: 'Default Stream 2', value: 'DS2' },
  { label: 'Default Stream 3', value: 'DS3' },
  { label: 'Default Stream 4', value: 'DS4' },
  { label: 'Default Stream 5', value: 'DS5' },
]
