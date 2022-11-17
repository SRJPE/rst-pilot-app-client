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
  Checkbox,
} from 'native-base'
import { useEffect, useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import NavButtons from '../../components/formContainer/NavButtons'
import {
  markPaperEntryCompleted,
  savePaperEntry,
} from '../../redux/reducers/formSlices/paperEntrySlice'
import { connect, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'

const mapStateToProps = (state: RootState) => {
  return {
    historicalDataStore: state.paperEntry.values,
  }
}

const PaperEntry = ({
  navigation,
  historicalDataStore,
}: {
  navigation: any
  historicalDataStore: any
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [checkboxGroupValues, setCheckboxGroupValues] = useState([
    'end same as start',
  ])
  const [endDate, setEndDate] = useState(new Date('01/01/2022') as any)
  const [startDate, setStartDate] = useState(new Date('01/01/2022') as any)
  const [comments, setComments] = useState(
    historicalDataStore.comments as string
  )

  useEffect(() => {
    //use the values from the store if they are not null
    if (historicalDataStore.startDate) {
      setEndDate(historicalDataStore.startDate)
    }
    if (historicalDataStore.endDate) {
      setEndDate(historicalDataStore.endDate)
    }
  }, [])

  const onStartDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setStartDate(currentDate)
  }

  const onEndDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate
    setEndDate(currentDate)
  }

  const handleSubmit = () => {
    //only set end date if it exists
    if (checkboxGroupValues.length > 0) {
      dispatch(
        savePaperEntry({
          comments,
          startDate,
          endDate: null,
        })
      )
    } else {
      dispatch(
        savePaperEntry({
          comments,
          startDate,
          endDate,
        })
      )
    }
    dispatch(markPaperEntryCompleted(true))
  }
  console.log(startDate.toLocaleString())
  return (
    <>
      <View flex={1} bg='#fff' p='6%' borderColor='themeGrey' borderWidth='15'>
        <VStack space={5}>
          <Heading mb='4'>Select the date and time of the trap visit:</Heading>
          <HStack space={4} alignItems='center'>
            <Text color='black' fontSize='xl'>
              Start Date:
            </Text>
            <Box alignSelf='center' minWidth='320' ml='-100'>
              <DateTimePicker
                value={startDate}
                mode='datetime'
                onChange={onStartDateChange}
                accentColor='#007C7C'
              />
            </Box>
          </HStack>

          <Checkbox.Group
            colorScheme='green'
            onChange={(value) => {
              setCheckboxGroupValues(value)
              setEndDate(new Date('01/01/2022'))
            }}
            defaultValue={checkboxGroupValues}
            accessibilityLabel='choose numbers'
          >
            <Checkbox
              value='end same as start'
              my={2}
              _checked={{ bg: 'primary', borderColor: 'primary' }}
            >
              End date is the same as start date
            </Checkbox>
          </Checkbox.Group>

          {checkboxGroupValues.length < 1 && (
            <HStack space={4} alignItems='center'>
              <Text color='black' fontSize='xl'>
                End Date:
              </Text>
              <Box alignSelf='center' minWidth='320' ml='-100'>
                <DateTimePicker
                  value={endDate}
                  mode='datetime'
                  onChange={onEndDateChange}
                  accentColor='#007C7C'
                />
              </Box>
            </HStack>
          )}
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
              onChangeText={(newText) => {
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
export default connect(mapStateToProps)(PaperEntry)