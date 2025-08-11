import React from 'react'
import { VStack } from 'native-base'
import GenerateReportStackNavigator from '../GenerateReportStackNavigator'

export default function GenerateReport({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      <GenerateReportStackNavigator />
    </VStack>
  )
}
