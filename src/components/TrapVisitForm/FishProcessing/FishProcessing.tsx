import {
  Box,
  FormControl,
  Heading,
  Input,
  Text,
  View,
  VStack,
  CheckIcon,
  Select,
} from 'native-base'
import { useState } from 'react'

const fishProcessed = [
  { label: 'Fish Processed', value: 'FP' },
  { label: 'Fish caught but not processed - released', value: 'FCR' },
  { label: 'Fish caught but not processed - left in live box', value: 'FCLB' },
  { label: 'No fish caught', value: 'NFC' },
]

export default function FishProcessing() {
  const [status, setStatus] = useState('' as string)
  return (
    <Box height='full' bg='#fff' p='50'>
      <VStack space={8}>
        <Heading>Will you be processing fish today?</Heading>
        <FormControl w='3/4'>
          <FormControl.Label>Fish Processed</FormControl.Label>
          <Select
            selectedValue={status}
            minWidth='200'
            accessibilityLabel='Status'
            placeholder='Status'
            _selectedItem={{
              bg: 'primary',
              endIcon: <CheckIcon size='5' />,
            }}
            mt={1}
            onValueChange={itemValue => setStatus(itemValue)}
          >
            {fishProcessed.map((item, idx) => (
              <Select.Item key={idx} label={item.label} value={item.value} />
            ))}
          </Select>
        </FormControl>
      </VStack>
    </Box>
  )
}
