import React, { useState } from 'react'
import {
  Box,
  Center,
  CheckIcon,
  Divider,
  FormControl,
  HStack,
  Select,
  VStack,
} from 'native-base'

const speciesDictionary = [{ label: 'Chinook', value: 'Chinook' }]

interface CustomSelectI {
  selectedValue: string
  placeholder: string
  setValueFxn: any
  selectOptions: any[]
}

export default function AddFishModalContent() {
  const [species, setSpecies] = useState('' as string)

  const CustomSelect: React.FC<CustomSelectI> = (props) => {
    return (
      <Select
        selectedValue={props.selectedValue}
        minWidth='100'
        accessibilityLabel={props.placeholder}
        placeholder={props.placeholder}
        _selectedItem={{
          bg: 'primary',
          endIcon: <CheckIcon size='5' />,
        }}
        mt={1}
        onValueChange={(itemValue) => props.setValueFxn(itemValue)}
      >
        {props.selectOptions.map((item, idx) => (
          <Select.Item key={idx} label={item.label} value={item.value} />
        ))}
      </Select>
    )
  }

  return (
    <VStack>
      <Center>
        <FormControl w='5/6'>
          <FormControl.Label>Species</FormControl.Label>
          <Select
            selectedValue={species}
            minWidth='100'
            accessibilityLabel='Status'
            placeholder='Status'
            _selectedItem={{
              bg: 'primary',
              endIcon: <CheckIcon size='5' />,
            }}
            mt={1}
            onValueChange={(itemValue) => setSpecies(itemValue)}
          >
            {speciesDictionary.map((item, idx) => (
              <Select.Item key={idx} label={item.label} value={item.value} />
            ))}
          </Select>
          <Divider my={5} />
          <HStack>
            <CustomSelect
              selectedValue={species}
              placeholder={'Species'}
              setValueFxn={setSpecies}
              selectOptions={speciesDictionary}
            />
          </HStack>
        </FormControl>
      </Center>
    </VStack>
  )
}
