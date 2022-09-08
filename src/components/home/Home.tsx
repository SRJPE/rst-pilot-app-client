import React, { useCallback } from 'react'
import { Text, VStack, CircleIcon, Flex, Heading, Center } from 'native-base'
import { StatusBar } from 'expo-status-bar'
import Logo from '../Shared/Logo'
import BottomNavigation from './BottomNavigation'
import TopIcons from './TopIcons'
const IMG = require('../../assets/chinook_salmon.jpeg')

export default function Home({ navigation }: { navigation: any }) {
  return (
    <Flex>
      <VStack space={100} alignItems='center' justifyContent='space-between'>
        <TopIcons />
        {/* <Logo /> */}
        <CircleIcon size='300' color='primary' />
        <Heading>Welcome back, Jordan!</Heading>
        <Text>Select the action you would like to preform.</Text>
        <Center bg='secondary' h='100' w='90%'>
          <Text>Recent Items Placeholder</Text>
        </Center>
        <BottomNavigation navigation={navigation} />
      </VStack>
    </Flex>
  )
}
