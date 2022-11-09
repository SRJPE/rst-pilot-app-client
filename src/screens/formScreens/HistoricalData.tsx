import {
  Text,
  View,
  VStack,
  Box,
  Heading,
  Input,
  HStack,
  Divider,
} from 'native-base'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import NavButtons from '../../components/formContainer/NavButtons'

export default function HistoricalData({ navigation }: { navigation: any }) {
  const [startDate, setStartDate] = useState(new Date(1598051730000) as any)
  const [startTime, setStartTime] = useState(new Date(1598051730000) as any)
  const [endDate, setEndDate] = useState(new Date(1598051730000) as any)
  const [endTime, setEndTime] = useState(new Date(1598051730000) as any)

  const onStartDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setStartDate(currentDate)
  }
  const onStartTimeChange = (event: any, selectedTime: any) => {
    const currentTime = selectedTime
    setStartTime(currentTime)
  }
  const onEndDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setEndDate(currentDate)
  }
  const onEndTimeChange = (event: any, selectedTime: any) => {
    const currentTime = selectedTime
    setEndTime(currentTime)
  }

  return (
    <>
      <View flex={1} bg='#fff' p='6%' borderColor='themeGrey' borderWidth='15'>
        <VStack space={5}>
          <Heading mb='4'>Select the date and time of the trap visit:</Heading>
          <Heading color='black' fontSize='xl'>
            Option 1:
          </Heading>
          <HStack space={4} alignItems='center'>
            <Text color='black' fontSize='xl'>
              Start Date:
            </Text>
            <Input
              w='1/4'
              height='50px'
              fontSize='16'
              placeholderTextColor='black'
              placeholder={startDate.toLocaleDateString()}
              keyboardType='numeric'
              // onChangeText={handleChange('waterTurbidity')}
              // onBlur={handleBlur('waterTurbidity')}
              value={startDate.toLocaleDateString()}
            ></Input>
            <Box alignSelf='center' minWidth='130'>
              <DateTimePicker
                testID='dateTimePicker'
                value={startDate}
                mode='date'
                is24Hour={true}
                onChange={onStartDateChange}
                accentColor='#007C7C'
              />
            </Box>
          </HStack>
          <HStack space={4} alignItems='center'>
            <Text color='black' fontSize='xl'>
              Start Time:
            </Text>
            <Input
              w='1/4'
              height='50px'
              fontSize='16'
              placeholderTextColor='black'
              placeholder={startTime.toLocaleTimeString([], {
                timeStyle: 'short',
              })}
              keyboardType='numeric'
            ></Input>
            <Box alignSelf='center' minWidth='90'>
              <DateTimePicker
                testID='dateTimePicker'
                value={startTime}
                mode='time'
                is24Hour={true}
                onChange={onStartTimeChange}
                accentColor='#007C7C'
              />
            </Box>
          </HStack>
          <Divider />
          <HStack space={4} alignItems='center'>
            <Text color='black' fontSize='xl'>
              End Date:
            </Text>
            <Input
              w='1/4'
              height='50px'
              fontSize='16'
              placeholderTextColor='black'
              placeholder={startDate.toLocaleDateString()}
              keyboardType='numeric'
              // onChangeText={handleChange('waterTurbidity')}
              // onBlur={handleBlur('waterTurbidity')}
              value={startDate.toLocaleDateString()}
            ></Input>
            <Box alignSelf='center' minWidth='130'>
              <DateTimePicker
                testID='dateTimePicker'
                value={endDate}
                mode='date'
                is24Hour={true}
                onChange={onEndDateChange}
                accentColor='#007C7C'
              />
            </Box>
          </HStack>
          <HStack space={4} alignItems='center'>
            <Text color='black' fontSize='xl'>
              End Time:
            </Text>
            <Input
              w='1/4'
              height='50px'
              fontSize='16'
              placeholderTextColor='black'
              placeholder={endTime.toLocaleTimeString([], {
                timeStyle: 'short',
              })}
              keyboardType='numeric'
            ></Input>
            <Box alignSelf='center' minWidth='90'>
              <DateTimePicker
                testID='dateTimePicker'
                value={endTime}
                mode='time'
                is24Hour={true}
                onChange={onEndTimeChange}
                accentColor='#007C7C'
              />
            </Box>
          </HStack>
          <Divider />

          <Heading color='black' fontSize='xl'>
            Option 2:
          </Heading>
          <HStack space={4} alignItems='center'>
            <Text color='black' fontSize='xl'>
              Start Date:
            </Text>

            <Box alignSelf='center' minWidth='130'>
              <DateTimePicker
                testID='dateTimePicker'
                value={startDate}
                mode='date'
                is24Hour={true}
                onChange={onStartDateChange}
                accentColor='#007C7C'
              />
            </Box>

            <Box alignSelf='center' minWidth='90'>
              <DateTimePicker
                testID='dateTimePicker'
                value={startTime}
                mode='time'
                is24Hour={true}
                onChange={onStartTimeChange}
                accentColor='#007C7C'
              />
            </Box>
          </HStack>
          <HStack space={4} alignItems='center'>
            <Text color='black' fontSize='xl'>
              End Date:{'  '}
            </Text>
            <Box alignSelf='center' minWidth='130'>
              <DateTimePicker
                testID='dateTimePicker'
                value={endDate}
                mode='date'
                is24Hour={true}
                onChange={onEndDateChange}
                accentColor='#007C7C'
              />
            </Box>
            <Box alignSelf='center' minWidth='90'>
              <DateTimePicker
                testID='dateTimePicker'
                value={endTime}
                mode='time'
                is24Hour={true}
                onChange={onEndTimeChange}
                accentColor='#007C7C'
              />
            </Box>
          </HStack>
        </VStack>
      </View>
      <NavButtons navigation={navigation} />
    </>
  )
}
