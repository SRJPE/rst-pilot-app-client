import React, { useEffect, useRef, useState } from 'react'
import { DeviceEventEmitter } from 'react-native'
import { VStack, Image, Icon } from 'native-base'
import { View, Text } from 'react-native'
import { Animated, Easing } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface LoadingScreenProps {
  navigation: any
}

const LoadingScreen = ({ navigation }: LoadingScreenProps) => {
  const spinValue = useRef(new Animated.Value(0)).current
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const subscriber = DeviceEventEmitter.addListener(
      'event.load',
      async (props: { process: any; callback: () => void }) => {
        const { process, callback } = props

        await loader(process, callback)
      }
    )

    return () => {
      console.log('hit load cleanup')
      subscriber.remove()
    }
  }, [])

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
  }, [])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  const loader = async (process: any, callback: () => void) => {
    try {
      process()
      callback()
    } catch (err) {
      console.log('hit load error, ', err)
      setIsError(true)
      setTimeout(() => {}, 2000)
      callback()
    }
  }

  return (
    <View>
      <VStack height={'full'} justifyContent={'center'} alignItems={'center'}>
        {!isError ? (
          <Animated.Image
            source={require('../../../assets/fish_splash_screen_icon.png')}
            style={{
              transform: [{ rotate: spin }],
            }}
            alt='loading icon logo'
          />
        ) : (
          <VStack
            height={'full'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Icon
              as={MaterialIcons}
              name={'error-outline'}
              size='250'
              color='primary'
            />
            <Text style={{fontSize: 25}}>Error occurred.</Text>
          </VStack>
        )}
      </VStack>
    </View>
  )
}

export default LoadingScreen
