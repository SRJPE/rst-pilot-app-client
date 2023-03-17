import { Divider, HStack } from 'native-base'
import React from 'react'
import {
  Box,
  Center,
  Heading,
  Icon,
  Pressable,
  Text,
  VStack,
} from 'native-base'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
const ChooseFileModalContent = ({ closeModal }: { closeModal: any }) => {
  return (
    <>
      <HStack mx='4%' my='3' alignItems='center' justifyContent='space-between'>
        <Text fontSize='xl'>Choose File</Text>
        <Pressable onPress={closeModal}>
          <Icon as={Ionicons} name={'close'} size='5xl' color='black' />
        </Pressable>
      </HStack>
      <Divider />
      <Pressable>
        <HStack space={8} alignItems='center' mx='5%' my='5%'>
          <Icon
            as={Ionicons}
            name='checkmark-circle-outline'
            size='20'
            ml='2'
            color={'primary'}
          />
          <Text fontSize='xl'>Scan Document</Text>
        </HStack>
      </Pressable>
      <Divider />
      <Pressable>
        <HStack space={8} alignItems='center' mx='5%' my='5%'>
          <Icon
            as={MaterialIcons}
            name='picture-as-pdf'
            size='20'
            ml='2'
            color={'primary'}
          />
          <Text fontSize='xl'>Upload File</Text>
        </HStack>
      </Pressable>
    </>
  )
}

export default ChooseFileModalContent
