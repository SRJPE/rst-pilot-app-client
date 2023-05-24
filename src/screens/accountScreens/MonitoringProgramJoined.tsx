import React, { useState } from 'react'
import { Box, Button, Center, Heading, Text, VStack } from 'native-base'
import AppLogo from '../../components/Shared/AppLogo'
import MonitoringProgramNavButtons from '../../components/monitoringProgram/MonitoringProgramNavButtons'

const MonitoringProgramJoined = ({ navigation }: { navigation: any }) => {
  return (
    <>
      <Box overflow='hidden' flex={1} bg='#fff'>
        <Center bg='primary' py='5%'>
          <AppLogo imageSize={200} />
        </Center>
        <VStack alignItems='center' py='5%' px='15%' space={10}>
          <Heading alignSelf='center'>Monitoring Program Joined!</Heading>
          <Text fontSize='2xl' color='grey'>
            Welcome to -program name-! You are all set to start trapping!
          </Text>
        </VStack>
      </Box>
      <MonitoringProgramNavButtons navigation={navigation} />
    </>
  )
}

export default MonitoringProgramJoined
