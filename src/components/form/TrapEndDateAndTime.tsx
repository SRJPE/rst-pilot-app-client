import React, { useMemo } from 'react'
import { Text, HStack, Box, FormControl, Popover, VStack } from 'native-base'
import DateTimePicker from '@react-native-community/datetimepicker'

const TrapEndDateAndTime = ({
  endTime,
  onEndTimeChange,
  popoverTrigger,
  trapRestart,
}: {
  endTime: any
  onEndTimeChange: any
  popoverTrigger: any
  trapRestart: boolean
}) => {
  return (
    <FormControl>
      <VStack space={2}>
        <HStack space={2}>
          <FormControl.Label>
            <Text color='black' fontSize='xl'>
              Trapping {trapRestart ? 'Start' : 'End'} Date and Time:
            </Text>
            <Popover placement='bottom left' trigger={popoverTrigger}>
              <Popover.Content
                accessibilityLabel='Trap Visit End Info'
                w='600'
                mr='10'
              >
                <Popover.Arrow />
                <Popover.CloseButton />
                <Popover.Header>
                  Please set the Date and Time of when you removed the trap to
                  collect data and ended the current trapping period.
                </Popover.Header>
                <Popover.Body p={4}>
                  <VStack space={2}>
                    <HStack space={2} alignItems='flex-start'>
                      <Text fontSize='md'>
                        This value is used to record the date and time of ending
                        the current trapping period and removing the trap from
                        the water to collect data.
                      </Text>
                    </HStack>
                    <HStack space={2} alignItems='flex-start'>
                      <Text fontSize='md'>
                        At the end of this form during the Post Processing step,
                        if you continue trapping, you will set the "Trapping
                        Start Date and Time" to record the time of starting the
                        trap again.
                      </Text>
                    </HStack>
                  </VStack>
                </Popover.Body>
              </Popover.Content>
            </Popover>
          </FormControl.Label>
        </HStack>
        <Box alignSelf='flex-start' ml='-2'>
          {endTime ? (
            <DateTimePicker
              value={endTime}
              mode='datetime'
              onChange={onEndTimeChange}
              accentColor='#007C7C'
            />
          ) : null}
        </Box>
      </VStack>
    </FormControl>
  )
}

export default TrapEndDateAndTime
