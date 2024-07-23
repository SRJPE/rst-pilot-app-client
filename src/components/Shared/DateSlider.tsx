import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider'
import moment from 'moment'
import { on } from 'events'
import { Button, HStack, Text } from 'native-base'

const DateSlider = ({
  minDate,
  maxDate,
  onDateChange,
}: {
  minDate: Date
  maxDate: Date
  onDateChange: (date: string) => void
}) => {
  const [sliderValue, setSliderValue] = useState(0)

  // Calculate the total number of days between minDate and maxDate
  const totalDays = moment(maxDate).diff(moment(minDate), 'days')

  // Calculate the selected date based on slider value
  const transformToDate = (value: number) => {
    return moment(minDate).add(value, 'days').format('YYYY-MM-DD')
  }

  const selectedDate = transformToDate(sliderValue)

  return (
    <HStack flex={2}>
      <View style={styles.container}>
        <Text style={styles.dateText}>Selected Date: {selectedDate}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={totalDays}
          step={1}
          value={sliderValue}
          onValueChange={(value) => {
            setSliderValue(value)
          }}
          minimumTrackTintColor='#1EB1FC'
          maximumTrackTintColor='#d3d3d3'
          thumbTintColor='#1EB1FC'
        />
      </View>
      <View>
        <Button
          bg='primary'
          shadow='3'
          onPress={() => {
            onDateChange(transformToDate(sliderValue))
          }}
        >
          <Text fontSize='xl' color='white'>
            Save
          </Text>
        </Button>
      </View>
    </HStack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
  },
  dateText: {
    fontSize: 18,
    // marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
})

export default DateSlider
