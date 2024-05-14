import React, { useState } from 'react'
import { Box, Button, Center, Heading, Icon, Text, VStack } from 'native-base'
import AppLogo from '../../components/Shared/AppLogo'
import { Ionicons } from '@expo/vector-icons'

const MonitoringProgramHome = ({ navigation }: { navigation: any }) => {
  return (
    <Box overflow='hidden' flex={1} bg='#fff'>
      <Center bg='primary' py='5%'>
        <AppLogo imageSize={200} />
      </Center>
      <VStack alignItems='center' py='5%' px='15%' space={10}>
        <Heading alignSelf='center'>Monitoring Program</Heading>
        <Text fontSize='2xl' color='grey'>
          Would you like to:
        </Text>
        <Button
          borderRadius={10}
          bg='primary'
          h='60px'
          w='400px'
          shadow='5'
          onPress={() => {
            navigation.navigate('Monitoring Program', {
              screen: 'Monitoring Program New',
            })
          }}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            Set up a new program
          </Text>
        </Button>
        <Button
          borderRadius={10}
          bg='primary'
          h='60px'
          w='400px'
          shadow='5'
          onPress={() => {
            navigation.navigate('Monitoring Program', {
              screen: 'Monitoring Program Existing',
            })
          }}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            Join an existing program
          </Text>
        </Button>
        <Button
          borderRadius={10}
          bg='primary'
          h='60px'
          w='400px'
          shadow='5'
          leftIcon={<Icon as={Ionicons} name='home' size='lg' color='white' />}
          onPress={() => {
            navigation.navigate('Home')
          }}
        >
          <Text fontSize='xl' fontWeight='bold' color='white'>
            Return Home
          </Text>
        </Button>
      </VStack>
    </Box>
  )
}

export default MonitoringProgramHome
