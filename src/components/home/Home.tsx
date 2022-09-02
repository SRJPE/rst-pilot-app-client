import React from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  Center,
  Button,
  Text,
  Box,
  VStack,
  Image,
  View,
  Avatar,
  HStack,
  Icon,
} from 'native-base'
import Logo from '../Shared/Logo'
const IMG = require('../../assets/chinook_salmon.jpeg')

export default function Home({ navigation }: { navigation: any }) {
  return (
    <VStack>
      <HStack>
        <Icon />
        <Icon />
      </HStack>
      <Avatar
        bg='green.500'
        source={{
          uri: 'https://user-images.githubusercontent.com/22649273/186754977-50398ed3-47dc-4af8-a127-d2ddf155e7f1.jpeg',
        }}
        size='2xl'
      ></Avatar>
      <Center alignItems='center'>
        <VStack space={30}>
          <StatusBar style='auto' />
          {/* <View style={styles.circleLogo}>
          <Image
          source={{
            uri: IMG,
          }}
          style={[styles.salmonLogo, { transform: [{ rotate: '-50deg' }] }]}
          />
        </View> */}
          {/* <Image
            size={150}
            borderRadius={100}
            source={{
              uri: IMG,
            }}
            alt='Alternate Text adadfadfasdff'
          /> */}

          <Button
            variant='solid'
            bg='primary'
            onPress={() => navigation.navigate('Trap Visit Data Entry')}
          >
            Enter and New Trap Visit
          </Button>
        </VStack>
      </Center>
    </VStack>
  )
}
