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

import { useSelector } from 'react-redux'
import { trapVisitFormValuesI } from '../../../redux/reducers/formSlice'
import { TrapVisitInitialValues } from '../../../utils/interfaces'

export default function VisitSetup({
  route,
  navigation,
}: {
  route: any
  navigation: any
}) {
  const {
    step,
    activeFormState,
    passToActiveFormState,
    resetActiveFormState,
    reduxFormState,
  } = route.params

  const initialFormValues = {
    stream: '',
    trapSite: '',
    trapSubSite: '',
    crew: [],
  } as TrapVisitInitialValues

  const [crew, setCrew] = useState([] as Array<any>)
  const reduxState = useSelector((state: any) => state.values?.trapVisit)

  console.log('🚀 ~ reduxFormState #####', reduxFormState)
  const reduxFormState2 = useSelector((state: any) => state.values?.visitSetup)
  console.log('🚀 ~ reduxFormState2', reduxFormState2)

  console.log('🚀 ~ activeFormState Visit Setup', activeFormState)
  console.log('🚀 ~ route PARAMS Visit Setup', route.params)

  // useEffect(() => {
  //   resetActiveFormState(navigation, reduxState)
  //   console.log('🚀 ~ activeFormState &&&&&&&', activeFormState)
  // }, [])

  useEffect(() => {
    // if (Object.keys(activeFormState).length > 1) {
    //   navigation.setParams({
    //     activeFormState: reduxFormState,
    //   })
    // }
    // if (Object.keys(activeFormState).length > 1) {
    //   passToActiveFormState(navigation, step, reduxState)
    // } else {
    //   passToActiveFormState(navigation, step, initialFormValues)
    // }
    passToActiveFormState(navigation, step, activeFormState)
  }, [])

  useEffect(() => {
    passToActiveFormState(navigation, step, { ...activeFormState, crew })
  }, [crew, navigation.activeStep])

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
            {/* {(reduxFormState?.stream || activeFormState?.stream) && ( */}
            <>
              <Heading fontSize='lg'>Confirm the following values</Heading>
              <FormControl>
                <FormControl.Label>Trap Site</FormControl.Label>
                <Input
                  value={reduxState?.trapSite}
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
                  value={reduxState?.trapSubSite}
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
            {/* )} */}
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
