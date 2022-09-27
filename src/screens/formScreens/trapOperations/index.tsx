import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  FormControl,
  Heading,
  Input,
  VStack,
  HStack,
  Radio,
  Checkbox,
  WarningOutlineIcon,
} from 'native-base'
import { TrapOperationsValuesI } from '../../../redux/reducers/trapOperationsSlice'

export default function TrapOperations({
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
    coneDepth: '',
    coneSetting: '',
    checked: false,
    totalRevolutions: null,
    rpm1: null,
    rpm2: null,
    rpm3: null,
  } as TrapOperationsValuesI

  const [coneSetting, setConeSetting] = useState('' as string)
  const [checked, setChecked] = useState(false as boolean)

  useEffect(() => {
    passToActiveFormState(navigation, step, initialFormState, step)
  }, [])
  useEffect(() => {
    passToActiveFormState(navigation, step, { ...activeFormState, coneSetting })
  }, [coneSetting])
  useEffect(() => {
    passToActiveFormState(navigation, step, { ...activeFormState, checked })
  }, [checked])

  return (
    <Box h='full' bg='#fff' p='10%'>
      <VStack space={8}>
        <Heading>Trap Pre-Processing</Heading>
        <FormControl w='1/2'>
          <FormControl.Label>Cone Depth</FormControl.Label>
          <Input
            onChangeText={(currentText: any) =>
              passToActiveFormState(navigation, step, {
                ...activeFormState,
                coneDepth: currentText,
              })
            }
            value={activeFormState.coneDepth}
            placeholder='Numeric Value'
            keyboardType='numeric'
          />
        </FormControl>
        <FormControl w='1/4'>
          <FormControl.Label>Cone Setting</FormControl.Label>
          <Radio.Group
            name='coneSetting'
            accessibilityLabel='cone setting'
            value={coneSetting}
            onChange={(nextValue: any) => {
              setConeSetting(nextValue)
            }} // TODO: change to primary color
          >
            <Radio colorScheme='primary' value='Full' my={1}>
              Full
            </Radio>
            <Radio colorScheme='primary' value='Half' my={1}>
              Half
            </Radio>
          </Radio.Group>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
            You must select a Prize.
          </FormControl.ErrorMessage>
        </FormControl>
        <HStack space={6} alignItems='center'>
          <FormControl w='1/2'>
            <FormControl.Label>Total Revolutions</FormControl.Label>
            <Input
              onChangeText={(currentText: any) =>
                passToActiveFormState(navigation, step, {
                  ...activeFormState,
                  totalRevolutions: currentText,
                })
              }
              value={activeFormState.totalRevolutions}
              placeholder='Numeric Value'
              keyboardType='numeric'
            />
          </FormControl>
          <FormControl w='1/2'>
            <HStack space={4} alignItems='center' pt='6'>
              <Checkbox
                shadow={2}
                onChange={(currentText: any) => setChecked(currentText)}
                colorScheme='emerald' // TODO: change to primary color
                value='checked'
                accessibilityLabel='Collect total revolutions after fish processing Checkbox'
              />
              <FormControl.Label>
                Collect total revolutions after fish processing
              </FormControl.Label>
            </HStack>
          </FormControl>
        </HStack>
        <FormControl>
          <FormControl.Label>RPM Before Cleaning</FormControl.Label>
          <HStack space={8} justifyContent='space-between'>
            <FormControl w='1/4'>
              <FormControl.Label>Measurement 1</FormControl.Label>
              <Input
                onChangeText={(currentText: any) =>
                  passToActiveFormState(navigation, step, {
                    ...activeFormState,
                    rpm1asd: currentText,
                  })
                }
                value={activeFormState.rpm1}
                placeholder='Numeric Value'
                keyboardType='numeric'
              ></Input>
            </FormControl>
            <FormControl w='1/4'>
              <FormControl.Label>Measurement 2</FormControl.Label>
              <Input
                onChangeText={(currentText: any) =>
                  passToActiveFormState(navigation, step, {
                    ...activeFormState,
                    rpm2: currentText,
                  })
                }
                value={activeFormState.rpm2}
                placeholder='Numeric Value'
                keyboardType='numeric'
              ></Input>
            </FormControl>
            <FormControl w='1/4'>
              <FormControl.Label>Measurement 3</FormControl.Label>
              <Input
                onChangeText={(currentText: any) =>
                  passToActiveFormState(navigation, step, {
                    ...activeFormState,
                    rpm3: currentText,
                  })
                }
                value={activeFormState.rpm3}
                placeholder='Numeric Value'
                keyboardType='numeric'
              ></Input>
            </FormControl>
          </HStack>
        </FormControl>
        <Text color='grey'>
          Please take 3 separate measures of cone rotations per minute before
          cleaning the trap.
        </Text>
      </VStack>
      <Heading alignSelf='center' fontSize='lg'>
        Remove debris and begin fish processing
      </Heading>
    </Box>
  )
}
