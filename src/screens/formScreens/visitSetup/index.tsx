import { useState } from 'react'
import {
  View,
  Box,
  Select,
  FormControl,
  CheckIcon,
  Heading,
  Input,
  VStack,
} from 'native-base'
import CrewDropDown from '../../../components/form/CrewDropDown'

const testStreams = [
  { label: 'Default Stream 1', value: 'DS1' },
  { label: 'Default Stream 2', value: 'DS2' },
  { label: 'Default Stream 3', value: 'DS3' },
  { label: 'Default Stream 4', value: 'DS4' },
  { label: 'Default Stream 5', value: 'DS5' },
]

export default function VisitSetup() {
  const [stream, setStream] = useState('')

  return (
    <View>
      <Box height='full' bg='#fff' padding='25'>
        <VStack space={4}>
          <Heading fontSize='lg'>Which stream are you trapping on?</Heading>
          <FormControl w='3/4'>
            <FormControl.Label>Stream</FormControl.Label>
            <Select
              selectedValue={stream}
              minWidth='200'
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
                <Select.Item key={idx} label={item.label} value={item.value} />
              ))}
            </Select>
          </FormControl>
          {stream && (
            <>
              <Heading fontSize='lg'>Confirm the following values</Heading>
              <FormControl w='3/4'>
                <FormControl.Label>Trap Site</FormControl.Label>
                <Input placeholder='Default Trap Site Value'></Input>
              </FormControl>
              <FormControl w='3/4'>
                <FormControl.Label>Trap Sub Site</FormControl.Label>
                <Input placeholder='Default Trap Sub Site Value'></Input>
              </FormControl>
              <FormControl w='3/4'>
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
