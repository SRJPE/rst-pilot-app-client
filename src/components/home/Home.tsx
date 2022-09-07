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
  CircleIcon,
  PlayIcon,
  Flex,
  Heading,
} from 'native-base'
import Logo from '../Shared/Logo'
import BottomNavigator from './BottomNavigator'
const IMG = require('../../assets/chinook_salmon.jpeg')

export default function Home({ navigation }: { navigation: any }) {
  const handlePress = () => navigation.navigate('Trap Visit Data Entry')

  return (
    <Flex align='center'>
      <Heading>Welcome back Jordan!</Heading>

      <Text>Select the action you would like to preform.</Text>
      {/* <BottomNavigator /> */}
      <Button variant='solid' bg='primary' onPress={handlePress}>
        Enter a New Trap Visit
      </Button>
    </Flex>

    // <Flex align='center'>
    //   <VStack>
    //     <HStack>
    //       <Icon as={<CircleIcon />} />
    //       <Icon as={<PlayIcon />} />
    //     </HStack>
    //     <Avatar
    //       bg='green.500'
    //       // source={{
    //       //   uri: 'https://user-images.githubusercontent.com/22649273/186754977-50398ed3-47dc-4af8-a127-d2ddf155e7f1.jpeg',
    //       // }}
    //       size='2xl'
    //     ></Avatar>
    //     <VStack space={30}>
    //       <StatusBar style='auto' />

    //       <Button variant='solid' bg='primary' onPress={handlePress}>
    //         Enter a New Trap Visit
    //       </Button>
    //     </VStack>
    //     {/* </Center> */}
    //     {/* <BottomNavigator /> */}
    //   </VStack>
    // </Flex>
  )
}
