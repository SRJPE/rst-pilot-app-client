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
import { AppLogo } from '../SignIn'
import { Feather } from '@expo/vector-icons'
import CreateNewProgramNavButtons from '../../components/createNewProgram/CreateNewProgramNavButtons'
const TrappingProtocols = ({ navigation }: { navigation: any }) => {
  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Center bg='primary' py='5%'>
          <AppLogo imageSize={200} />
        </Center>
        <VStack py='5%' px='10%' space={5}>
          <Heading alignSelf='center'>Rotary Screw Trap Protocols</Heading>
          <Text fontSize='lg' color='grey'>
            Upload PDF of Rotary Screw Trap Monitoring Protocols
          </Text>
          <Pressable alignSelf='center'>
            <Center
              h='150'
              w='650'
              borderWidth='2'
              borderColor='grey'
              borderStyle='dotted'
            >
              <Icon as={Feather} name='plus' size='5xl' color='grey' />
            </Center>
          </Pressable>
        </VStack>
      </Box>
      <CreateNewProgramNavButtons navigation={navigation} />
    </>
  )
}

export default TrappingProtocols
