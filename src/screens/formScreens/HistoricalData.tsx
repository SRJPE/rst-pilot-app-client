import {
  Text,
  View,
  VStack,
  Box,
  Heading,
  Input,
  HStack,
  Divider,
  FormControl,
} from 'native-base'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import NavButtons from '../../components/formContainer/NavButtons'
import {
  markHistoricalDataCompleted,
  saveHistoricalData,
} from '../../redux/reducers/formSlices/historicalDataSlice'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'

const mapStateToProps = (state: RootState) => {
  return {
    historicalDataStore: state.historicalData.values,
  }
}

const HistoricalData = ({
  navigation,
  historicalDataStore,
}: {
  navigation: any
  historicalDataStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [startDate, setStartDate] = useState(
    historicalDataStore.startDate as any
  )
  const [endDate, setEndDate] = useState(historicalDataStore.endDate as any)
  const [comments, setComments] = useState(
    historicalDataStore.comments as string
  )

  const onStartDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setStartDate(currentDate)
  }

  const onEndDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setEndDate(currentDate)
  }

  const handleSubmit = () => {
    dispatch(
      saveHistoricalData({
        comments,
        startDate,
        endDate,
      })
    )
    dispatch(markHistoricalDataCompleted(true))
  }

  return (
    <>
      <View flex={1} bg='#fff' p='6%' borderColor='themeGrey' borderWidth='15'>
        <VStack space={5}>
          <Heading mb='4'>Select the date and time of the trap visit:</Heading>

          <HStack space={4} alignItems='center'>
            <Text color='black' fontSize='xl'>
              Start Date:
            </Text>

            <Box alignSelf='center' minWidth='130'>
              <DateTimePicker
                value={startDate}
                mode='date'
                onChange={onStartDateChange}
                accentColor='#007C7C'
              />
            </Box>

            <Box alignSelf='center' minWidth='90'>
              <DateTimePicker
                value={startDate}
                mode='time'
                onChange={onStartDateChange}
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
                value={endDate}
                mode='date'
                onChange={onEndDateChange}
                accentColor='#007C7C'
              />
            </Box>
            <Box alignSelf='center' minWidth='90'>
              <DateTimePicker
                value={endDate}
                mode='time'
                onChange={onEndDateChange}
                accentColor='#007C7C'
              />
            </Box>
          </HStack>
          <FormControl>
            <FormControl.Label>
              <Text color='black' fontSize='xl'>
                Comments
              </Text>
            </FormControl.Label>
            <Input
              height='50px'
              fontSize='16'
              placeholder='Write a comment'
              keyboardType='default'
              onChangeText={newText => {
                setComments(newText)
              }}
              value={comments}
            />
          </FormControl>
        </VStack>
      </View>
      <NavButtons navigation={navigation} handleSubmit={handleSubmit} />
    </>
  )
}
export default connect(mapStateToProps)(HistoricalData)
