import React from 'react'
import { Box, HStack, Image, VStack, Text, Pressable } from 'native-base'
import { View } from 'react-native'
import NavButtons from './NavButtons'

export default function NativeBaseBoxDemo() {
  return (
    <View>
      <VStack justifyContent='space-between'>
        <Box
          bg='primary'
          py='4'
          px='3'
          // borderRadius='5'
          // rounded='md'
          // width={375}
          maxWidth='100%'
        >
          <HStack justifyContent='space-between'>
            <Box justifyContent='space-between'>
              <VStack space='2'>
                <Text fontSize='sm' color='white'>
                  Text 1
                </Text>
                <Text color='white' fontSize='xl'>
                  Text 2
                </Text>
              </VStack>
              <Pressable
                rounded='xs'
                bg='primary.400'
                alignSelf='flex-start'
                py='1'
                px='3'
              >
                <Text
                  textTransform='uppercase'
                  fontSize='sm'
                  fontWeight='bold'
                  color='white'
                >
                  Button Text
                </Text>
              </Pressable>
            </Box>
            <Image
              source={{
                uri: 'https://user-images.githubusercontent.com/22649273/186754977-50398ed3-47dc-4af8-a127-d2ddf155e7f1.jpeg',
              }}
              alt='Chinook Salmon Logo'
              height='100'
              rounded='full'
              width='100'
            />
          </HStack>
        </Box>
        <NavButtons />
      </VStack>
    </View>
  )
}
