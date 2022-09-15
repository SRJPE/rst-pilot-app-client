import { useState } from 'react'
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
} from 'native-base'

export default function TrapOperations() {
  const [coneDepth, setConeDepth] = useState('' as string)
  const [coneSetting, setConeSetting] = useState('full' as string)
  const [totalRevolutions, setTotalRevolutions] = useState('' as string)
  const [checked, setChecked] = useState(false as boolean)

  return (
    <Box height='full' bg='#fff' p='50'>
      <VStack space={8}>
        <Heading>Trap Pre-Processing</Heading>
        <FormControl w='1/4'>
          <FormControl.Label>Cone Depth</FormControl.Label>
          <Input
            onChangeText={setConeDepth}
            value={coneDepth}
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
            onChange={nextValue => {
              setConeSetting(nextValue)
            }}
          >
            <Radio colorScheme='secondary' value='Full' my={1}>
              Full
            </Radio>
            <Radio colorScheme='secondary' value='Half' my={1}>
              Half
            </Radio>
          </Radio.Group>
        </FormControl>
        <HStack space={6} alignItems='center'>
          <FormControl w='1/4'>
            <FormControl.Label>Total Revolutions</FormControl.Label>
            <Input
              onChangeText={setTotalRevolutions}
              value={totalRevolutions}
              placeholder='Numeric Value'
              keyboardType='numeric'
            />
          </FormControl>
          <FormControl w='1/2'>
            <HStack space={4} alignItems='center' pt='6'>
              <Checkbox
                isChecked={checked}
                onChange={() => setChecked(!checked)}
                colorScheme='primary'
                value=''
                accessibilityLabel='Collect total revolutions after fish processing Checkbox'
              />
              <FormControl.Label>
                Collect total revolutions after fish processing
              </FormControl.Label>
            </HStack>
          </FormControl>
        </HStack>
        <FormControl w='3/4'>
          <FormControl.Label>RPM Before Cleaning</FormControl.Label>
          <HStack space={4} alignItems='center'>
            <FormControl w='1/4'>
              <FormControl.Label>Measurement 1</FormControl.Label>
              <Input
                onChangeText={setTotalRevolutions}
                value={totalRevolutions}
                placeholder='Numeric Value'
                keyboardType='numeric'
              ></Input>
            </FormControl>
            <FormControl w='1/4'>
              <FormControl.Label>Measurement 2</FormControl.Label>
              <Input
                onChangeText={setTotalRevolutions}
                value={totalRevolutions}
                placeholder='Numeric Value'
                keyboardType='numeric'
              ></Input>
            </FormControl>
            <FormControl w='1/4'>
              <FormControl.Label>Measurement 3</FormControl.Label>
              <Input
                onChangeText={setTotalRevolutions}
                value={totalRevolutions}
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
        <Heading alignSelf='center' fontSize='lg'>
          Remove debris and begin fish processing
        </Heading>
      </VStack>
    </Box>
  )
}
