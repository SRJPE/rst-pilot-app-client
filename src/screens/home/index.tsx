import React from 'react'
import { Text, VStack, CircleIcon, Flex, Heading, Center } from 'native-base'
import Logo from '../../components/Shared/Logo'
import BottomNavigation from '../../components/home/HomeNavButtons'
import TopIcons from '../../components/home/TopIcons'
import { View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
})

export default function Home({ navigation }: { navigation: any }) {
  return (
    <VStack
      height='full'
      space={100}
      alignItems='center'
      justifyContent='space-between'
    >
      <TopIcons />

      <View style={styles.contentContainer}>
        <CircleIcon size='300' color='primary' />
        <Heading fontWeight={300}>Welcome back, Jordan!</Heading>
        <Text>Select the action you would like to preform.</Text>
        <Center bg='secondary' h='100' w='90%'>
          <Text>Recent Items Placeholder</Text>
        </Center>
      </View>

      <BottomNavigation navigation={navigation} />
    </VStack>
  )
}
