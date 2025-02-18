import React, { useEffect, useState } from 'react'
import { View, Text, Heading, Input, VStack, HStack } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'
import { TabStateI } from '../../redux/reducers/formSlices/tabSlice'
import { useFormikContext } from 'formik'

export default function WaterQuality({}) {
  return (
    <HStack space={5} width='100%' justifyContent='space-between'>
      <Heading>Water Quality</Heading>
    </HStack>
  )
}
