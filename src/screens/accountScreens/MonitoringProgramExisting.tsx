import React, { useState } from 'react'
import {
  Box,
  Button,
  Center,
  CheckIcon,
  FormControl,
  Heading,
  Select,
  Text,
  VStack,
  View,
} from 'native-base'
import AppLogo from '../../components/Shared/AppLogo'
import MonitoringProgramNavButtons from '../../components/monitoringProgram/MonitoringProgramNavButtons'

const programsTemp = [
  { id: 1, definition: 'Program 1' },
  { id: 2, definition: 'Program 2' },
]

const MonitoringProgramExisting = ({ navigation }: { navigation: any }) => {
  const [program, setProgram] = React.useState('')
  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Center bg='primary' py='5%'>
          <AppLogo imageSize={200} />
        </Center>
        <VStack alignItems='center' py='5%' px='10%' space={10}>
          <Heading alignSelf='center'>Monitoring Program</Heading>
          <Text fontSize='2xl' color='grey'>
            Select from an existing program
          </Text>

          <FormControl>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Program{' '}
              </Text>
            </FormControl.Label>

            <Select
              selectedValue={program}
              height='50px'
              fontSize='16'
              w='100%'
              accessibilityLabel='Choose Program'
              placeholder='Choose Service'
              _selectedItem={{
                bg: 'secondary',
                endIcon: <CheckIcon size='5' />,
              }}
              mt={1}
              onValueChange={(itemValue) => setProgram(`${itemValue}`)}
            >
              {programsTemp.map((item, idx) => (
                <Select.Item
                  key={item.id}
                  label={item.definition}
                  value={item.definition}
                />
              ))}
            </Select>
          </FormControl>
        </VStack>
      </Box>
      <MonitoringProgramNavButtons navigation={navigation} program={program} />
    </>
  )
}

export default MonitoringProgramExisting
