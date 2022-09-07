import React from 'react'
import { Box, HStack, Image, VStack, Text, Pressable } from 'native-base'
import { View } from 'react-native'
import NavButtons from './NavButtons'
import ProgressStepper from './ProgressStepper'
import VisitSetup from '../VisitSetup/VisitSetup'
import TrapStatus from '../TrapStatus/TrapStatus'

export default function TrapVisitForm({ navigation }: { navigation: any }) {
  return (
    <VStack h='full' justifyContent='space-between'>
      <ProgressStepper />
      {/* <VisitSetup /> */}
      <TrapStatus />

      <NavButtons navigation={navigation} />
    </VStack>
  )
}
