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
} from 'native-base'
import CrewDropDown from './CrewDropDown'

const testStreams = [
  { label: 'Default Stream 1', value: 'DS1' },
  { label: 'Default Stream 2', value: 'DS2' },
  { label: 'Default Stream 3', value: 'DS3' },
  { label: 'Default Stream 4', value: 'DS4' },
  { label: 'Default Stream 5', value: 'DS5' },
]

export default function VisitSetup() {
  const [service, setService] = useState('')

  return (
    <View>
      <Box height='800px' bg='#fff' padding='15'>
        <VStack space={4}>
          <Heading fontSize='lg'>Which stream are you trapping on?</Heading>
          <FormControl w='3/4' maxW='300'>
            <FormControl.Label>Stream</FormControl.Label>
            <Select
              selectedValue={service}
              minWidth='200'
              accessibilityLabel='Stream'
              placeholder='Stream'
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size='5' />,
              }}
              mt={1}
              onValueChange={itemValue => setService(itemValue)}
            >
              {testStreams.map((item, idx) => (
                <Select.Item key={idx} label={item.label} value={item.value} />
              ))}
            </Select>
          </FormControl>
          {service && (
            <>
              <Heading fontSize='lg'>Confirm the following values</Heading>
              <FormControl w='3/4' maxW='300'>
                <FormControl.Label>Trap Site</FormControl.Label>
                <Input></Input>
              </FormControl>
              <FormControl w='3/4' maxW='300'>
                <FormControl.Label>Trap Sub Site</FormControl.Label>
                <Input></Input>
              </FormControl>
              <FormControl w='3/4' maxW='300'>
                <FormControl.Label>Crew</FormControl.Label>
                <CrewDropDown />
              </FormControl>
            </>
          )}
        </VStack>
      </Box>
    </View>
  )
}
