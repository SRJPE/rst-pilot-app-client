import { useState } from 'react'
import {
  View,
  Box,
  Select,
  Text,
  FormControl,
  CheckIcon,
  WarningOutlineIcon,
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

  return (
    <Box height='full' bg='#fff' padding='15'>
      <VStack space={4}>
        <Heading fontSize='lg'>Trap Pre-Processing</Heading>
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
        <HStack space={6} alignItems='flex-start'>
          <FormControl w='1/4'>
            <FormControl.Label>Total Revolutions</FormControl.Label>
            <Input
              onChangeText={setTotalRevolutions}
              value={totalRevolutions}
              placeholder='Numeric Value'
              keyboardType='numeric'
            />
          </FormControl>
          <FormControl w='1/4'>
            <FormControl.Label>Collect after fish processing</FormControl.Label>
            <Checkbox
              value='test'
              accessibilityLabel='Collect after fish processing'
            />
          </FormControl>
        </HStack>
      </VStack>
    </Box>
  )
}
