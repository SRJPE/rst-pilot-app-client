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
} from 'native-base'
import AppLogo from '../../components/Shared/AppLogo'

const MonitoringProgramExisting = ({ navigation }: { navigation: any }) => {
  const [service, setService] = React.useState('')
  return (
    <Box overflow='hidden' flex={1} bg='#fff'>
      <Center bg='primary' py='5%'>
        <AppLogo imageSize={200} />
      </Center>
      <VStack alignItems='center' py='5%' px='15%' space={10}>
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
            selectedValue={service}
            height='50px'
            fontSize='16'
            w='100%'
            accessibilityLabel='Choose Program'
            placeholder='Choose Service'
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size='5' />,
            }}
            mt={1}
            onValueChange={(itemValue) => setService(itemValue)}
          >
            <Select.Item label='Program 1' value='p1' />
            <Select.Item label='Program 2' value='p2' />
            <Select.Item label='Program 3' value='p3' />
            <Select.Item label='Program 4' value='p4' />
            <Select.Item label='Program 5' value='p5' />
          </Select>
        </FormControl>
        <Button
          borderRadius={10}
          bg='primary'
          h='60px'
          w='450px'
          shadow='5'
          onPress={() => {
            navigation.navigate('Monitoring Program Joined')
          }}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            Join Team
          </Text>
        </Button>
        <Button
          borderRadius={10}
          bg='primary'
          h='60px'
          w='450px'
          mt='100'
          shadow='5'
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            Back
          </Text>
        </Button>
      </VStack>
    </Box>
  )
}

export default MonitoringProgramExisting
