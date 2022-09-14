import React from 'react'
import {
  Box,
  HStack,
  Image,
  VStack,
  Text,
  Pressable,
  Button,
} from 'native-base'
import { View } from 'react-native'
import NavButtons from './NavButtons'
import ProgressStepper from './ProgressStepper'
import VisitSetup from '../VisitSetup/VisitSetup'
import TrapStatus from '../TrapStatus/TrapStatus'
import FishInput from '../FishInput/FishInput'
import FishProcessing from '../FishProcessing/FishProcessing'

import TrapOperations from '../TrapOperations/TrapOperations'
import HighFlows from '../TrapStatus/HighFlows'
import HighTemperatures from '../TrapStatus/HighTemperatures'
import FormTabNavigation from './FormTabNavigation'

export default function TrapVisitForm({ navigation }: { navigation: any }) {
  // const renderFormSection = () => {
  //   const currentStepName = ''
  //   switch (currentStepName) {
  //     case 'Visit Setup':
  //       return <VisitSetup />
  //     case 'Trap Status':
  //       return <TrapStatus />
  //     case 'Trap Operations':
  //       return <TrapOperations />
  //   }
  // }

  return (
    <VStack h='full' justifyContent='space-between'>
      {/* <ProgressStepper /> */}
      <FormTabNavigation />
      <NavButtons navigation={navigation} />
    </VStack>
  )
}
