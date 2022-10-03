import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import {
  Box,
  Select,
  FormControl,
  CheckIcon,
  Heading,
  Input,
  VStack,
  HStack,
  Button,
  Text,
  View,
} from 'native-base'
import { trapStatusSchema } from '../../../services/utils/helpers/yupValidations'
import { TrapStatusInitialValues } from '../../../services/utils/interfaces'
import { Button as RNButton } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch } from '../../../redux/store'
import {
  getTrapVisitDropdownValues,
  clearValuesFromDropdown,
} from '../../../redux/reducers/dropdownsSlice'

export default function TrapStatus({
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
  const previousFormState = useSelector(
    (state: any) => state.values?.trapStatus
  )
  const initialFormValues = {
    trapStatus: '',
    reasonNotFunc: '',
    flowMeasure: '',
    waterTemperature: '',
    waterTurbidity: '',
  } as TrapStatusInitialValues

  const dispatch = useDispatch<AppDispatch>()
  const dropdownValues = useSelector((state: any) => state.dropdowns)
  const reduxState = useSelector((state: any) => state)
  // console.log('🚀 ~ reduxState trapStatus.values', reduxState.trapStatus.values)

  console.log('🚀 ~ activeFormState trap status', activeFormState)
  console.log('🚀 ~ route PARAMS Trap Status', route.params)

  // useEffect(() => {
  //   resetActiveFormState(navigation, previousFormState)
  //   console.log('🚀 ~ activeFormState &&&&&&&', activeFormState)
  //   console.log('🚀 ~ reduxFormState &^(*^(*^*(^', reduxFormState)
  // }, [])

  useEffect(() => {
    // passToActiveFormState(navigation, step, initialFormState, step)
    // if (Object.keys(activeFormState).length > 1) {
    //   navigation.setParams({
    //     activeFormState: previousFormState,
    //   })
    // }
    // if (Object.keys(activeFormState).length > 1) {
    //   passToActiveFormState(navigation, step, previousFormState)
    // } else {
    //   passToActiveFormState(navigation, step, initialFormValues)
    // }
    passToActiveFormState(navigation, step, activeFormState)
  }, [])

  useEffect(() => {
    dispatch(getTrapVisitDropdownValues())
  }, [])
  const { trapFunctionality } = dropdownValues.values
  console.log('🚀 ~ trapFunctionality', trapFunctionality)
  // console.log('🚀 ~ trapFunctionality', trapFunctionality)

  return (
    <Box h='full' bg='#fff' p='10%'>
      <VStack space={8}>
        <Heading>Is the Trap functioning normally?</Heading>
        <FormControl>
          <FormControl.Label>Trap Status</FormControl.Label>
          <Select
            selectedValue={activeFormState?.status}
            accessibilityLabel='Status'
            placeholder='Status'
            _selectedItem={{
              bg: 'secondary',
              endIcon: <CheckIcon size='5' />,
            }}
            mt={1}
            onValueChange={(selectedValue: any) =>
              passToActiveFormState(navigation, step, {
                ...activeFormState,
                trapStatus: selectedValue,
              })
            }
          >
            {trapFunctionality.map((item: any) => (
              <Select.Item
                key={item.id}
                label={item.definition}
                value={item.definition}
              />
            ))}
          </Select>
        </FormControl>
        {/* {activeFormState?.trapStatus ===
          'Trap functioning, but not normally' && ( */}
        <FormControl>
          <FormControl.Label>Reason For Trap Not Functioning</FormControl.Label>
          <Select
            selectedValue={activeFormState?.reasonNotFunc}
            accessibilityLabel='Reason Not Functioning.'
            placeholder='Reason'
            _selectedItem={{
              bg: 'secondary',
              endIcon: <CheckIcon size='5' />,
            }}
            mt={1}
            onValueChange={(selectedValue: any) =>
              passToActiveFormState(navigation, step, {
                ...activeFormState,
                reasonNotFunc: selectedValue,
              })
            }
          >
            {reasonsForTrapNotFunctioning.map((item, idx) => (
              <Select.Item key={idx} label={item.label} value={item.value} />
            ))}
          </Select>
        </FormControl>
        {/* )} */}
        {/* {activeFormState?.trapStatus?.length > 0 && ( */}
        <>
          <Heading fontSize='lg'>Environmental Conditions</Heading>
          <HStack space={5} width='125%'>
            <FormControl w='1/4'>
              <FormControl.Label>Flow Measure</FormControl.Label>
              <Input
                value={activeFormState?.flowMeasure}
                placeholder='Populated from CDEC'
                keyboardType='numeric'
                onChangeText={(currentText: any) =>
                  passToActiveFormState(navigation, step, {
                    ...activeFormState,
                    flowMeasure: currentText,
                  })
                }
              />
            </FormControl>
            <FormControl w='1/4'>
              <FormControl.Label>Water Temperature</FormControl.Label>
              <Input
                value={activeFormState?.waterTemperature}
                placeholder='Numeric Value'
                keyboardType='numeric'
                onChangeText={(currentText: any) =>
                  passToActiveFormState(navigation, step, {
                    ...activeFormState,
                    waterTemperature: currentText,
                  })
                }
              />
            </FormControl>
            <FormControl w='1/4'>
              <FormControl.Label>Water Turbidity</FormControl.Label>
              <Input
                value={activeFormState?.waterTurbidity}
                placeholder='Numeric Value'
                keyboardType='numeric'
                onChangeText={(currentText: any) =>
                  passToActiveFormState(navigation, step, {
                    ...activeFormState,
                    waterTurbidity: currentText,
                  })
                }
              />
            </FormControl>
          </HStack>
        </>
        {/* )} */}
      </VStack>
      {/* 
      <RNButton
        title='Log dropdown values from redux'
        onPress={() => console.log(dropdownValues)}
      />
      <RNButton
        title='Log all of  redux state'
        onPress={() => console.log('redux state: ', reduxState)}
      />
      <RNButton
        title='Empty "markType" from redux state'
        onPress={() => dispatch(clearValuesFromDropdown('markType'))}
      /> */}
    </Box>
  )
}

const reasonsForTrapNotFunctioning = [
  { label: 'High Rain', value: 'High Rain' },
  { label: 'Broken Trap', value: 'Broken Trap' },
  { label: 'Debris in Trap', value: 'Debris in Trap' },
]
