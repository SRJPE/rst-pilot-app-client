import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native'

export default function Home({ navigation }: { navigation: any }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <StatusBar style='auto' />
      <Button
        title='Enter and New Trap Visit'
        onPress={() => navigation.navigate('Trap Visit Data Entry')}
      />
      <Button
        title='See NativeBase Box Demo'
        onPress={() => navigation.navigate('Native Box Demo')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
