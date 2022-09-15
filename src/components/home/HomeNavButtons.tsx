import React, { useCallback } from 'react'
import { Button, HStack, Flex } from 'native-base'

export default function BottomNavigation({ navigation }: { navigation: any }) {
  const handlePressQCData = useCallback(() => {
    navigation.navigate('Data Quality Control')
  }, [navigation])
  const handlePressTrapVisit = useCallback(() => {
    navigation.navigate('Trap Visit Form')
  }, [navigation])
  const handlePressGenerateReport = useCallback(() => {
    navigation.navigate('Generate Report')
  }, [navigation])

  return (
    <Flex align='center'>
      <HStack space={1}>
        <Button
          w='33%'
          variant='solid'
          bg='primary'
          onPress={handlePressQCData}
        >
          QC Data
        </Button>
        <Button
          w='33%'
          variant='solid'
          bg='primary'
          onPress={handlePressTrapVisit}
        >
          Collect Data
        </Button>
        <Button
          w='33%'
          variant='solid'
          bg='primary'
          onPress={handlePressGenerateReport}
        >
          Generate Report
        </Button>
      </HStack>
    </Flex>
  )
}
