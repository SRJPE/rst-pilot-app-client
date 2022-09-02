import React from 'react'
import { Box, HStack, Image, VStack, Text, Pressable } from 'native-base'
import { View } from 'react-native'
import NavButtons from './NavButtons'
import ProgressStepper from './ProgressStepper'
import VisitSetup from '../VisitSetup/VisitSetup'

export default function TrapVisitForm() {
  return (
    <View>
      <VStack justifyContent='space-between'>
        <ProgressStepper />
        <VisitSetup />
        <NavButtons />
      </VStack>
    </View>
  )
}
