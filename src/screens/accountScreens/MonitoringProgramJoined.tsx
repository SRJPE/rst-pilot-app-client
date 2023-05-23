import React, { useState } from 'react'
import { Box, Button, Center, Heading, Text, VStack } from 'native-base'
import AppLogo from '../../components/Shared/AppLogo'

const MonitoringProgramJoined = ({ navigation }: { navigation: any }) => {
  return (
    <Box overflow='hidden' flex={1} bg='#fff'>
      <Center bg='primary' py='5%'>
        <AppLogo imageSize={200} />
      </Center>
      <VStack alignItems='center' py='5%' px='15%' space={10}>
        <Heading alignSelf='center'>Monitoring Program Joined!</Heading>
        <Text fontSize='2xl' color='grey'>
          Welcome to -program name-! You are all set to start trapping!
        </Text>

        <Button
          borderRadius={10}
          bg='primary'
          h='60px'
          w='450px'
          mt='200'
          shadow='5'
          onPress={() => {
            navigation.goBack()
          }}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            Join another Team
          </Text>
        </Button>
        <Button
          borderRadius={10}
          bg='primary'
          h='60px'
          w='450px'
          shadow='5'
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Monitoring Program Home' }],
            })
            navigation.navigate('Home')
          }}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            Got to Home
          </Text>
        </Button>
      </VStack>
    </Box>
  )
}

export default MonitoringProgramJoined
