import React from 'react'
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Pressable,
  Text,
  View,
  VStack,
} from 'native-base'
import { AppLogo } from '../SignIn'
import { Feather } from '@expo/vector-icons'
const TrappingProtocols = ({ navigation }: { navigation: any }) => {
  return (
    <Box overflow='hidden'>
      <Center
        bg='primary'
        _text={{
          alignSelf: 'center',
          color: '#FFF',
          fontWeight: '700',
          fontSize: 'xl',
        }}
        bottom='0'
        px='6'
        py='1.5'
      >
        <View>
          <AppLogo />
        </View>
      </Center>
      <Button my='5' mx='40' bg='primary' onPress={() => navigation.goBack()}>
        GO BACK
      </Button>
      <VStack py='5%' px='10%' space={5}>
        <Heading alignSelf='center'>Rotary Screw Trap Protocols</Heading>
        <Text fontSize='lg' color='grey'>
          Upload PDF of Rotary Screw Trap Monitoring Protocols{' '}
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
  )
}

export default TrappingProtocols
